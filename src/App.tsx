import React, { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { ProductCard } from './components/ProductCard'
import { ProductDetail } from './components/ProductDetail'
import { CategoryFilter } from './components/CategoryFilter'
import { LoadingSpinner } from './components/LoadingSpinner'
import { PriceComparisonAPI, type ProductWithPrices } from './lib/api'
import type { Database } from './lib/database.types'

type Category = Database['public']['Tables']['categories']['Row']
type Country = Database['public']['Tables']['countries']['Row']

function App() {
  const [products, setProducts] = useState<ProductWithPrices[]>([])
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
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={handleSearch} 
        searchQuery={searchQuery}
        countries={countries}
        selectedCountry={selectedCountry}
        onCountryChange={handleCountryChange}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find the Best Prices Online
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare prices across multiple retailers in {countries.find(c => c.code === selectedCountry)?.name || 'your country'} and save money on your favorite products
          </p>
        </div>

        {error && (
          <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg mb-6">
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Products'}
                  </h2>
                  <span className="text-gray-500">
                    {products.length} product{products.length !== 1 ? 's' : ''} found
                  </span>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onClick={setSelectedProduct}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Package className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500">
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
        />
      )}
    </div>
  )
}

export default App