import { supabase } from './supabase'
import type { Database } from './database.types'

type Product = Database['public']['Tables']['products']['Row']
type Price = Database['public']['Tables']['prices']['Row']
type Retailer = Database['public']['Tables']['retailers']['Row']
type Category = Database['public']['Tables']['categories']['Row']
type Country = Database['public']['Tables']['countries']['Row']

export interface ProductWithPrices extends Product {
  prices: (Price & {
    retailer: Retailer
  })[]
  savings_amount?: number
  savings_percentage?: number
  lowest_price?: number
  highest_price?: number
  deal_rank?: number
  currency_symbol?: string
}

export const PriceComparisonAPI = {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  },

  async getCountries(): Promise<Country[]> {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('is_active', true)
      .order('name')
    
    if (error) throw error
    return data || []
  },

  async getFeaturedProducts(countryCode: string): Promise<ProductWithPrices[]> {
    const { data, error } = await supabase
      .from('featured_deals')
      .select(`
        *,
        products!inner (
          *,
          prices!inner (
            *,
            retailers!inner (*)
          )
        )
      `)
      .order('deal_rank')
    
    if (error) throw error
    
    return (data || []).map(deal => ({
      ...deal.products,
      prices: deal.products.prices,
      savings_amount: deal.savings_amount,
      savings_percentage: deal.savings_percentage,
      lowest_price: deal.lowest_price,
      highest_price: deal.highest_price,
      deal_rank: deal.deal_rank
    }))
  },

  async searchProducts(
    query: string, 
    countryCode: string, 
    categoryId?: string
  ): Promise<ProductWithPrices[]> {
    let queryBuilder = supabase
      .from('products')
      .select(`
        *,
        prices!inner (
          *,
          retailers!inner (*)
        )
      `)
    
    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`)
    }
    
    if (categoryId) {
      queryBuilder = queryBuilder.eq('category_id', categoryId)
    }
    
    const { data, error } = await queryBuilder.order('name')
    
    if (error) throw error
    
    return (data || []).map(product => ({
      ...product,
      prices: product.prices
    }))
  },

  async getProductById(id: string): Promise<ProductWithPrices | null> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        prices (
          *,
          retailers (*)
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }
}