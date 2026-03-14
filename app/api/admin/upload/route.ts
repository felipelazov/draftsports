import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const config = {
  api: {
    bodyParser: false,
  },
}

// Allow up to 25MB per request (multiple images)
export const maxDuration = 60
export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB per file

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files.length) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    const urls: string[] = []
    const errors: string[] = []

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: arquivo muito grande (max 20MB)`)
        continue
      }

      try {
        const buffer = Buffer.from(await file.arrayBuffer())

        // Convert any format (HEIC, HEIF, PNG, JPG, WEBP, AVIF, TIFF, GIF, BMP, SVG) to WebP
        const webpBuffer = await sharp(buffer)
          .rotate() // auto-rotate based on EXIF
          .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer()

        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`
        const path = `products/${filename}`

        const { error: uploadError } = await supabaseAdmin.storage
          .from('product-images')
          .upload(path, webpBuffer, {
            contentType: 'image/webp',
            upsert: false,
          })

        if (uploadError) throw uploadError

        const { data: urlData } = supabaseAdmin.storage
          .from('product-images')
          .getPublicUrl(path)

        urls.push(urlData.publicUrl)
      } catch (fileError) {
        const name = file.name || 'arquivo'
        console.error(`Error processing ${name}:`, fileError)
        errors.push(`${name}: formato nao suportado ou arquivo corrompido`)
      }
    }

    if (!urls.length && errors.length) {
      return NextResponse.json(
        { error: errors.join('; ') },
        { status: 400 }
      )
    }

    return NextResponse.json({ urls, ...(errors.length ? { warnings: errors } : {}) })
  } catch (error) {
    console.error('Error uploading images:', error)
    return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 })
  }
}
