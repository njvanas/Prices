import { supabase } from './supabase'
import type { Database } from './database.types'

export type ProductWithPrices = {
  id: string
  name: string
  description: string | null
  brand: string | null
  model: string | null
  category_id: string | null
  image_url: string | null
  specifications: any
  created_at: string | null
  updated_at: string | null
  category?: {
    name: string
    slug: string
  }
  prices: Array<{
    id: string
    price: number
    currency: string | null
    product_url: string
    availability: string | null
    last_checked: string | null
    retailer: {
      id: string
      name: string
      website_url: string
      logo_url: string | null
    }
  }>
  lowest_price?: number
  highest_price?: number
  savings_amount?: number
  savings_percentage?: number
}

export type PriceHistoryEntry = {
  date: string
  min_price: number
  max_price: number
  avg_price: number
  retailer_count: number
}

export const PriceComparisonAPI = {
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  },

  async getCountries() {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data || []
  },

  async getFeaturedProducts(countryCode: string): Promise<ProductWithPrices[]> {
    // Get retailer IDs for this country
    const { data: countryRetailers } = await supabase
      .from('retailer_countries')
      .select('retailer_id')
      .eq('country_code', countryCode)

    const retailerIds = countryRetailers?.map(rc => rc.retailer_id) || []

    // First try to get featured deals
    const { data: featuredDeals } = await supabase
      .from('featured_deals')
      .select(`
        product_id,
        savings_amount,
        savings_percentage,
        lowest_price,
        highest_price
      `)
      .gt('expires_at', new Date().toISOString())
      .order('deal_rank')

    const featuredProductIds = featuredDeals?.map(deal => deal.product_id) || []

    // Get products with their prices
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(name, slug),
        prices(
          id,
          price,
          currency,
          product_url,
          availability,
          last_checked,
          retailer:retailers(id, name, website_url, logo_url)
        )
      `)

    // If we have featured deals, prioritize them, otherwise get all products
    if (featuredProductIds.length > 0) {
      query = query.in('id', featuredProductIds)
    }

    const { data: products, error } = await query
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    // Filter prices by country retailers and enhance with deal info
    const enhancedProducts: ProductWithPrices[] = (products || []).map(product => {
      const countryPrices = product.prices?.filter(price => 
        retailerIds.includes(price.retailer.id)
      ) || []

      const prices = countryPrices.map(price => ({
        ...price,
        price: Number(price.price)
      }))

      const priceValues = prices.map(p => p.price).filter(p => p > 0)
      const lowest_price = priceValues.length > 0 ? Math.min(...priceValues) : 0
      const highest_price = priceValues.length > 0 ? Math.max(...priceValues) : 0

      // Get deal info if this is a featured product
      const dealInfo = featuredDeals?.find(deal => deal.product_id === product.id)

      return {
        ...product,
        prices,
        lowest_price,
        highest_price,
        savings_amount: dealInfo?.savings_amount ? Number(dealInfo.savings_amount) : undefined,
        savings_percentage: dealInfo?.savings_percentage ? Number(dealInfo.savings_percentage) : undefined
      }
    })

    return enhancedProducts
  },

  async searchProducts(query: string, countryCode: string, categoryId?: string): Promise<ProductWithPrices[]> {
    // Get retailer IDs for this country
    const { data: countryRetailers } = await supabase
      .from('retailer_countries')
      .select('retailer_id')
      .eq('country_code', countryCode)

    const retailerIds = countryRetailers?.map(rc => rc.retailer_id) || []

    let searchQuery = supabase
      .from('products')
      .select(`
        *,
        category:categories(name, slug),
        prices(
          id,
          price,
          currency,
          product_url,
          availability,
          last_checked,
          retailer:retailers(id, name, website_url, logo_url)
        )
      `)

    if (query.trim()) {
      searchQuery = searchQuery.or(`name.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%`)
    }

    if (categoryId) {
      searchQuery = searchQuery.eq('category_id', categoryId)
    }

    const { data: products, error } = await searchQuery
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    // Filter prices by country retailers
    const enhancedProducts: ProductWithPrices[] = (products || []).map(product => {
      const countryPrices = product.prices?.filter(price => 
        retailerIds.includes(price.retailer.id)
      ) || []

      const prices = countryPrices.map(price => ({
        ...price,
        price: Number(price.price)
      }))

      const priceValues = prices.map(p => p.price).filter(p => p > 0)
      const lowest_price = priceValues.length > 0 ? Math.min(...priceValues) : 0
      const highest_price = priceValues.length > 0 ? Math.max(...priceValues) : 0

      return {
        ...product,
        prices,
        lowest_price,
        highest_price
      }
    })

    return enhancedProducts
  },

  async getPriceHistory(productId: string, countryCode: string): Promise<PriceHistoryEntry[]> {
    // Get retailer IDs for this country
    const { data: countryRetailers } = await supabase
      .from('retailer_countries')
      .select('retailer_id')
      .eq('country_code', countryCode)

    const retailerIds = countryRetailers?.map(rc => rc.retailer_id) || []

    if (retailerIds.length === 0) {
      return []
    }

    // Get price history for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: priceHistory, error } = await supabase
      .from('price_history')
      .select('price, recorded_at, retailer_id')
      .eq('product_id', productId)
      .in('retailer_id', retailerIds)
      .gte('recorded_at', thirtyDaysAgo.toISOString())
      .order('recorded_at')

    if (error) throw error

    // Group by date and calculate daily statistics
    const dailyStats = new Map<string, { prices: number[], date: string }>()

    priceHistory?.forEach(entry => {
      const date = new Date(entry.recorded_at!).toISOString().split('T')[0]
      if (!dailyStats.has(date)) {
        dailyStats.set(date, { prices: [], date })
      }
      dailyStats.get(date)!.prices.push(Number(entry.price))
    })

    // Convert to PriceHistoryEntry format
    const historyEntries: PriceHistoryEntry[] = Array.from(dailyStats.values()).map(day => {
      const prices = day.prices
      return {
        date: day.date,
        min_price: Math.min(...prices),
        max_price: Math.max(...prices),
        avg_price: prices.reduce((sum, price) => sum + price, 0) / prices.length,
        retailer_count: new Set(prices).size
      }
    })

    return historyEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  },

  async setPriceAlert(productId: string, targetPrice: number, email: string) {
    // This would typically create a price alert in the database
    // For now, we'll just return a success message
    console.log(`Price alert set for product ${productId} at $${targetPrice} for ${email}`)
    return { success: true, message: 'Price alert created successfully!' }
  }
}