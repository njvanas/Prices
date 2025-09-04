import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface PriceHistoryEntry {
  date: string
  min_price: number
  max_price: number
  avg_price: number
  retailer_count: number
}

interface PriceHistoryGraphProps {
  data: PriceHistoryEntry[]
}

export function PriceHistoryGraph({ data }: PriceHistoryGraphProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        <p>No price history data available</p>
      </div>
    )
  }

  // Format data for the chart
  const chartData = data.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    minPrice: entry.min_price,
    maxPrice: entry.max_price,
    avgPrice: entry.avg_price,
    retailers: entry.retailer_count
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-3 shadow-lg">
          <p className="text-gray-200 font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            <p className="text-success-400">
              Min: ${payload[0]?.value?.toFixed(2)}
            </p>
            <p className="text-primary-400">
              Avg: ${payload[1]?.value?.toFixed(2)}
            </p>
            <p className="text-error-400">
              Max: ${payload[2]?.value?.toFixed(2)}
            </p>
            <p className="text-gray-400 text-sm">
              {payload[0]?.payload?.retailers} retailers
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af"
            fontSize={12}
          />
          <YAxis 
            stroke="#9ca3af"
            fontSize={12}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Price range area */}
          <Area
            type="monotone"
            dataKey="maxPrice"
            stroke="#ef4444"
            fill="url(#priceGradient)"
            fillOpacity={0.1}
          />
          <Area
            type="monotone"
            dataKey="minPrice"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.1}
          />
          
          {/* Price lines */}
          <Line
            type="monotone"
            dataKey="minPrice"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="avgPrice"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="maxPrice"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: '#ef4444', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}