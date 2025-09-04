import React, { useState } from 'react'
import { Search, Menu, X } from 'lucide-react'
import { CountrySelector } from './CountrySelector'
import type { Database } from '../lib/database.types'

type Country = Database['public']['Tables']['countries']['Row']

interface HeaderProps {
  onSearch: (query: string) => void
  searchQuery: string
  countries: Country[]
  selectedCountry: string
  onCountryChange: (countryCode: string) => void
}

export function Header({ onSearch, searchQuery, countries, selectedCountry, onCountryChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const query = formData.get('search') as string
    onSearch(query)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">
              PriceCompare
            </h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Search for products..."
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <CountrySelector
              countries={countries}
              selectedCountry={selectedCountry}
              onCountryChange={onCountryChange}
            />
            <a href="#" className="text-gray-700 hover:text-primary-600 transition-colors">
              Categories
            </a>
            <a href="#" className="text-gray-700 hover:text-primary-600 transition-colors">
              Deals
            </a>
            <a href="#" className="text-gray-700 hover:text-primary-600 transition-colors">
              About
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Search and Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Search for products..."
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
            <nav className="space-y-2">
              <div className="py-2">
                <CountrySelector
                  countries={countries}
                  selectedCountry={selectedCountry}
                  onCountryChange={onCountryChange}
                />
              </div>
              <a href="#" className="block py-2 text-gray-700 hover:text-primary-600 transition-colors">
                Categories
              </a>
              <a href="#" className="block py-2 text-gray-700 hover:text-primary-600 transition-colors">
                Deals
              </a>
              <a href="#" className="block py-2 text-gray-700 hover:text-primary-600 transition-colors">
                About
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}