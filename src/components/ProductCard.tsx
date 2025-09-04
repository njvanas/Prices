import { ExternalLink, TrendingDown, Star, Zap, Trophy } from 'lucide-react'
import type { ProductWithPrices } from '../lib/api'

interface ProductCardProps {
  product: ProductWithPrices
  onClick: (product: ProductWithPrices) => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const hasSignificantSavings = (product.savings_percentage || 0) >= 30
  const isTopDeal = product.deal_rank && product.deal_rank <= 3
  const isBestDeal = product.deal_rank === 1

  return (
    <div 
      className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6 hover:bg-slate-800/60 hover:border-slate-600/40 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20"
      onClick={() => onClick(product)}
    >
      {/* Deal Badges */}
      <div className="flex items-center justify-between mb-4 min-h-[32px]">
        {isBestDeal && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 animate-pulse">
            <Trophy className="w-4 h-4" />
            #1 BEST DEAL
          </div>
        )}
        {isTopDeal && !isBestDeal && (
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
            <Zap className="w-4 h-4" />
            #{product.deal_rank} HOT DEAL
          </div>
        )}
        {hasSignificantSavings && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold ml-auto flex items-center gap-1">
            <TrendingDown className="w-4 h-4" />
            Save {product.savings_percentage?.toFixed(0)}%
          </div>
        )}
      </div>

      {/* Product Image */}
      <div className="aspect-square bg-slate-700/20 rounded-xl mb-6 overflow-hidden border border-slate-600/20">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500">
            <Star className="w-16 h-16" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-white text-xl leading-tight group-hover:text-blue-300 transition-colors mb-2">
            {product.name}
          </h3>
          {product.brand && (
            <p className="text-slate-400 text-base font-medium">{product.brand}</p>
          )}
        </div>

        {/* Price Info */}
        <div className="space-y-3">
          {product.lowest_price && product.highest_price && (
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold text-green-400">
                  ${product.lowest_price.toFixed(2)}
                </div>
                {product.savings_amount && product.savings_amount > 0 && (
                  <div className="text-right">
                    <div className="text-green-400 font-bold text-lg">
                      Save ${product.savings_amount.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
              {product.savings_amount && product.savings_amount > 0 && (
                <div className="flex items-center text-base text-slate-400">
                  <span className="line-through mr-3">${product.highest_price.toFixed(2)}</span>
                  <div className="flex items-center text-green-400">
                    <TrendingDown className="w-5 h-5 mr-1" />
                    <span className="font-semibold">{product.savings_percentage?.toFixed(0)}% off</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Retailers Count */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
          <span className="text-slate-400 text-base">
            📊 {product.prices?.length || 0} stores compared
          </span>
          <div className="flex items-center text-blue-400 text-base font-semibold group-hover:text-blue-300 transition-colors">
            Compare Prices
            <ExternalLink className="w-5 h-5 ml-2" />
          </div>
        </div>
      </div>
    </div>
  )
}