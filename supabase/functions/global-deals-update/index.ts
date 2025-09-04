import { createClient } from 'npm:@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

interface ProductWithPrices {
  id: string
  name: string
  brand: string
  model: string
  image_url: string
  category_id: string
  prices: Array<{
    id: string
    price: number
    currency: string
    availability: string
    retailer: {
      name: string
      logo_url: string
      is_active: boolean
    }
    retailer_countries: Array<{
      country_code: string
      website_url: string
    }>
  }>
}

interface FeaturedDeal {
  product_id: string
  savings_amount: number
  savings_percentage: number
  lowest_price: number
  highest_price: number
  deal_rank: number
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    // Initialize Supabase client with service role key for admin operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🌍 Starting global featured deals update for all countries...')

    // Get all active countries
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('code, name, currency')
      .eq('is_active', true)

    if (countriesError) {
      throw new Error(`Failed to fetch countries: ${countriesError.message}`)
    }

    if (!countries || countries.length === 0) {
      throw new Error('No active countries found')
    }

    console.log(`🗺️ Processing ${countries.length} countries: ${countries.map(c => c.code).join(', ')}`)

    let totalDealsUpdated = 0

    // Process each country separately
    for (const country of countries) {
      console.log(`\n🔄 Processing ${country.name} (${country.code})...`)

      // Fetch products with prices for this specific country
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          brand,
          model,
          image_url,
          category_id,
          prices (
            id,
            price,
            currency,
            availability,
            retailer:retailers (
              name,
              logo_url,
              is_active
            ),
            retailer_countries!inner (
              country_code,
              website_url
            )
          )
        `)
        .eq('prices.retailer_countries.country_code', country.code)
        .eq('prices.retailer.is_active', true)
        .eq('prices.availability', 'in_stock')

      if (productsError) {
        console.error(`❌ Error fetching products for ${country.code}:`, productsError.message)
        continue
      }

      if (!products || products.length === 0) {
        console.log(`⚠️ No products found for ${country.name}`)
        continue
      }

      console.log(`📦 Analyzing ${products.length} products in ${country.name}...`)

      // Calculate savings for each product in this country
      const dealsAnalysis: FeaturedDeal[] = []

      for (const product of products as ProductWithPrices[]) {
        if (!product.prices || product.prices.length < 2) {
          continue // Need at least 2 prices to compare
        }

        // Filter prices for this country only
        const countryPrices = product.prices.filter(p => 
          p.retailer?.is_active && 
          p.availability === 'in_stock' &&
          p.price > 0 &&
          p.retailer_countries.some(rc => rc.country_code === country.code)
        )
        
        if (countryPrices.length < 2) continue

        const prices = countryPrices.map(p => p.price)
        const lowestPrice = Math.min(...prices)
        const highestPrice = Math.max(...prices)
        
        // Only consider deals with meaningful savings
        if (lowestPrice >= highestPrice || lowestPrice <= 0) continue

        const savingsAmount = highestPrice - lowestPrice
        const savingsPercentage = (savingsAmount / highestPrice) * 100

        // Only include deals with at least 15% savings for global featured deals
        if (savingsPercentage >= 15) {
          dealsAnalysis.push({
            product_id: product.id,
            savings_amount: savingsAmount,
            savings_percentage: savingsPercentage,
            lowest_price: lowestPrice,
            highest_price: highestPrice,
            deal_rank: 0 // Will be set after sorting
          })
        }
      }

      // Sort by savings percentage (highest first), then by savings amount
      dealsAnalysis.sort((a, b) => {
        if (Math.abs(a.savings_percentage - b.savings_percentage) < 1) {
          return b.savings_amount - a.savings_amount
        }
        return b.savings_percentage - a.savings_percentage
      })

      // Take top 10 and assign ranks
      const top10Deals = dealsAnalysis.slice(0, 10).map((deal, index) => ({
        ...deal,
        deal_rank: index + 1
      }))

      console.log(`🏆 Found ${top10Deals.length} featured deals for ${country.name} (15%+ savings)`)

      if (top10Deals.length === 0) {
        console.log(`📊 No deals with 15%+ savings found in ${country.name}`)
        continue
      }

      // Clear existing featured deals for this country
      const { error: deleteError } = await supabase
        .from('featured_deals')
        .delete()
        .in('product_id', top10Deals.map(d => d.product_id))

      if (deleteError) {
        console.error(`❌ Error clearing old deals for ${country.code}:`, deleteError)
      }

      // Insert new featured deals
      const { error: insertError } = await supabase
        .from('featured_deals')
        .insert(top10Deals)

      if (insertError) {
        console.error(`❌ Error inserting deals for ${country.code}:`, insertError.message)
        continue
      }

      totalDealsUpdated += top10Deals.length
      console.log(`✅ Updated ${top10Deals.length} featured deals for ${country.name}`)

      // Log the top deals for monitoring
      for (const deal of top10Deals.slice(0, 3)) {
        console.log(`🎯 ${country.code} Rank ${deal.deal_rank}: ${deal.savings_percentage.toFixed(1)}% off (Save ${country.currency_symbol || '$'}${deal.savings_amount.toFixed(2)})`)
      }
    }

    console.log(`\n🌟 Global update complete! Updated ${totalDealsUpdated} deals across ${countries.length} countries`)

    return new Response(
      JSON.stringify({ 
        message: 'Global featured deals updated successfully',
        countries_processed: countries.length,
        total_deals_updated: totalDealsUpdated,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Error updating global featured deals:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to update global featured deals',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})