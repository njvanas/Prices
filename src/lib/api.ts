import { supabase } from './supabase'
import type { Database } from './database.types'

type Product = Database['public']['Tables']['products']['Row']
type Price = Database['public']['Tables']['prices']['Row']
type Retailer = Database['public']['Tables']['retailers']['Row']
type Category = Database['public']['Tables']['categories']['Row']
type Country = Database['public']['Tables']['countries']['Row']
type FeaturedDeal = Database['public']['Tables']['featured_deals']['Row']
type PriceHistory = Database['public']['Tables']['price_history']['Row']

export interface ProductWithPrices extends Product {
  prices: (Price & { retailer: Retailer })[]
  category?: Category
  lowest_price?: number
  highest_price?: number
  savings_amount?: number
  savings_percentage?: number
  deal_rank?: number
  currency_symbol?: string
}

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
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data || []
  }

  static async getRetailersByCountry(countryCode: string): Promise<Retailer[]> {
    const { data, error } = await supabase
      .from('retailer_countries')
      .select(`
        retailer:retailers(*)
      `)
      .eq('country_code', countryCode)

    if (error) throw error
    return data?.map(item => item.retailer).filter(Boolean) || []
  }

  static async searchProducts(
    query: string = '',
    countryCode: string = 'US',
    categoryId?: string
  ): Promise<ProductWithPrices[]> {
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

    if (query) {
      productsQuery = productsQuery.or(`name.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%`)
    }

    if (categoryId) {
      productsQuery = productsQuery.eq('category_id', categoryId)
    }

    const { data: products, error } = await productsQuery.order('name')

    if (error) throw error

    // Get country info for currency symbol
    const { data: countryData } = await supabase
      .from('countries')
      .select('currency_symbol')
      .eq('code', countryCode)
      .single()

    const currencySymbol = countryData?.currency_symbol || '$'

    // Filter products to only include those with prices from retailers in the selected country
    const { data: countryRetailers } = await supabase
      .from('retailer_countries')
      .select('retailer_id')
      .eq('country_code', countryCode)

    const retailerIds = countryRetailers?.map(rc => rc.retailer_id) || []

    const filteredProducts = (products || [])
      .map(product => {
        const countryPrices = product.prices.filter(price => 
          retailerIds.includes(price.retailer_id) && price.retailer.is_active
        )
        
        if (countryPrices.length === 0) return null

        const prices = countryPrices.map(price => parseFloat(price.price.toString()))
        const lowest_price = Math.min(...prices)
        const highest_price = Math.max(...prices)
        const savings_amount = highest_price - lowest_price
        const savings_percentage = highest_price > 0 ? (savings_amount / highest_price) * 100 : 0

        return {
          ...product,
          prices: countryPrices,
          lowest_price,
          highest_price,
          savings_amount,
          savings_percentage,
          currency_symbol: currencySymbol
        }
      })
      .filter(Boolean) as ProductWithPrices[]

    return filteredProducts
  }

  static async getFeaturedProducts(countryCode: string = 'US'): Promise<ProductWithPrices[]> {
    // Get country info for currency symbol
    const { data: countryData } = await supabase
      .from('countries')
      .select('currency_symbol')
      .eq('code', countryCode)
      .single()

    const currencySymbol = countryData?.currency_symbol || '$'

    // First try to get featured deals
    const { data: featuredDeals, error: dealsError } = await supabase
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
      .limit(10)

    if (!dealsError && featuredDeals && featuredDeals.length > 0) {
      // Filter by country retailers
      const { data: countryRetailers } = await supabase
        .from('retailer_countries')
        .select('retailer_id')
        .eq('country_code', countryCode)

      const retailerIds = countryRetailers?.map(rc => rc.retailer_id) || []

      const filteredDeals = featuredDeals
        .map(deal => {
          if (!deal.product) return null
          
          const countryPrices = deal.product.prices.filter(price => 
            retailerIds.includes(price.retailer_id) && price.retailer.is_active
          )
          
          if (countryPrices.length === 0) return null

          return {
            ...deal.product,
            prices: countryPrices,
            lowest_price: deal.lowest_price,
            highest_price: deal.highest_price,
            savings_amount: deal.savings_amount,
            savings_percentage: deal.savings_percentage,
            deal_rank: deal.deal_rank,
            currency_symbol: currencySymbol
          }
        })
        .filter(Boolean) as ProductWithPrices[]

      if (filteredDeals.length > 0) {
        return filteredDeals
      }
    }

    // Fallback: get products with best savings
    const products = await this.searchProducts('', countryCode)
    return products
      .filter(product => product.savings_percentage && product.savings_percentage >= 10)
      .sort((a, b) => (b.savings_percentage || 0) - (a.savings_percentage || 0))
      .slice(0, 10)
  }

  static async getProductById(id: string, countryCode: string = 'US'): Promise<ProductWithPrices | null> {
    const { data: product, error } = await supabase
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

    if (error || !product) return null

    // Get country info for currency symbol
    const { data: countryData } = await supabase
      .from('countries')
      .select('currency_symbol')
      .eq('code', countryCode)
      .single()

    const currencySymbol = countryData?.currency_symbol || '$'

    // Filter prices by country retailers
    const { data: countryRetailers } = await supabase
      .from('retailer_countries')
      .select('retailer_id')
      .eq('country_code', countryCode)

    const retailerIds = countryRetailers?.map(rc => rc.retailer_id) || []
    const countryPrices = product.prices.filter(price => 
      retailerIds.includes(price.retailer_id) && price.retailer.is_active
    )

    if (countryPrices.length === 0) return null

    const prices = countryPrices.map(price => parseFloat(price.price.toString()))
    const lowest_price = Math.min(...prices)
    const highest_price = Math.max(...prices)
    const savings_amount = highest_price - lowest_price
    const savings_percentage = highest_price > 0 ? (savings_amount / highest_price) * 100 : 0

    return {
      ...product,
      prices: countryPrices,
      lowest_price,
      highest_price,
      savings_amount,
      savings_percentage,
      currency_symbol: currencySymbol
    }
  }

  static async getPriceHistory(
    productId: string, 
    countryCode: string = 'US',
    days: number = 30
  ): Promise<(PriceHistory & { retailer: Retailer })[]> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get retailers for this country
    const { data: countryRetailers } = await supabase
      .from('retailer_countries')
      .select('retailer_id')
      .eq('country_code', countryCode)

    const retailerIds = countryRetailers?.map(rc => rc.retailer_id) || []

    const { data, error } = await supabase
      .from('price_history')
      .select(`
        *,
        retailer:retailers(*)
      `)
      .eq('product_id', productId)
      .in('retailer_id', retailerIds)
      .gte('recorded_at', startDate.toISOString())
      .order('recorded_at', { ascending: true })

    if (error) throw error
    return data || []
  }
}