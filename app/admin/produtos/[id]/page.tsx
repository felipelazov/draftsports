'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ProductForm } from '@/components/admin/ProductForm'
import type { Product } from '@/types'

export default function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Produto não encontrado')
        return res.json()
      })
      .then(({ product }) => setProduct(product))
      .catch(() => setError('Produto não encontrado.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (data: Omit<Product, 'id' | 'created_at'>) => {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Erro ao atualizar produto')
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
        <h1 className="text-2xl font-black text-[var(--text)]">Editar Produto</h1>
        <p className="text-sm text-[var(--text-secondary)]">Atualize os dados do produto</p>
      </div>

      <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)]">
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 rounded-lg animate-shimmer" />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        ) : product ? (
          <ProductForm product={product} onSubmit={handleSubmit} />
        ) : null}
      </div>
    </div>
  )
}
