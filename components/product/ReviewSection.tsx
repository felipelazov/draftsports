'use client'

import { motion } from 'framer-motion'
import { Star, ThumbsUp } from 'lucide-react'
import { Rating } from '@/components/ui/Rating'

interface ReviewSectionProps {
  rating: number
  reviewCount: number
}

const mockReviews = [
  {
    id: '1',
    name: 'Lucas M.',
    rating: 5,
    comment: 'Qualidade incrível! O tecido é muito confortável e o acabamento é perfeito. Recomendo demais!',
    date: '2026-02-28',
    helpful: 12,
  },
  {
    id: '2',
    name: 'Ana P.',
    rating: 4,
    comment: 'Camisa muito bonita, chegou rápido. Só achei um pouco apertada, recomendo pegar um tamanho acima.',
    date: '2026-02-25',
    helpful: 8,
  },
  {
    id: '3',
    name: 'Rafael S.',
    rating: 5,
    comment: 'Presente para meu irmão, ele adorou! Qualidade premium, vale cada centavo.',
    date: '2026-02-20',
    helpful: 5,
  },
]

export function ReviewSection({ rating, reviewCount }: ReviewSectionProps) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-[#2D3436] mb-6">
        Avaliações dos Clientes
      </h2>

      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-8 bg-[#F8F9FE] rounded-2xl p-6 mb-8">
        <div className="text-center sm:text-left">
          <div className="text-5xl font-black text-[#2D3436]">
            {rating.toFixed(1)}
          </div>
          <Rating value={rating} size="md" />
          <p className="text-sm text-[#636E72] mt-1">
            {reviewCount} avaliações
          </p>
        </div>
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((stars) => {
            const percentage =
              stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : stars === 2 ? 2 : 1
            return (
              <div key={stars} className="flex items-center gap-2 mb-1">
                <span className="text-xs text-[#636E72] w-3">{stars}</span>
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full bg-yellow-400 rounded-full"
                  />
                </div>
                <span className="text-xs text-[#636E72] w-8">{percentage}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {mockReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-100 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#A29BFE] flex items-center justify-center text-white font-bold text-sm">
                  {review.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#2D3436]">
                    {review.name}
                  </p>
                  <Rating value={review.rating} />
                </div>
              </div>
              <span className="text-xs text-[#636E72]">
                {new Date(review.date).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <p className="text-sm text-[#636E72] leading-relaxed">
              {review.comment}
            </p>
            <button className="flex items-center gap-1.5 mt-3 text-xs text-[#636E72] hover:text-[#6C5CE7] transition-colors">
              <ThumbsUp size={14} />
              Útil ({review.helpful})
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
