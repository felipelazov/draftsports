import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4'
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
    const path = `videos/${filename}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from('product-images')
      .upload(path, buffer, {
        contentType: file.type || 'video/mp4',
        upsert: false,
      })

    if (uploadError) throw uploadError

    const { data: urlData } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(path)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error) {
    console.error('Error uploading video:', error)
    return NextResponse.json({ error: 'Erro ao fazer upload do vídeo' }, { status: 500 })
  }
}
