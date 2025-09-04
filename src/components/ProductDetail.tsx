import React from 'react'
import { X, ExternalLink, Clock, Package, Bell } from 'lucide-react'
import { PriceAlert } from './PriceAlert'
import type { ProductWithPrices } from '../lib/api'

interface ProductDetailProps {
  product: ProductWithPrices
  onClose: () => void
}

export function ProductDetail({ product, onClose }: ProductDetailProps) {
  const [showPriceAlert, setShowPriceAlert] = React.useState(false)

  const formatPrice = (price: number, currency: string = 'USD') => {
    // For major currencies, use proper formatting
    if (['USD', 'EUR', 'GBP', 'CAD', 'AUD'].includes(currency)) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(price)
    }
    // For other currencies, use symbol + formatted number
    return `${product.currency_symbol || '$'}${price.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in_stock': return 'text-success-300 bg-success-500/20 border-success-500/30'
      case 'limited_stock': return 'text-warning-300 bg-warning-500/20 border-warning-500/30'
      case 'out_of_stock': return 'text-error-300 bg-error-500/20 border-error-500/30'
      default: return 'text-gray-300 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'in_stock': return 'In Stock'
      case 'limited_stock': return 'Limited Stock'
      case 'out_of_stock': return 'Out of Stock'
      default: return 'Unknown'
    }
  }

  // Sort prices by lowest first
  const sortedPrices = [...product.prices].sort((a, b) => a.price - b.price)

  const handleSetPriceAlert = (targetPrice: number, email: string) => {
    // TODO: Implement price alert functionality
    console.log('Setting price alert:', { targetPrice, email, productId: product.id })
    // This would typically save to a price_alerts table and set up monitoring
  }
  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-dark-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-dark-700 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-dark-700">
          <h2 className="text-3xl font-bold text-gray-100 line-clamp-2 flex-1 mr-4">{product.name}</h2>
          <div className="flex items-center space-x-2">
            {product.lowest_price && (
              <button
                onClick={() => setShowPriceAlert(true)}
                className="flex items-center space-x-2 btn-primary text-sm"
              >
                <Bell className="w-4 h-4" />
                <span>Set Alert</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-3 text-gray-400 hover:text-gray-200 hover:bg-dark-700 rounded-xl transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image and Info */}
            <div>
              <div className="aspect-square w-full bg-dark-700 rounded-2xl overflow-hidden mb-8 shadow-lg">
                <img
                  src={product.image_url || 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=600'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-100 mb-4 text-lg">Product Details</h3>
                  <div className="space-y-3 text-sm">
                    {product.brand && (
                      <div className="flex justify-between py-2 border-b border-dark-700/50">
                        <span className="text-gray-400">Brand:</span>
                        <span className="text-gray-200 font-medium">{product.brand}</span>
                      </div>
                    )}
                    {product.model && (
                      <div className="flex justify-between py-2 border-b border-dark-700/50">
                        <span className="text-gray-400">Model:</span>
                        <span className="text-gray-200 font-medium">{product.model}</span>
                      </div>
                    )}
                    {product.category && (
                      <div className="flex justify-between py-2 border-b border-dark-700/50">
                        <span className="text-gray-400">Category:</span>
                        <span className="text-gray-200 font-medium">{product.category.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {product.description && (
                  <div>
                    <h3 className="font-semibold text-gray-100 mb-3 text-lg">Description</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{product.description}</p>
                  </div>
                )}

                {Object.keys(product.specifications).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-100 mb-3 text-lg">Specifications</h3>
                    <div className="space-y-2 text-sm">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-dark-700/30">
                          <span className="text-gray-400 capitalize">{key.replace('_', ' ')}:</span>
                          <span className="text-gray-200 font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price Comparison */}
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-gray-100 mb-4">💸 Best Deals</h3>
                {product.lowest_price && product.highest_price && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="bg-success-500/10 border border-success-500/20 rounded-xl p-3 text-center">
                      <p className="text-gray-400 text-xs">Best Price</p>
                      <p className="font-bold text-success-400 text-lg">{formatPrice(product.lowest_price, sortedPrices[0]?.currency)}</p>
                    </div>
                    <div className="bg-error-500/10 border border-error-500/20 rounded-xl p-3 text-center">
                      <p className="text-gray-400 text-xs">Highest Price</p>
                      <p className="font-bold text-error-400 text-lg">{formatPrice(product.highest_price, sortedPrices[sortedPrices.length - 1]?.currency)}</p>
                    </div>
                    {product.lowest_price !== product.highest_price && (
                      <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-3 text-center">
                        <p className="text-gray-400 text-xs">You Save</p>
                        <p className="font-bold text-primary-400 text-lg">{formatPrice(product.highest_price - product.lowest_price, sortedPrices[0]?.currency)}</p>
              </div>

              {/* Price List */}
              <div className="space-y-4">
                {sortedPrices.length > 0 ? (
                  sortedPrices.map((price, index) => (
                    <div
                      key={price.id}
                      className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                        index === 0 ? 'border-success-500/30 bg-success-500/5 ring-1 ring-success-500/20' : 'border-dark-600 bg-dark-700/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={price.retailer.logo_url || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=50'}
                            alt={price.retailer.name}
                            className="w-10 h-10 rounded-lg object-cover border border-dark-600"
                          />
                          <div>
                            <p className="font-medium text-gray-200">{price.retailer.name}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>Updated {formatDate(price.last_checked)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="text-2xl font-bold text-gray-100">
                                {formatPrice(price.price, price.currency)}
                              </p>
                              <div className="flex items-center space-x-1">
                                <Package className="w-3 h-3" />
                                <span className={`text-xs px-2 py-1 rounded-full ${getAvailabilityColor(price.availability)}`}>
                                  {getAvailabilityText(price.availability)}
                                </span>
                              </div>
                            </div>
                            <a
                              href={price.product_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          </div>
                        </div>
                      </div>
                      {index === 0 && sortedPrices.length > 1 && (
                        <div className="mt-3 text-sm text-success-400 font-medium flex items-center">
                          <span className="bg-success-500 text-white px-2 py-1 rounded-full text-xs mr-2">🏆</span>
                          Best Deal - Save {formatPrice((product.highest_price || 0) - price.price, price.currency)}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                    <p>No pricing information available</p>
                    <p className="text-sm">Check back later for updates</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Price Alert Modal */}
      {showPriceAlert && (
        <PriceAlert
          product={product}
          onClose={() => setShowPriceAlert(false)}
          onSetAlert={handleSetPriceAlert}
        />
      )}
    </>
  )
}