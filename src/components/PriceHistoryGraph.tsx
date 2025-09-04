import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingDown, TrendingUp, Minus, Calendar } from 'lucide-react'
import type { Database } from '../lib/database.types'

type PriceHistory = Database['public']['Tables']['price_history']['Row'] & {
  retailer: Database['public']['Tables']['retailers']['Row']
}

interface PriceHistoryGraphProps {
  priceHistory: PriceHistory[]
  productName: string
  currencySymbol: string
}

export function PriceHistoryGraph({ priceHistory, productName, currencySymbol }: PriceHistoryGraphProps) {
  if (!priceHistory || priceHistory.length === 0) {
    return (
      <div className="bg-dark-700/30 border border-dark-600 rounded-xl p-8 text-center">
        <Calendar className="w-12 h-12 mx-auto text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-300 mb-2">No Price History Available</h3>
        <p className="text-gray-400 text-sm">Price tracking data will appear here as we collect more information over time.</p>
      </div>
    )
  }

  // Group price history by date and calculate daily averages
  const groupedData = priceHistory.reduce((acc, entry) => {
    const date = new Date(entry.recorded_at!).toLocaleDateString()
    if (!acc[date]) {
      acc[date] = {
        date,
        prices: [],
        retailers: new Set()
      }
    }
    acc[date].prices.push(entry.price)
    acc[date].retailers.add(entry.retailer.name)
    return acc
  }, {} as Record<string, { date: string; prices: number[]; retailers: Set<string> }>)

  // Convert to chart data with min, max, and average prices per day
  const chartData = Object.values(groupedData)
    .map(day => {
      const prices = day.prices.map(p => Number(p))
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length
      
      return {
        date: day.date,
        minPrice: Number(minPrice.toFixed(2)),
        maxPrice: Number(maxPrice.toFixed(2)),
        avgPrice: Number(avgPrice.toFixed(2)),
        retailers: day.retailers.size,
        fullDate: new Date(day.date)
      }
    })
    .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime())

  // Calculate price trend
  const firstPrice = chartData[0]?.avgPrice || 0
  const lastPrice = chartData[chartData.length - 1]?.avgPrice || 0
  const priceChange = lastPrice - firstPrice
  const priceChangePercent = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0

  const getTrendIcon = () => {
    if (priceChangePercent > 2) return <TrendingUp className="w-5 h-5 text-error-400" />
    if (priceChangePercent < -2) return <TrendingDown className="w-5 h-5 text-success-400" />
    return <Minus className="w-5 h-5 text-gray-400" />
  }

  const getTrendColor = () => {
    if (priceChangePercent > 2) return 'text-error-400'
    if (priceChangePercent < -2) return 'text-success-400'
    return 'text-gray-400'
  }

  const formatPrice = (value: number) => `${currencySymbol}${value.toFixed(2)}`

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-4 shadow-xl">
          <p className="text-gray-200 font-medium mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-success-400">
              Lowest: <span className="font-semibold">{formatPrice(data.minPrice)}</span>
            </p>
            <p className="text-primary-400">
              Average: <span className="font-semibold">{formatPrice(data.avgPrice)}</span>
            </p>
            <p className="text-error-400">
              Highest: <span className="font-semibold">{formatPrice(data.maxPrice)}</span>
            </p>
            <p className="text-gray-400">
              {data.retailers} retailer{data.retailers !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-dark-700/30 border border-dark-600 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-100 mb-2">📈 Price History</h3>
          <p className="text-gray-400 text-sm">Track how prices have changed over time</p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-1">
            {getTrendIcon()}
            <span className={`font-semibold ${getTrendColor()}`}>
              {priceChangePercent > 0 ? '+' : ''}{priceChangePercent.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-gray-400">
            {chartData.length} day{chartData.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
      </div>

      {/* Price Trend Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-dark-800/50 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">First Recorded</p>
          <p className="text-lg font-bold text-gray-200">{formatPrice(firstPrice)}</p>
        </div>
        <div className="bg-dark-800/50 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Current Average</p>
          <p className="text-lg font-bold text-gray-200">{formatPrice(lastPrice)}</p>
        </div>
        <div className="bg-dark-800/50 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Total Change</p>
          <p className={`text-lg font-bold ${getTrendColor()}`}>
            {priceChange > 0 ? '+' : ''}{formatPrice(Math.abs(priceChange))}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${currencySymbol}${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#9CA3AF', fontSize: '12px' }}
            />
            
            {/* Price range area */}
            <Line
              type="monotone"
              dataKey="maxPrice"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              name="Highest Price"
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="avgPrice"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
              name="Average Price"
            />
            <Line
              type="monotone"
              dataKey="minPrice"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              name="Lowest Price"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="mt-4 text-xs text-gray-400 text-center">
        <p>💡 Tip: Hover over data points to see detailed price information for each day</p>
      </div>
    </div>
  )
}