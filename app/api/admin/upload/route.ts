import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files.length) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    const urls: string[] = []

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())

      // Convert any format (HEIC, PNG, JPG, WEBP, etc) to WebP
      const webpBuffer = await sharp(buffer)
        .webp({ quality: 85 })
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
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
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error('Error uploading images:', error)
    return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 })
  }
}
