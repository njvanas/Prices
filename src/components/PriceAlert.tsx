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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-dark-800 rounded-2xl max-w-md w-full p-8 border border-dark-700 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-500/20 rounded-xl">
              <Bell className="w-6 h-6 text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-100">Price Alert</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-200 hover:bg-dark-700 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-8 p-4 bg-dark-700/50 rounded-xl border border-dark-600">
          <h4 className="font-medium text-gray-200 mb-2 line-clamp-2">{product.name}</h4>
          <p className="text-sm text-gray-400">
            Current best price: <span className="font-semibold text-success-400">{formatPrice(product.lowest_price || 0)}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-3">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 input-dark rounded-xl focus:ring-2 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label htmlFor="targetPrice" className="block text-sm font-medium text-gray-300 mb-3">
              Alert me when price drops to:
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                {product.currency_symbol || '$'}
              </span>
              <input
                type="number"
                id="targetPrice"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                min="0"
                step="0.01"
                className="w-full pl-10 pr-4 py-3 input-dark rounded-xl focus:ring-2 transition-all duration-200 text-lg font-medium"
                required
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 btn-secondary rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary rounded-xl"
            >
              🔔 Set Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}