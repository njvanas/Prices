import { supabase } from './supabase'
import type { Database } from './database.types'

export type ProductWithPrices = Database['public']['Tables']['products']['Row'] & {
  prices: (Database['public']['Tables']['prices']['Row'] & {
    retailer: Database['public']['Tables']['retailers']['Row']
  })[]
  category?: Database['public']['Tables']['categories']['Row']
}

export type PriceHistoryEntry = {
  date: string
  min_price: number
  max_price: number
  avg_price: number
  retailer_count: number
}

export type SchedulerRun = Database['public']['Tables']['scheduler_runs']['Row']

export const PriceComparisonAPI = {
  // Get all categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  },

  // Get all countries
  async getCountries() {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data || []
  },

  // Get featured products (top deals)
  async getFeaturedProducts(countryCode: string = 'US'): Promise<ProductWithPrices[]> {
    // Get retailer IDs for the country
    const { data: countryRetailers } = await supabase
      .from('retailer_countries')
      .select('retailer_id')
      .eq('country_code', countryCode)

    const retailerIds = countryRetailers?.map(rc => rc.retailer_id) || []

    if (retailerIds.length === 0) {
      return []
    }

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        prices(
          *,
          retailer:retailers(*)
        )
      `)
      .not('prices', 'is', null)
      .limit(20)

    if (error) throw error

    // Filter products that have prices from retailers in the selected country
    const filteredProducts = (data || []).filter(product => 
      product.prices?.some(price => retailerIds.includes(price.retailer_id))
    ).map(product => ({
      ...product,
      prices: product.prices?.filter(price => retailerIds.includes(price.retailer_id)) || []
    }))

    return filteredProducts as ProductWithPrices[]
  },

  // Search products
  async searchProducts(query: string = '', countryCode: string = 'US', categoryId?: string): Promise<ProductWithPrices[]> {
    // Get retailer IDs for the country
    const { data: countryRetailers } = await supabase
      .from('retailer_countries')
      .select('retailer_id')
      .eq('country_code', countryCode)

    const retailerIds = countryRetailers?.map(rc => rc.retailer_id) || []

    if (retailerIds.length === 0) {
      return []
    }

    let queryBuilder = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        prices(
          *,
          retailer:retailers(*)
        )
      `)

    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%`)
    }

    if (categoryId) {
      queryBuilder = queryBuilder.eq('category_id', categoryId)
    }

    const { data, error } = await queryBuilder
      .not('prices', 'is', null)
      .limit(50)

    if (error) throw error

    // Filter products that have prices from retailers in the selected country
    const filteredProducts = (data || []).filter(product => 
      product.prices?.some(price => retailerIds.includes(price.retailer_id))
    ).map(product => ({
      ...product,
      prices: product.prices?.filter(price => retailerIds.includes(price.retailer_id)) || []
    }))

    return filteredProducts as ProductWithPrices[]
  },

  // Get price history for a product
  async getPriceHistory(productId: string, countryCode: string = 'US', days: number = 30): Promise<PriceHistoryEntry[]> {
    // Get retailer IDs for the country
    const { data: countryRetailers } = await supabase
      .from('retailer_countries')
      .select('retailer_id')
      .eq('country_code', countryCode)

    const retailerIds = countryRetailers?.map(rc => rc.retailer_id) || []

    if (retailerIds.length === 0) {
      return []
    }

    const { data, error } = await supabase
      .from('price_history')
      .select('*')
      .eq('product_id', productId)
      .in('retailer_id', retailerIds)
      .gte('recorded_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('recorded_at', { ascending: true })

    if (error) throw error

    // Group by date and calculate min, max, avg prices
    const groupedData: Record<string, { prices: number[], retailers: Set<string> }> = {}

    data?.forEach(entry => {
      const date = entry.recorded_at?.split('T')[0] || ''
      if (!groupedData[date]) {
        groupedData[date] = { prices: [], retailers: new Set() }
      }
      groupedData[date].prices.push(entry.price)
      groupedData[date].retailers.add(entry.retailer_id)
    })

    return Object.entries(groupedData).map(([date, { prices, retailers }]) => ({
      date,
      min_price: Math.min(...prices),
      max_price: Math.max(...prices),
      avg_price: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      retailer_count: retailers.size
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  },

  // Get scheduler status
  async getSchedulerStatus(): Promise<SchedulerRun[]> {
    const { data, error } = await supabase
      .from('scheduler_runs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(10)

    if (error) throw error
    return data || []
  },

  // Trigger manual scheduler run
  async triggerScheduler(runType: string = 'manual'): Promise<void> {
    const { error } = await supabase.functions.invoke('master-daily-scheduler', {
      body: { runType, manual: true }
    })

    if (error) throw error
  },

  // Set price alert
  async setPriceAlert(productId: string, targetPrice: number, email: string): Promise<void> {
    // This would typically save to a price_alerts table
    // For now, we'll just log it
    console.log('Price alert set:', { productId, targetPrice, email })
  }
}