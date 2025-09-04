import { supabase } from './supabase'
import type { Database } from './database.types'

type Product = Database['public']['Tables']['products']['Row']
type Price = Database['public']['Tables']['prices']['Row']
type Retailer = Database['public']['Tables']['retailers']['Row']
type Category = Database['public']['Tables']['categories']['Row']

export interface ProductWithPrices extends Product {
  category: Category | null
  prices: (Price & { retailer: Retailer })[]
  lowest_price?: number
  highest_price?: number
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

  // Search products with pricing information
  static async searchProducts(query: string, categoryId?: string): Promise<ProductWithPrices[]> {
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

    // Calculate price ranges for each product
    return (data || []).map(product => {
      const prices = product.prices.filter(p => p.retailer.is_active)
      const priceValues = prices.map(p => p.price)
      
      return {
        ...product,
        prices,
        lowest_price: priceValues.length > 0 ? Math.min(...priceValues) : undefined,
        highest_price: priceValues.length > 0 ? Math.max(...priceValues) : undefined
      }
    })
  }

  // Get product details with full pricing information
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

    const prices = data.prices.filter(p => p.retailer.is_active)
    const priceValues = prices.map(p => p.price)

    return {
      ...data,
      prices,
      lowest_price: priceValues.length > 0 ? Math.min(...priceValues) : undefined,
      highest_price: priceValues.length > 0 ? Math.max(...priceValues) : undefined
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
  static async getFeaturedProducts(): Promise<ProductWithPrices[]> {
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

    return (data || []).map(product => {
      const prices = product.prices.filter(p => p.retailer.is_active)
      const priceValues = prices.map(p => p.price)
      
      return {
        ...product,
        prices,
        lowest_price: priceValues.length > 0 ? Math.min(...priceValues) : undefined,
        highest_price: priceValues.length > 0 ? Math.max(...priceValues) : undefined
      }
    })
  }
}