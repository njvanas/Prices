import { supabase } from './supabase'
import type { Database } from './database.types'

type Product = Database['public']['Tables']['products']['Row']
type Price = Database['public']['Tables']['prices']['Row']
type Retailer = Database['public']['Tables']['retailers']['Row']
type Category = Database['public']['Tables']['categories']['Row']

// Simplified country interface since the table doesn't exist yet
interface Country {
  code: string
  name: string
  currency_symbol: string
}

export interface ProductWithPrices extends Product {
  category: Category | null
  prices: (Price & { retailer: Retailer })[]
  lowest_price?: number
  highest_price?: number
  currency_symbol?: string
}

export class PriceComparisonAPI {
  // Get all supported countries
  static async getCountries(): Promise<Country[]> {
    // Return hardcoded countries until the countries table is created
    return [
      { code: 'US', name: 'United States', currency_symbol: '$' },
      { code: 'UK', name: 'United Kingdom', currency_symbol: '£' },
      { code: 'CA', name: 'Canada', currency_symbol: 'C$' },
      { code: 'AU', name: 'Australia', currency_symbol: 'A$' },
      { code: 'DE', name: 'Germany', currency_symbol: '€' },
      { code: 'FR', name: 'France', currency_symbol: '€' },
      { code: 'JP', name: 'Japan', currency_symbol: '¥' }
    ]
  }

  // Get all categories
  static async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  }

  // Search products with pricing information
  static async searchProducts(query: string, countryCode: string = 'US', categoryId?: string): Promise<ProductWithPrices[]> {
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
      .order('name')
      .limit(50)

    if (error) throw error

    // Get currency symbol for the selected country
    const countries = await this.getCountries()
    const countryData = countries.find(c => c.code === countryCode)

    // Calculate price ranges for each product
    return (data || []).map(product => {
      const prices = product.prices.filter(p => p.retailer.is_active)
      const priceValues = prices.map(p => p.price)
      
      return {
        ...product,
        prices,
        lowest_price: priceValues.length > 0 ? Math.min(...priceValues) : undefined,
        highest_price: priceValues.length > 0 ? Math.max(...priceValues) : undefined,
        currency_symbol: countryData?.currency_symbol || '$'
      }
    })
  }

  // Get product details with full pricing information
  static async getProductDetails(productId: string, countryCode: string = 'US'): Promise<ProductWithPrices | null> {
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

    // Get currency symbol for the selected country
    const countries = await this.getCountries()
    const countryData = countries.find(c => c.code === countryCode)
    
    const prices = data.prices.filter(p => p.retailer.is_active)
    const priceValues = prices.map(p => p.price)

    return {
      ...data,
      prices,
      lowest_price: priceValues.length > 0 ? Math.min(...priceValues) : undefined,
      highest_price: priceValues.length > 0 ? Math.max(...priceValues) : undefined,
      currency_symbol: countryData?.currency_symbol || '$'
    }
  }

  // Get price history for a product
  static async getPriceHistory(productId: string, retailerId?: string) {
    let query = supabase
      .from('price_history')
      .select(`
        *,
        retailer:retailers(name, logo_url)
      `)
      .eq('product_id', productId)
      .order('recorded_at', { ascending: false })

    if (retailerId) {
      query = query.eq('retailer_id', retailerId)
    }

    const { data, error } = await query.limit(100)

    if (error) throw error
    return data || []
  }

  // Get featured/trending products
  static async getFeaturedProducts(countryCode: string = 'US'): Promise<ProductWithPrices[]> {
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
      .limit(12)

    if (error) throw error

    // Get currency symbol for the selected country
    const countries = await this.getCountries()
    const countryData = countries.find(c => c.code === countryCode)
    
    return (data || []).map(product => {
      const prices = product.prices.filter(p => p.retailer.is_active)
      const priceValues = prices.map(p => p.price)
      
      return {
        ...product,
        prices,
        lowest_price: priceValues.length > 0 ? Math.min(...priceValues) : undefined,
        highest_price: priceValues.length > 0 ? Math.max(...priceValues) : undefined,
        currency_symbol: countryData?.currency_symbol || '$'
      }
    })
  }
}