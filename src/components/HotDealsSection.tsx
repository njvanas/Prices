import React from 'react'
import { Flame, TrendingDown, Clock } from 'lucide-react'
import { ProductCard } from './ProductCard'
import type { ProductWithPrices } from '../lib/api'

interface HotDealsSectionProps {
  deals: ProductWithPrices[]
  loading: boolean
  onProductClick: (product: ProductWithPrices) => void
}

export function HotDealsSection({ deals, loading, onProductClick }: HotDealsSectionProps) {
  if (loading) {
    return (
      <div className="mb-16">
        <div className="flex items-center justify-center mb-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-600 border-t-orange-400"></div>
          <span className="ml-3 text-gray-300 text-lg">Finding today's hottest deals...</span>
        </div>
      </div>
    )
  }

  if (deals.length === 0) {
    return (
      <div className="mb-16 text-center py-12">
        <Flame className="w-16 h-16 mx-auto text-gray-500 mb-4" />
        <h3 className="text-xl font-medium text-gray-300 mb-2">No hot deals found</h3>
        <p className="text-gray-400">Check back later for amazing savings!</p>
      </div>
    )
  }

  return (
    <div className="mb-16">
      {/* Hot Deals Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl shadow-lg">
            <Flame className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-4">
          🔥 Today's Hottest Deals
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Massive savings up to {Math.max(...deals.map(d => d.savings_percentage || 0)).toFixed(0)}% off! 
          Updated every 24 hours automatically.
        </p>
        <div className="flex items-center justify-center mt-4 text-sm text-gray-400">
          <Clock className="w-4 h-4 mr-2" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Top 3 Mega Deals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {deals.slice(0, 3).map((deal, index) => (
          <div
            key={deal.id}
            className="relative bg-gradient-to-br from-orange-500/10 to-red-500/10 border-2 border-orange-500/30 rounded-2xl p-6 hover:border-orange-400/50 transition-all duration-300 cursor-pointer group"
            onClick={() => onProductClick(deal)}
          >
            {/* Rank Badge */}
            <div className="absolute -top-3 -left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
              #{index + 1}
            </div>
            
            {/* Savings Badge */}
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              {deal.savings_percentage?.toFixed(0)}% OFF
            </div>

            <div className="pt-4">
              <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-orange-300 transition-colors">
                {deal.name}
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    ${deal.lowest_price?.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400 line-through">
                    ${deal.highest_price?.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">
                    Save ${deal.savings_amount?.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {deal.prices?.length} stores
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Remaining Deals Grid */}
      {deals.length > 3 && (
        <div>
          <h3 className="text-2xl font-semibold text-gray-200 mb-6 flex items-center">
            <TrendingDown className="w-6 h-6 mr-3 text-green-400" />
            More Great Deals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {deals.slice(3).map((deal) => (
              <ProductCard
                key={deal.id}
                product={deal}
                onClick={onProductClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}