import { useState, useEffect } from 'react'
import { Package } from 'lucide-react'
import { Header } from './components/Header'
import { ProductCard } from './components/ProductCard'
import { ProductDetail } from './components/ProductDetail'
import { CategoryFilter } from './components/CategoryFilter'
import { LoadingSpinner } from './components/LoadingSpinner'
import { HotDealsSection } from './components/HotDealsSection'
import { PriceComparisonAPI, type ProductWithPrices } from './lib/api'
import type { Database } from './lib/database.types'

type Category = Database['public']['Tables']['categories']['Row']
type Country = Database['public']['Tables']['countries']['Row']

function App() {
  const [products, setProducts] = useState<ProductWithPrices[]>([])
  const [hotDeals, setHotDeals] = useState<ProductWithPrices[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedProduct, setSelectedProduct] = useState<ProductWithPrices | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState('US')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        const [categoriesData, countriesData, productsData] = await Promise.all([
          PriceComparisonAPI.getCategories(),
          PriceComparisonAPI.getCountries(),
          PriceComparisonAPI.getFeaturedProducts('US')
        ])
        setCategories(categoriesData)
        setCountries(countriesData)
        setProducts(productsData)
        
        // Set default country based on user's location (you could use IP geolocation)
        // For now, defaulting to US
        setSelectedCountry('US')
      } catch (err) {
        setError('Failed to load data. Please try again.')
        console.error('Error loading initial data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Handle country change
  const handleCountryChange = async (countryCode: string) => {
    try {
      setLoading(true)
      setSelectedCountry(countryCode)
      const results = await PriceComparisonAPI.searchProducts(searchQuery, countryCode, selectedCategory || undefined)
      setProducts(results)
    } catch (err) {
      setError('Failed to load prices for selected country. Please try again.')
      console.error('Country change error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle search
  const handleSearch = async (query: string) => {
    try {
      setLoading(true)
      setSearchQuery(query)
      const results = await PriceComparisonAPI.searchProducts(query, selectedCountry, selectedCategory || undefined)
      setProducts(results)
    } catch (err) {
      setError('Search failed. Please try again.')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle category filter
  const handleCategoryChange = async (categoryId: string | null) => {
    try {
      setLoading(true)
      setSelectedCategory(categoryId)
      const results = await PriceComparisonAPI.searchProducts(searchQuery, selectedCountry, categoryId || undefined)
      setProducts(results)
    } catch (err) {
      setError('Failed to filter by category. Please try again.')
      console.error('Category filter error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <Header 
        onSearch={handleSearch} 
        searchQuery={searchQuery}
        countries={countries}
        selectedCountry={selectedCountry}
        onCountryChange={handleCountryChange}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent mb-6 text-shadow">
            Find Better Prices, Instantly
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            🚀 Compare prices across top retailers in {countries.find(c => c.code === selectedCountry)?.name || 'your country'} and save money effortlessly
          </p>
        </div>

        {error && (
          <div className="bg-error-500/10 border border-error-500/30 text-error-300 px-6 py-4 rounded-xl mb-8 animate-slide-up">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                {/* Results Header */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-semibold text-gray-100">
                    {searchQuery ? `Search Results for "${searchQuery}"` : '🔥 Today\'s Hottest Deals'}
                  </h2>
                  <span className="text-gray-400 bg-dark-700/50 px-4 py-2 rounded-xl">
                    {products.length} product{products.length !== 1 ? 's' : ''} found
                  </span>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onClick={setSelectedProduct}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="text-gray-500 mb-6">
                      <Package className="w-20 h-20 mx-auto animate-pulse-slow" />
                    </div>
                    <h3 className="text-2xl font-medium text-gray-300 mb-3">No products found</h3>
                    <p className="text-gray-400 text-lg">
                      {searchQuery 
                        ? 'Try adjusting your search terms or browse different categories'
                        : 'No products available at the moment'
                      }
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          selectedCountry={selectedCountry}
        />
      )}
    </div>
  )
}

export default App