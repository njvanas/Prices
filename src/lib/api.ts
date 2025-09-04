import { supabase } from './supabase'
import type { Database } from './database.types'

type Product = Database['public']['Tables']['products']['Row']
type Price = Database['public']['Tables']['prices']['Row']
type Retailer = Database['public']['Tables']['retailers']['Row']
type Category = Database['public']['Tables']['categories']['Row']
type Country = Database['public']['Tables']['countries']['Row']
type PriceHistory = Database['public']['Tables']['price_history']['Row']
type FeaturedDeal = Database['public']['Tables']['featured_deals']['Row']

export interface ProductWithPrices extends Product {
  prices: (Price & { retailer: Retailer })[]
  category?: Category
  best_price?: number
  savings_amount?: number
  savings_percentage?: number
}

export interface PriceHistoryPoint {
  date: string
  min_price: number
  max_price: number
  avg_price: number
  retailer_count: number
}

export const PriceComparisonAPI = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  },

  // Get all countries
  async getCountries(): Promise<Country[]> {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data || []
  },

  // Get featured products with best deals
  async getFeaturedProducts(countryCode: string): Promise<ProductWithPrices[]> {
    // Get retailers for the selected country
    const { data: countryRetailers } = await supabase
      .from('retailer_countries')
      .select('retailer_id')
      .eq('country_code', countryCode)

    const retailerIds = countryRetailers?.map(rc => rc.retailer_id) || []

    if (retailerIds.length === 0) {
      return []
    }

    // Get featured deals with product and price information
    const { data: featuredDeals, error } = await supabase
      .from('featured_deals')
      .select(`
        *,
        product:products(
          *,
          category:categories(*),
          prices(
            *,
            retailer:retailers(*)
          )
        )
      `)
      .gt('expires_at', new Date().toISOString())
      .order('deal_rank')
      .limit(20)

    if (error) throw error

    return (featuredDeals || [])
      .map(deal => {
        const product = deal.product as any
        if (!product) return null

        // Filter prices to only include retailers available in the selected country
        const countryPrices = product.prices?.filter((price: any) => 
          retailerIds.includes(price.retailer.id)
        ) || []

        if (countryPrices.length === 0) return null

        const prices = countryPrices.map((price: any) => price.price)
        const bestPrice = Math.min(...prices)
        
        return {
          ...product,
          prices: countryPrices,
          best_price: bestPrice,
          savings_amount: deal.savings_amount,
          savings_percentage: deal.savings_percentage
        }
      })
      .filter(Boolean) as ProductWithPrices[]
  },

  // Search products with filters
  async searchProducts(
    query: string = '', 
    countryCode: string = 'US', 
    categoryId?: string
  ): Promise<ProductWithPrices[]> {
    // Get retailers for the selected country
    const { data: countryRetailers } = await supabase
      .from('retailer_countries')
      .select('retailer_id')
      .eq('country_code', countryCode)

    const retailerIds = countryRetailers?.map(rc => rc.retailer_id) || []

    if (retailerIds.length === 0) {
      return []
    }

    let productsQuery = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        prices(
          *,
          retailer:retailers(*)
        )
      `)

    // Apply search filter
    if (query.trim()) {
      productsQuery = productsQuery.or(`name.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%`)
    }

    // Apply category filter
    if (categoryId) {
      productsQuery = productsQuery.eq('category_id', categoryId)
    }

    const { data: products, error } = await productsQuery
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return (products || [])
      .map(product => {
        // Filter prices to only include retailers available in the selected country
        const countryPrices = product.prices?.filter(price => 
          retailerIds.includes(price.retailer.id)
        ) || []

        if (countryPrices.length === 0) return null

        const prices = countryPrices.map(price => price.price)
        const bestPrice = Math.min(...prices)
        const worstPrice = Math.max(...prices)
        const savingsAmount = worstPrice - bestPrice
        const savingsPercentage = worstPrice > 0 ? (savingsAmount / worstPrice) * 100 : 0

        return {
          ...product,
          prices: countryPrices,
          best_price: bestPrice,
          savings_amount: savingsAmount,
          savings_percentage: savingsPercentage
        }
      })
      .filter(Boolean) as ProductWithPrices[]
  },

  // Get price history for a product
  async getPriceHistory(productId: string, countryCode: string): Promise<PriceHistoryPoint[]> {
    // Get retailers for the selected country
    const { data: countryRetailers } = await supabase
      .from('retailer_countries')
      .select('retailer_id')
      .eq('country_code', countryCode)

    const retailerIds = countryRetailers?.map(rc => rc.retailer_id) || []

    if (retailerIds.length === 0) {
      return []
    }

    const { data: priceHistory, error } = await supabase
      .from('price_history')
      .select('*')
      .eq('product_id', productId)
      .in('retailer_id', retailerIds)
      .gte('recorded_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('recorded_at')

    if (error) throw error

    // Group by date and calculate daily aggregates
    const dailyData = new Map<string, { prices: number[], retailer_count: number }>()

    priceHistory?.forEach(record => {
      const date = new Date(record.recorded_at!).toISOString().split('T')[0]
      if (!dailyData.has(date)) {
        dailyData.set(date, { prices: [], retailer_count: 0 })
      }
      const dayData = dailyData.get(date)!
      dayData.prices.push(Number(record.price))
      dayData.retailer_count = Math.max(dayData.retailer_count, dayData.prices.length)
    })

    return Array.from(dailyData.entries()).map(([date, data]) => ({
      date,
      min_price: Math.min(...data.prices),
      max_price: Math.max(...data.prices),
      avg_price: data.prices.reduce((sum, price) => sum + price, 0) / data.prices.length,
      retailer_count: data.retailer_count
    }))
  },

  // Trigger manual data update
  async triggerDataUpdate() {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/master-daily-scheduler`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return { success: true, data: result }
    } catch (error) {
      console.error('Failed to trigger data update:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  // Get scheduler status
  async getSchedulerStatus() {
    const { data, error } = await supabase
      .from('scheduler_runs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(10)

    if (error) throw error
    return data || []
  }
}