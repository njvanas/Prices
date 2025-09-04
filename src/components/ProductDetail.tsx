import React, { useState, useEffect } from 'react'
import { X, ExternalLink, Bell, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { PriceComparisonAPI } from '../lib/api'
import { PriceHistoryGraph } from './PriceHistoryGraph'
import { PriceAlert } from './PriceAlert'
import type { Database } from '../lib/database.types'

type ProductWithPrices = Database['public']['Tables']['products']['Row'] & {
  prices: (Database['public']['Tables']['prices']['Row'] & {
    retailer: Database['public']['Tables']['retailers']['Row']
  })[]
  category?: Database['public']['Tables']['categories']['Row']
}

type PriceHistoryEntry = {
  date: string
  min_price: number
  max_price: number
  avg_price: number
  retailer_count: number
}

interface ProductDetailProps {
  product: ProductWithPrices
  onClose: () => void
  selectedCountry?: string
}

export function ProductDetail({ product, onClose, selectedCountry = 'US' }: ProductDetailProps) {
  const [priceHistory, setPriceHistory] = useState<PriceHistoryEntry[]>([])
  const [showPriceAlert, setShowPriceAlert] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPriceHistory = async () => {
      try {
        setLoading(true)
        const history = await PriceComparisonAPI.getPriceHistory(product.id, selectedCountry)
        setPriceHistory(history)
      } catch (error) {
        console.error('Failed to load price history:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPriceHistory()
  }, [product.id, selectedCountry])

  // Calculate price statistics
  const prices = product.prices.map(p => p.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length

  // Calculate savings
  const maxSavings = maxPrice - minPrice
  const savingsPercentage = ((maxSavings / maxPrice) * 100)

  // Get price trend from history
  const getPriceTrend = () => {
    if (priceHistory.length < 2) return { trend: 'stable', change: 0 }
    
    const recent = priceHistory[priceHistory.length - 1]
    const previous = priceHistory[priceHistory.length - 2]
    const change = ((recent.avg_price - previous.avg_price) / previous.avg_price) * 100
    
    if (change > 2) return { trend: 'up', change }
    if (change < -2) return { trend: 'down', change }
    return { trend: 'stable', change }
  }

  const { trend, change } = getPriceTrend()

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-5 h-5 text-error-400" />
      case 'down': return <TrendingDown className="w-5 h-5 text-success-400" />
      default: return <Minus className="w-5 h-5 text-gray-400" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-error-400'
      case 'down': return 'text-success-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-dark-600 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-dark-800/95 backdrop-blur-sm border-b border-dark-600 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={product.image_url || 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400'} 
              alt={product.name}
              className="w-16 h-16 object-cover rounded-xl border border-dark-600"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-100">{product.name}</h2>
              <p className="text-gray-400">{product.brand} {product.model}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-700 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Price Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-success-500/10 border border-success-500/30 rounded-xl p-6">
              <h3 className="text-success-400 font-semibold mb-2">Best Price</h3>
              <p className="text-3xl font-bold text-success-300">${minPrice.toFixed(2)}</p>
              <p className="text-sm text-gray-400 mt-1">
                Save ${maxSavings.toFixed(2)} ({savingsPercentage.toFixed(0)}%)
              </p>
            </div>
            
            <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-6">
              <h3 className="text-primary-400 font-semibold mb-2">Average Price</h3>
              <p className="text-3xl font-bold text-primary-300">${avgPrice.toFixed(2)}</p>
              <div className={`flex items-center space-x-2 mt-1 ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="text-sm">
                  {Math.abs(change).toFixed(1)}% {trend === 'stable' ? 'stable' : `${trend} this week`}
                </span>
              </div>
            </div>
            
            <div className="bg-dark-700/50 border border-dark-600 rounded-xl p-6">
              <h3 className="text-gray-400 font-semibold mb-2">Highest Price</h3>
              <p className="text-3xl font-bold text-gray-300">${maxPrice.toFixed(2)}</p>
              <p className="text-sm text-gray-400 mt-1">
                {product.prices.length} retailer{product.prices.length !== 1 ? 's' : ''} tracked
              </p>
            </div>
          </div>

          {/* Price History Graph */}
          <div className="bg-dark-700/30 border border-dark-600 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-100">Price History (30 Days)</h3>
              <button
                onClick={() => setShowPriceAlert(true)}
                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span>Set Price Alert</span>
              </button>
            </div>
            
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <PriceHistoryGraph data={priceHistory} />
            )}
          </div>

          {/* Product Description */}
          {product.description && (
            <div className="bg-dark-700/30 border border-dark-600 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-100 mb-4">Product Description</h3>
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications as object).length > 0 && (
            <div className="bg-dark-700/30 border border-dark-600 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-100 mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications as Record<string, any>).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-dark-600/50">
                    <span className="text-gray-400 capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="text-gray-200 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Retailer Prices */}
          <div className="bg-dark-700/30 border border-dark-600 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-100 mb-6">Compare Prices</h3>
            <div className="space-y-4">
              {product.prices
                .sort((a, b) => a.price - b.price)
                .map((price, index) => (
                <div 
                  key={price.id} 
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all hover:scale-[1.02] ${
                    index === 0 
                      ? 'bg-success-500/10 border-success-500/30' 
                      : 'bg-dark-700/50 border-dark-600 hover:border-dark-500'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {index === 0 && (
                      <div className="bg-success-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        BEST
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      {price.retailer.logo_url && (
                        <img 
                          src={price.retailer.logo_url} 
                          alt={price.retailer.name}
                          className="w-8 h-8 object-contain rounded"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-100">{price.retailer.name}</p>
                        <p className="text-sm text-gray-400 capitalize">{price.availability}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-100">${price.price.toFixed(2)}</p>
                      {index > 0 && (
                        <p className="text-sm text-error-400">
                          +${(price.price - minPrice).toFixed(2)} more
                        </p>
                      )}
                    </div>
                    <a
                      href={price.product_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <span>View Deal</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Price Alert Modal */}
      {showPriceAlert && (
        <PriceAlert
          product={product}
          currentPrice={minPrice}
          onClose={() => setShowPriceAlert(false)}
        />
      )}
    </div>
  )
}