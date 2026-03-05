'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, X, Loader2, Video } from 'lucide-react'
import { slugify } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import type { Product, League, ProductType, Size, Team, StockPerSize } from '@/types'

interface ProductFormProps {
  product?: Product
  onSubmit: (data: Omit<Product, 'id' | 'created_at'>) => Promise<void>
}

const allLeagues: League[] = ['NBA', 'NFL', 'MLB', 'NHL', 'FUTEBOL', 'RETRO']
const allTypes: ProductType[] = ['titular', 'reserva', 'retro', 'especial']
const allSizes: Size[] = ['P', 'M', 'G', 'GG', 'XGG']

const colorPresets = [
  { name: 'Branco', hex: '#FFFFFF' },
  { name: 'Preto', hex: '#000000' },
  { name: 'Azul', hex: '#2563EB' },
  { name: 'Vermelho', hex: '#DC2626' },
  { name: 'Amarelo', hex: '#EAB308' },
  { name: 'Verde', hex: '#16A34A' },
  { name: 'Roxo', hex: '#7C3AED' },
  { name: 'Laranja', hex: '#EA580C' },
  { name: 'Rosa', hex: '#EC4899' },
  { name: 'Cinza', hex: '#6B7280' },
  { name: 'Dourado', hex: '#CA8A04' },
  { name: 'Marrom', hex: '#78350F' },
  { name: 'Vinho', hex: '#881337' },
  { name: 'Azul Marinho', hex: '#1E3A5F' },
  { name: 'Aqua', hex: '#06B6D4' },
  { name: 'Grená', hex: '#A50034' },
  { name: 'Azul Claro', hex: '#7DD3FC' },
]

const inputClass = 'w-full px-4 py-3 bg-[var(--bg)] rounded-xl border border-[var(--gray-200)] text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10'
const labelClass = 'block text-xs font-medium text-[var(--text-secondary)] mb-1.5'

export function ProductForm({ product, onSubmit }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState(product?.name || '')
  const [slug, setSlug] = useState(product?.slug || '')
  const [description, setDescription] = useState(product?.description || '')
  const [price, setPrice] = useState(product?.price?.toString() || '')
  const [originalPrice, setOriginalPrice] = useState(product?.original_price?.toString() || '')
  const [cost, setCost] = useState(product?.cost?.toString() || '')
  const [imageUrls, setImageUrls] = useState<string[]>(product?.images || [])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [videoUrl, setVideoUrl] = useState(product?.video_url || '')
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const [league, setLeague] = useState<League>(product?.league || 'NBA')
  const [team, setTeam] = useState(product?.team || '')
  const [player, setPlayer] = useState(product?.player || '')
  const [playerNumber, setPlayerNumber] = useState(product?.player_number || '')
  const [type, setType] = useState<ProductType>(product?.type || 'titular')
  const [sizes, setSizes] = useState<Size[]>(product?.sizes || ['M', 'G', 'GG'])
  const [stockPerSize, setStockPerSize] = useState<StockPerSize>(product?.stock_per_size || {})
  const [primaryColor, setPrimaryColor] = useState(product?.primary_color || '')
  const [secondaryColor, setSecondaryColor] = useState(product?.secondary_color || '')
  const [featured, setFeatured] = useState(product?.featured || false)
  const [rating, setRating] = useState(product?.rating?.toString() || '4.5')
  const [reviewCount, setReviewCount] = useState(product?.review_count?.toString() || '0')
  const [teams, setTeams] = useState<Team[]>([])
  const [teamsLoading, setTeamsLoading] = useState(false)

  const totalStock = Object.values(stockPerSize).reduce((sum, v) => sum + (v || 0), 0)

  useEffect(() => {
    setTeamsLoading(true)
    const leagueParam = ['NBA', 'NFL', 'MLB', 'NHL', 'FUTEBOL'].includes(league)
      ? `?league=${league}`
      : ''
    fetch(`/api/admin/teams${leagueParam}`)
      .then(res => res.json())
      .then(({ teams }) => {
        setTeams(teams || [])
        if (!product && teams && teams.length > 0) {
          const currentTeamExists = teams.some((t: Team) => t.name === team)
          if (!currentTeamExists) {
            setTeam('')
          }
        }
      })
      .catch(() => setTeams([]))
      .finally(() => setTeamsLoading(false))
  }, [league])

  // Slug auto-gerado a partir de liga+time+jogador+tipo+numero
  useEffect(() => {
    const parts = [league?.toLowerCase(), team, player, type, playerNumber].filter(Boolean)
    if (parts.length >= 2) {
      setSlug(slugify(parts.join(' ')))
    }
  }, [league, team, player, type, playerNumber])

  const toggleSize = (size: Size) => {
    setSizes(prev => {
      const newSizes = prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
      // Remover do stockPerSize se desativou
      if (prev.includes(size)) {
        setStockPerSize(sp => {
          const copy = { ...sp }
          delete copy[size]
          return copy
        })
      }
      return newSizes
    })
  }

  const updateStockForSize = (size: Size, qty: number) => {
    setStockPerSize(prev => ({ ...prev, [size]: qty }))
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    setUploading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach(f => formData.append('files', f))

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Upload falhou')

      const { urls } = await res.json()
      setImageUrls(prev => [...prev, ...urls])
    } catch {
      setError('Erro ao fazer upload das imagens.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingVideo(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload/video', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Upload falhou')

      const { url } = await res.json()
      setVideoUrl(url)
    } catch {
      setError('Erro ao fazer upload do vídeo.')
    } finally {
      setUploadingVideo(false)
      if (videoInputRef.current) videoInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !price || !team || sizes.length === 0) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        name,
        slug: slug || slugify(name),
        description,
        price: parseFloat(price),
        original_price: originalPrice ? parseFloat(originalPrice) : null,
        images: imageUrls,
        league,
        team,
        player: player || null,
        player_number: playerNumber || null,
        type,
        sizes,
        colors: [primaryColor, secondaryColor].filter(Boolean),
        stock: totalStock,
        cost: cost ? parseFloat(cost) : null,
        stock_per_size: stockPerSize,
        primary_color: primaryColor || null,
        secondary_color: secondaryColor || null,
        featured,
        video_url: videoUrl || null,
        rating: parseFloat(rating) || 0,
        review_count: parseInt(reviewCount) || 0,
      })
    } catch {
      setError('Erro ao salvar produto. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Name + Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nome *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Camisa Lakers #23 LeBron James"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Slug (auto-gerado)</label>
          <input
            type="text"
            value={slug}
            readOnly
            className={inputClass + ' bg-[var(--bg-sunken)] cursor-not-allowed'}
          />
        </div>
      </div>

      {/* Description - Rich Text Editor */}
      <div>
        <label className={labelClass}>Descrição</label>
        <RichTextEditor
          content={description}
          onChange={setDescription}
          placeholder="Escreva a descrição do produto..."
        />
      </div>

      {/* Price + Original Price + Cost + Stock Total */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className={labelClass}>Preço (R$) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="349.90"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Preço Original (R$)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={originalPrice}
            onChange={e => setOriginalPrice(e.target.value)}
            placeholder="449.90"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Custo (R$)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={cost}
            onChange={e => setCost(e.target.value)}
            placeholder="150.00"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Estoque Total</label>
          <input
            type="number"
            value={totalStock}
            readOnly
            className={inputClass + ' bg-[var(--bg-sunken)] cursor-not-allowed'}
          />
        </div>
      </div>

      {/* League + Type + Team */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Liga *</label>
          <select
            value={league}
            onChange={e => setLeague(e.target.value as League)}
            className={inputClass + ' cursor-pointer'}
          >
            {allLeagues.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Tipo *</label>
          <select
            value={type}
            onChange={e => setType(e.target.value as ProductType)}
            className={inputClass + ' cursor-pointer'}
          >
            {allTypes.map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Time *</label>
          {teams.length > 0 ? (
            <select
              value={team}
              onChange={e => setTeam(e.target.value)}
              required
              className={inputClass + ' cursor-pointer'}
              disabled={teamsLoading}
            >
              <option value="">Selecione um time</option>
              {teams.map(t => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={team}
              onChange={e => setTeam(e.target.value)}
              placeholder={teamsLoading ? 'Carregando times...' : 'Digite o nome do time'}
              required
              className={inputClass}
            />
          )}
        </div>
      </div>

      {/* Player + Player Number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Jogador</label>
          <input
            type="text"
            value={player}
            onChange={e => setPlayer(e.target.value)}
            placeholder="LeBron James"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Número da Camisa</label>
          <input
            type="text"
            value={playerNumber}
            onChange={e => setPlayerNumber(e.target.value)}
            placeholder="23"
            className={inputClass}
          />
        </div>
      </div>

      {/* Sizes + Stock per Size */}
      <div>
        <label className={labelClass}>Tamanhos e Estoque *</label>
        <div className="space-y-3 mt-1">
          <div className="flex gap-2">
            {allSizes.map(size => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium border transition-colors cursor-pointer ${
                  sizes.includes(size)
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : 'bg-[var(--bg)] text-[var(--text-secondary)] border-[var(--gray-200)] hover:border-[var(--primary)]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          {sizes.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {allSizes.filter(s => sizes.includes(s)).map(size => (
                <div key={size} className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[var(--text-secondary)] w-8">{size}</span>
                  <input
                    type="number"
                    min="0"
                    value={stockPerSize[size] ?? 0}
                    onChange={e => updateStockForSize(size, parseInt(e.target.value) || 0)}
                    className="w-20 px-3 py-2 bg-[var(--bg)] rounded-lg border border-[var(--gray-200)] text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] text-center"
                  />
                </div>
              ))}
              <div className="flex items-center gap-2 ml-2 pl-3 border-l border-[var(--gray-200)]">
                <span className="text-xs font-semibold text-[var(--text)]">Total: {totalStock}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Color Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Cor Principal</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {colorPresets.map(c => (
              <button
                key={c.name}
                type="button"
                title={c.name}
                onClick={() => setPrimaryColor(primaryColor === c.name ? '' : c.name)}
                className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                  primaryColor === c.name
                    ? 'border-[var(--primary)] scale-110 shadow-md'
                    : 'border-[var(--gray-200)] hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
          {primaryColor && (
            <p className="text-xs text-[var(--text-muted)] mt-1">{primaryColor}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Cor Secundária</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {colorPresets.map(c => (
              <button
                key={c.name}
                type="button"
                title={c.name}
                onClick={() => setSecondaryColor(secondaryColor === c.name ? '' : c.name)}
                className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                  secondaryColor === c.name
                    ? 'border-[var(--primary)] scale-110 shadow-md'
                    : 'border-[var(--gray-200)] hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
          {secondaryColor && (
            <p className="text-xs text-[var(--text-muted)] mt-1">{secondaryColor}</p>
          )}
        </div>
      </div>

      {/* Images Upload */}
      <div>
        <label className={labelClass}>Fotos do Produto</label>
        <div className="space-y-3">
          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative group w-24 h-24">
                  <img
                    src={url}
                    alt={`Imagem ${i + 1}`}
                    className="w-24 h-24 rounded-xl object-cover border border-[var(--gray-200)]"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--accent)] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                  >
                    <X size={12} />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-[10px] rounded-md">
                      Capa
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-[var(--gray-200)] rounded-xl text-sm text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Enviando fotos...
              </>
            ) : (
              <>
                <Upload size={18} />
                Clique para adicionar fotos (PNG, JPG, HEIC, WebP)
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.heic,.heif"
            onChange={handleUpload}
            className="hidden"
          />
          <p className="text-xs text-[var(--text-muted)]">
            {imageUrls.length} foto{imageUrls.length !== 1 ? 's' : ''}. A primeira será a capa.
          </p>
        </div>
      </div>

      {/* Video */}
      <div>
        <label className={labelClass}>Vídeo do Produto</label>
        <div className="space-y-3">
          {videoUrl && (
            <div className="relative group">
              <video
                src={videoUrl}
                controls
                className="w-full max-w-md rounded-xl border border-[var(--gray-200)]"
              />
              <button
                type="button"
                onClick={() => setVideoUrl('')}
                className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {!videoUrl && (
            <>
              <div
                onClick={() => !uploadingVideo && videoInputRef.current?.click()}
                className={`flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-[var(--gray-200)] rounded-xl text-sm text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors ${uploadingVideo ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
              >
                {uploadingVideo ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Enviando vídeo...
                  </>
                ) : (
                  <>
                    <Video size={18} />
                    Clique para adicionar vídeo (MP4, MOV, WebM)
                  </>
                )}
              </div>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
              <p className="text-xs text-[var(--text-muted)]">Ou cole a URL do vídeo:</p>
              <input
                type="url"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... ou URL direta do vídeo"
                className={inputClass}
              />
            </>
          )}
        </div>
      </div>

      {/* Rating + Review Count */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Rating</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={rating}
            onChange={e => setRating(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Nº de Reviews</label>
          <input
            type="number"
            min="0"
            value={reviewCount}
            onChange={e => setReviewCount(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Featured */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setFeatured(!featured)}
          className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${
            featured ? 'bg-[var(--primary)]' : 'bg-[var(--gray-300)]'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${
              featured ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <label className="text-sm font-medium text-[var(--text)]">Produto em destaque</label>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : product ? 'Atualizar Produto' : 'Criar Produto'}
        </Button>
        <a
          href="/admin/produtos"
          className="px-6 py-3 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}
