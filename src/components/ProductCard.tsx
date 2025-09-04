import { ExternalLink, TrendingDown, Star } from 'lucide-react'
import type { ProductWithPrices } from '../lib/api'

interface ProductCardProps {
  product: ProductWithPrices
  onClick: (product: ProductWithPrices) => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const hasSignificantSavings = (product.savings_percentage || 0) >= 30
  const isTopDeal = product.deal_rank && product.deal_rank <= 3

  return (
    <div 
      className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
      onClick={() => onClick(product)}
    >
      {/* Deal Badge */}
      {hasSignificantSavings && (
        <div className="flex items-center justify-between mb-4">
          {isTopDeal && (
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              #{product.deal_rank} HOT DEAL 🔥
            </div>
          )}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold ml-auto">
            Save {product.savings_percentage?.toFixed(0)}%
          </div>
        </div>
      )}

      {/* Product Image */}
      <div className="aspect-square bg-slate-700/30 rounded-xl mb-4 overflow-hidden">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500">
            <Star className="w-12 h-12" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-white text-lg leading-tight group-hover:text-blue-300 transition-colors">
            {product.name}
          </h3>
          {product.brand && (
            <p className="text-slate-400 text-sm mt-1">{product.brand}</p>
          )}
        </div>

        {/* Price Info */}
        <div className="space-y-2">
          {product.lowest_price && product.highest_price && (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  ${product.lowest_price.toFixed(2)}
                </div>
                {product.savings_amount && product.savings_amount > 0 && (
                  <div className="flex items-center text-sm text-slate-400">
                    <span className="line-through mr-2">${product.highest_price.toFixed(2)}</span>
                    <TrendingDown className="w-4 h-4 text-green-400" />
                  </div>
                )}
              </div>
              {product.savings_amount && product.savings_amount > 0 && (
                <div className="text-right">
                  <div className="text-green-400 font-semibold">
                    Save ${product.savings_amount.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Retailers Count */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
          <span className="text-slate-400 text-sm">
            {product.prices?.length || 0} retailers
          </span>
          <div className="flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300">
            Tap for details
            <ExternalLink className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </div>
  )
}