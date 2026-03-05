import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { createSupabaseServer } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! })

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(request: Request) {
  try {
    // 1. Auth check
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Voce precisa estar logado para usar o provador virtual.' },
        { status: 401 }
      )
    }

    // 2. Parse body
    const body = await request.json()
    const { userPhoto, productId, productImageUrl } = body

    if (!userPhoto || !productId || !productImageUrl) {
      return NextResponse.json(
        { error: 'Dados incompletos. Envie foto, produto e imagem do produto.' },
        { status: 400 }
      )
    }

    // 3. Validate user photo
    const photoMatch = userPhoto.match(/^data:(image\/(jpeg|png|webp));base64,(.+)$/)
    if (!photoMatch) {
      return NextResponse.json(
        { error: 'Formato de imagem invalido. Use JPEG, PNG ou WebP.' },
        { status: 400 }
      )
    }

    const mimeType = photoMatch[1]
    const photoBase64 = photoMatch[3]
    const photoSize = Buffer.from(photoBase64, 'base64').length

    if (!ALLOWED_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: 'Formato nao suportado. Use JPEG, PNG ou WebP.' },
        { status: 400 }
      )
    }

    if (photoSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Imagem muito grande. Tamanho maximo: 5MB.' },
        { status: 400 }
      )
    }

    // 4. Rate limit check (1 per day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { count, error: countError } = await supabaseAdmin
      .from('virtual_tryon_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', today.toISOString())

    if (countError) {
      console.error('Error checking usage:', countError)
      return NextResponse.json(
        { error: 'Erro ao verificar limite de uso.' },
        { status: 500 }
      )
    }

    if (count && count >= 1) {
      return NextResponse.json(
        { error: 'Voce ja usou o provador virtual hoje. Tente novamente amanha!' },
        { status: 429 }
      )
    }

    // 5. Fetch product image
    const productImageRes = await fetch(productImageUrl)
    if (!productImageRes.ok) {
      return NextResponse.json(
        { error: 'Nao foi possivel carregar a imagem do produto.' },
        { status: 400 }
      )
    }

    const productImageBuffer = await productImageRes.arrayBuffer()
    const productImageBase64 = Buffer.from(productImageBuffer).toString('base64')
    const productContentType = productImageRes.headers.get('content-type') || 'image/jpeg'

    // 6. Call Gemini (try primary model, fallback to secondary)
    const IMAGE_MODELS = [
      'gemini-2.5-flash-image',
      'gemini-2.0-flash-exp-image-generation',
    ]

    const prompt = `You are a professional virtual try-on system for a sports jersey store.
Take the person in the FIRST image and realistically dress them in the jersey/shirt shown in the SECOND image.
- Keep face, body, pose, skin tone EXACTLY as they are
- Replace ONLY top clothing with the jersey
- Maintain realistic wrinkles, shadows, lighting
- Keep background and lower body unchanged
- Jersey design, colors, logos must be accurate
- Output a single photorealistic image`

    const contents = [
      {
        role: 'user' as const,
        parts: [
          { text: prompt },
          { inlineData: { mimeType: mimeType, data: photoBase64 } },
          { inlineData: { mimeType: productContentType, data: productImageBase64 } },
        ],
      },
    ]

    let generatedImage: { data: string; mimeType: string } | null = null
    let lastError: string | null = null

    for (const modelName of IMAGE_MODELS) {
      try {
        const response = await genai.models.generateContent({
          model: modelName,
          contents,
          config: { responseModalities: ['IMAGE', 'TEXT'] },
        })

        const parts = response.candidates?.[0]?.content?.parts
        if (parts) {
          for (const part of parts) {
            if (part.inlineData) {
              generatedImage = {
                data: part.inlineData.data!,
                mimeType: part.inlineData.mimeType!,
              }
              break
            }
          }
        }

        if (generatedImage) break
      } catch (modelError: unknown) {
        const errMsg = modelError instanceof Error ? modelError.message : String(modelError)
        console.error(`Model ${modelName} failed:`, errMsg)

        if (errMsg.includes('429') || errMsg.includes('quota')) {
          return NextResponse.json(
            { error: 'Limite de uso da IA atingido. Tente novamente em alguns minutos.' },
            { status: 429 }
          )
        }

        lastError = errMsg
      }
    }

    if (!generatedImage) {
      console.error('All image models failed. Last error:', lastError)
      return NextResponse.json(
        { error: 'A IA nao conseguiu gerar a imagem. Tente com outra foto ou angulo diferente.' },
        { status: 500 }
      )
    }

    // 8. Record usage
    const { error: insertError } = await supabaseAdmin
      .from('virtual_tryon_usage')
      .insert({ user_id: user.id, product_id: productId })

    if (insertError) {
      console.error('Error recording usage:', insertError)
    }

    // 9. Return generated image
    return NextResponse.json({
      image: `data:${generatedImage.mimeType};base64,${generatedImage.data}`,
    })
  } catch (error) {
    console.error('Virtual try-on error:', error)
    return NextResponse.json(
      { error: 'Erro interno. Tente novamente mais tarde.' },
      { status: 500 }
    )
  }
}
