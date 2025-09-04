import { supabase } from './supabase'
import type { Database } from './database.types'

type Product = Database['public']['Tables']['products']['Row']
type Category = Database['public']['Tables']['categories']['Row']
type Retailer = Database['public']['Tables']['retailers']['Row']
type Price = Database['public']['Tables']['prices']['Row']

export interface ProductWithPrices extends Product {
  category?: Category
  prices: (Price & { retailer: Retailer })[]
  lowest_price?: number
  highest_price?: number
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

export class PriceComparisonAPI {
  // Get all categories
  static async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  }

  // Get supported countries (hardcoded for now)
  static async getCountries(): Promise<Country[]> {
    return [
      { code: 'US', name: 'United States', currency: 'USD', flag: '🇺🇸' },
      { code: 'GB', name: 'United Kingdom', currency: 'GBP', flag: '🇬🇧' },
      { code: 'DE', name: 'Germany', currency: 'EUR', flag: '🇩🇪' },
      { code: 'FR', name: 'France', currency: 'EUR', flag: '🇫🇷' },
      { code: 'NL', name: 'Netherlands', currency: 'EUR', flag: '🇳🇱' },
      { code: 'CA', name: 'Canada', currency: 'CAD', flag: '🇨🇦' },
      { code: 'AU', name: 'Australia', currency: 'AUD', flag: '🇦🇺' },
      { code: 'JP', name: 'Japan', currency: 'JPY', flag: '🇯🇵' },
      { code: 'CN', name: 'China', currency: 'CNY', flag: '🇨🇳' },
      { code: 'IN', name: 'India', currency: 'INR', flag: '🇮🇳' }
    ]
  }

  // Get featured products (top deals)
  static async getFeaturedProducts(countryCode: string = 'US'): Promise<ProductWithPrices[]> {
    const { data, error } = await supabase
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
      .gte('savings_percentage', 30)
      .order('deal_rank')
      .limit(10)

    if (error) throw error

    return (data || []).map(deal => ({
      ...deal.product,
      lowest_price: deal.lowest_price,
      highest_price: deal.highest_price,
      savings_amount: deal.savings_amount,
      savings_percentage: deal.savings_percentage,
      deal_rank: deal.deal_rank
    }))
  }

  // Get hot deals with 30%+ savings
  static async getHotDeals(countryCode: string = 'US'): Promise<ProductWithPrices[]> {
    const { data, error } = await supabase
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
      .gte('savings_percentage', 30)
      .order('savings_percentage', { ascending: false })
      .limit(20)

    if (error) throw error

    return (data || []).map(deal => ({
      ...deal.product,
      lowest_price: deal.lowest_price,
      highest_price: deal.highest_price,
      savings_amount: deal.savings_amount,
      savings_percentage: deal.savings_percentage,
      deal_rank: deal.deal_rank
    }))
  }

  // Search products
  static async searchProducts(
    query: string = '',
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
      if (prices.length < 2) return { ...product, prices }

      const priceValues = prices.map(p => p.price)
      const lowest = Math.min(...priceValues)
      const highest = Math.max(...priceValues)
      const savings = highest - lowest
      const savingsPercentage = (savings / highest) * 100

      return {
        ...product,
        prices,
        lowest_price: lowest,
        highest_price: highest,
        savings_amount: savings,
        savings_percentage: savingsPercentage
      }
    }).filter(p => (p.savings_percentage || 0) >= 10) // Only show products with meaningful savings
  }

  // Get product details
  static async getProductDetails(productId: string): Promise<ProductWithPrices | null> {
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
      .eq('id', productId)
      .single()

    if (error) throw error

    if (!data) return null

    const prices = data.prices || []
    if (prices.length < 2) return { ...data, prices }

    const priceValues = prices.map(p => p.price)
    const lowest = Math.min(...priceValues)
    const highest = Math.max(...priceValues)
    const savings = highest - lowest
    const savingsPercentage = (savings / highest) * 100

    return {
      ...data,
      prices,
      lowest_price: lowest,
      highest_price: highest,
      savings_amount: savings,
      savings_percentage: savingsPercentage
    }
  }
}