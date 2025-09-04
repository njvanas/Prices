import React from 'react'
import { ExternalLink, TrendingDown, TrendingUp, Package } from 'lucide-react'
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
      className="glass-card rounded-2xl hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 cursor-pointer group hover:scale-[1.02] active:scale-[0.98] animate-fade-in"
      onClick={() => onClick(product)}
    >
      <div className="p-6 h-full flex flex-col">
        {/* Product Image */}
        <div className="aspect-square w-full mb-4 bg-dark-700 rounded-xl overflow-hidden relative">
          <img
            src={product.image_url || 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Product Info */}
        <div className="space-y-4 flex-1 flex flex-col">
          <div>
            <h3 className="font-semibold text-gray-100 text-lg line-clamp-2 group-hover:text-primary-400 transition-colors leading-tight">
              {product.name}
            </h3>
            {product.brand && (
              <p className="text-sm text-gray-400 mt-1 font-medium">{product.brand}</p>
            )}
          </div>

          {/* Category */}
          {product.category && (
            <span className="inline-block px-3 py-1 bg-primary-500/20 text-primary-300 text-xs rounded-full font-medium w-fit">
              {product.category.name}
            </span>
          )}

          {/* Price Information */}
          <div className="space-y-3 mt-auto">
            {product.lowest_price ? (
              <div>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold text-success-400">
                    {formatPrice(product.lowest_price, product.currency_symbol)}
                  </span>
                  {priceRange && (
                    <span className="text-sm text-gray-400 line-through">
                      up to {formatPrice(product.highest_price!, product.currency_symbol)}
                    </span>
                  )}
                </div>
                
                {savings > 0 && (
                  <div className="flex items-center text-success-400 text-sm font-medium bg-success-500/10 px-3 py-1 rounded-lg">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    Save {formatPrice(savings, product.currency_symbol)}
                  </div>
                )}
                
                <p className="text-sm text-gray-400 flex items-center">
                  <Package className="w-4 h-4 mr-1" />
                  {product.prices.length} store{product.prices.length !== 1 ? 's' : ''} • Click to compare
                </p>
              </div>
            ) : (
              <div className="text-gray-400">
                <p className="text-lg font-medium">Price not available</p>
                <p className="text-sm">Check back later</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}