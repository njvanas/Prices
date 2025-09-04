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
      case 'in_stock': return 'text-success-600 bg-success-50'
      case 'limited_stock': return 'text-warning-600 bg-warning-50'
      case 'out_of_stock': return 'text-error-600 bg-error-50'
      default: return 'text-gray-600 bg-gray-50'
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <div className="flex items-center space-x-2">
            {product.lowest_price && (
              <button
                onClick={() => setShowPriceAlert(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                <Bell className="w-4 h-4" />
                <span>Price Alert</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image and Info */}
            <div>
              <div className="aspect-square w-full bg-gray-50 rounded-lg overflow-hidden mb-6">
                <img
                  src={product.image_url || 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=600'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
                  <div className="space-y-2 text-sm">
                    {product.brand && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Brand:</span>
                        <span className="text-gray-900">{product.brand}</span>
                      </div>
                    )}
                    {product.model && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Model:</span>
                        <span className="text-gray-900">{product.model}</span>
                      </div>
                    )}
                    {product.category && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Category:</span>
                        <span className="text-gray-900">{product.category.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {product.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                  </div>
                )}

                {Object.keys(product.specifications).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Specifications</h3>
                    <div className="space-y-1 text-sm">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-500 capitalize">{key.replace('_', ' ')}:</span>
                          <span className="text-gray-900">{String(value)}</span>
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Price Comparison</h3>
                {product.lowest_price && product.highest_price && (
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Lowest: <span className="font-semibold text-success-600">{formatPrice(product.lowest_price, sortedPrices[0]?.currency)}</span></span>
                    <span>Highest: <span className="font-semibold text-error-600">{formatPrice(product.highest_price, sortedPrices[sortedPrices.length - 1]?.currency)}</span></span>
                    {product.lowest_price !== product.highest_price && (
                      <span>Save: <span className="font-semibold text-primary-600">{formatPrice(product.highest_price - product.lowest_price, sortedPrices[0]?.currency)}</span></span>
                    )}
                  </div>
                )}
              </div>

              {/* Price List */}
              <div className="space-y-3">
                {sortedPrices.length > 0 ? (
                  sortedPrices.map((price, index) => (
                    <div
                      key={price.id}
                      className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                        index === 0 ? 'border-success-200 bg-success-50' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={price.retailer.logo_url || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=50'}
                            alt={price.retailer.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{price.retailer.name}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>Updated {formatDate(price.last_checked)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="text-xl font-bold text-gray-900">
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
                              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                      {index === 0 && sortedPrices.length > 1 && (
                        <div className="mt-2 text-xs text-success-600 font-medium">
                          ✓ Best Price
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
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