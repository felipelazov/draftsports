'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ProductForm } from '@/components/admin/ProductForm'
import type { Product } from '@/types'

export default function NovoProdutoPage() {
  const router = useRouter()

  const handleSubmit = async (data: Omit<Product, 'id' | 'created_at'>) => {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Erro ao criar produto')
    }
    router.push('/admin/produtos')
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/produtos"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>
        <h1 className="text-2xl font-black text-[var(--text)]">Novo Produto</h1>
        <p className="text-sm text-[var(--text-secondary)]">Preencha os dados do novo produto</p>
      </div>

      <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)]">
        <ProductForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
