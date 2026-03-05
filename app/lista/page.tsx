'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Heart, Loader2, ShoppingBag } from 'lucide-react'
import { ProductCard } from '@/components/catalog/ProductCard'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import type { Product } from '@/types'

function ListaContent() {
  const searchParams = useSearchParams()
  const ids = searchParams.get('ids')?.split(',').filter(Boolean) || []
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (ids.length === 0) {
      setLoading(false)
      return
    }

    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        const all: Product[] = data.products || []
        setProducts(all.filter((p) => ids.includes(p.id)))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="pt-20 lg:pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-[#6C5CE7]/10 flex items-center justify-center mx-auto mb-4">
            <Heart size={28} className="text-[#6C5CE7]" />
          </div>
          <h1 className="text-3xl font-black text-[#2D3436] mb-2">Lista de Desejos</h1>
          <p className="text-[#636E72]">Alguem compartilhou esses produtos com voce!</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#2D3436] mb-2">Lista vazia</h2>
            <p className="text-[#636E72] mb-6">
              Esta lista nao contem produtos ou o link e invalido.
            </p>
            <Link href="/catalogo">
              <Button>Explorar Catalogo</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/catalogo">
                <Button variant="secondary">Ver mais produtos</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function ListaCompartilhada() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
      </div>
    }>
      <ListaContent />
    </Suspense>
  )
}
