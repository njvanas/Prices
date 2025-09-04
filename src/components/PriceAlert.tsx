import React, { useState } from 'react'
import { Bell, X } from 'lucide-react'
import type { ProductWithPrices } from '../lib/api'

interface PriceAlertProps {
  product: ProductWithPrices
  onClose: () => void
  onSetAlert: (targetPrice: number, email: string) => void
}

export function PriceAlert({ product, onClose, onSetAlert }: PriceAlertProps) {
  const [email, setEmail] = useState('')
  const [targetPrice, setTargetPrice] = useState(product.lowest_price || 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && targetPrice > 0) {
      onSetAlert(targetPrice, email)
      onClose()
    }
  }

  const formatPrice = (price: number) => {
    return `${product.currency_symbol || '$'}${price.toLocaleString()}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Set Price Alert</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-2">{product.name}</h4>
          <p className="text-sm text-gray-600">
            Current lowest price: <span className="font-semibold">{formatPrice(product.lowest_price || 0)}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="targetPrice" className="block text-sm font-medium text-gray-700 mb-2">
              Alert me when price drops to
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {product.currency_symbol || '$'}
              </span>
              <input
                type="number"
                id="targetPrice"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                min="0"
                step="0.01"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Set Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}