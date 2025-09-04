import React from 'react'
import { ExternalLink, TrendingDown, TrendingUp } from 'lucide-react'
import type { ProductWithPrices } from '../lib/api'

interface ProductCardProps {
  product: ProductWithPrices
  onClick: (product: ProductWithPrices) => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const formatPrice = (price: number, currencySymbol: string = '$') => {
    return `${currencySymbol}${price.toLocaleString()}`
  }

  const priceRange = product.lowest_price && product.highest_price && product.lowest_price !== product.highest_price
  const savings = product.highest_price && product.lowest_price 
    ? product.highest_price - product.lowest_price 
    : 0

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(product)}
    >
      <div className="p-6">
        {/* Product Image */}
        <div className="aspect-square w-full mb-4 bg-gray-50 rounded-lg overflow-hidden">
          <img
            src={product.image_url || 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
            {product.brand && (
              <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
            )}
          </div>

          {/* Category */}
          {product.category && (
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {product.category.name}
            </span>
          )}

          {/* Price Information */}
          <div className="space-y-2">
            {product.lowest_price ? (
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(product.lowest_price, product.currency_symbol)}
                  </span>
                  {priceRange && (
                    <span className="text-sm text-gray-500">
                      up to {formatPrice(product.highest_price!, product.currency_symbol)}
                    </span>
                  )}
                </div>
                
                {savings > 0 && (
                  <div className="flex items-center text-success-600 text-sm">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    Save up to {formatPrice(savings, product.currency_symbol)}
                  </div>
                )}
                
                <p className="text-sm text-gray-500">
                  {product.prices.length} store{product.prices.length !== 1 ? 's' : ''}
                </p>
              </div>
            ) : (
              <div className="text-gray-500">
                <p className="text-lg">Price not available</p>
                <p className="text-sm">Check back later</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}