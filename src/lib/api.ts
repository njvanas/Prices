import { supabase } from './supabase'
import type { Database } from './database.types'

type Product = Database['public']['Tables']['products']['Row']
type Price = Database['public']['Tables']['prices']['Row']
type Retailer = Database['public']['Tables']['retailers']['Row']
type Category = Database['public']['Tables']['categories']['Row']
type FeaturedDeal = Database['public']['Tables']['featured_deals']['Row']

export interface ProductWithPrices extends Product {
  category?: Category
  prices: (Price & { retailer: Retailer })[]
  savings_amount?: number
  savings_percentage?: number
  deal_rank?: number
}

export interface Country {
  code: string
  name: string
  currency: string
  flag: string
}

// Hardcoded countries until we add the countries table
export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', currency: 'USD', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', currency: 'EUR', flag: '🇩🇪' },
  { code: 'FR', name: 'France', currency: 'EUR', flag: '🇫🇷' },
  { code: 'CA', name: 'Canada', currency: 'CAD', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', currency: 'AUD', flag: '🇦🇺' },
  { code: 'JP', name: 'Japan', currency: 'JPY', flag: '🇯🇵' },
  { code: 'CN', name: 'China', currency: 'CNY', flag: '🇨🇳' },
]

export class PriceComparisonAPI {
  static async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  }

  static async getCountries(): Promise<Country[]> {
    // Return hardcoded countries for now
    return COUNTRIES
  }

  static async getBestDeals(countryCode: string = 'US', limit: number = 10): Promise<ProductWithPrices[]> {
    // Get featured deals with product and price information
    const { data: featuredDeals, error: featuredError } = await supabase
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
      .limit(limit)

    if (featuredError) {
      console.error('Featured deals error:', featuredError)
      // Fallback to regular products if featured deals fail
      return this.getFeaturedProducts(countryCode, limit)
    }

    if (!featuredDeals || featuredDeals.length === 0) {
      // Fallback to regular products if no featured deals
      return this.getFeaturedProducts(countryCode, limit)
    }

    // Transform the data to match ProductWithPrices interface
    return featuredDeals.map(deal => ({
      ...deal.product,
      category: deal.product.category,
      prices: deal.product.prices || [],
      savings_amount: deal.savings_amount,
      savings_percentage: deal.savings_percentage,
      deal_rank: deal.deal_rank
    })).filter(product => product.prices && product.prices.length > 0)
  }

  static async getFeaturedProducts(countryCode: string = 'US', limit: number = 12): Promise<ProductWithPrices[]> {
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
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    // Calculate savings for each product
    return (data || []).map(product => {
      const prices = product.prices || []
      if (prices.length === 0) return { ...product, prices: [] }

      const priceValues = prices.map(p => p.price)
      const lowestPrice = Math.min(...priceValues)
      const highestPrice = Math.max(...priceValues)
      const savings = highestPrice - lowestPrice
      const savingsPercentage = savings > 0 ? (savings / highestPrice) * 100 : 0

      return {
        ...product,
        prices,
        savings_amount: savings,
        savings_percentage: savingsPercentage
      }
    }).filter(product => product.prices.length > 0)
  }

  static async searchProducts(
    query: string, 
    countryCode: string = 'US', 
    categoryId?: string
  ): Promise<ProductWithPrices[]> {
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
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    // Calculate savings for each product
    return (data || []).map(product => {
      const prices = product.prices || []
      if (prices.length === 0) return { ...product, prices: [] }

      const priceValues = prices.map(p => p.price)
      const lowestPrice = Math.min(...priceValues)
      const highestPrice = Math.max(...priceValues)
      const savings = highestPrice - lowestPrice
      const savingsPercentage = savings > 0 ? (savings / highestPrice) * 100 : 0

      return {
        ...product,
        prices,
        savings_amount: savings,
        savings_percentage: savingsPercentage
      }
    }).filter(product => product.prices.length > 0)
  }

  static async getProductById(id: string): Promise<ProductWithPrices | null> {
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
      .eq('id', id)
      .single()

    if (error) throw error

    if (!data) return null

    const prices = data.prices || []
    const priceValues = prices.map(p => p.price)
    const lowestPrice = Math.min(...priceValues)
    const highestPrice = Math.max(...priceValues)
    const savings = highestPrice - lowestPrice
    const savingsPercentage = savings > 0 ? (savings / highestPrice) * 100 : 0

    return {
      ...data,
      prices,
      savings_amount: savings,
      savings_percentage: savingsPercentage
    }
  }
}