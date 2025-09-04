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
    <header className="glass-card sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              💰 PriceHunter
            </h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-3xl mx-8">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="What are you looking for? (e.g., iPhone, laptop, headphones...)"
                  className="w-full pl-6 pr-14 py-4 input-dark rounded-2xl text-lg focus:ring-2 transition-all duration-200 shadow-lg"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-primary-400 transition-colors hover:scale-110"
                >
                  <Search className="w-6 h-6" />
                </button>
              </div>
            </form>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <CountrySelector
              countries={countries}
              selectedCountry={selectedCountry}
              onCountryChange={onCountryChange}
            />
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 text-gray-300 hover:text-primary-400 transition-colors hover:bg-dark-700 rounded-xl"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Search and Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-dark-700 animate-slide-up">
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="What are you looking for?"
                  className="w-full pl-6 pr-14 py-4 input-dark rounded-2xl text-lg focus:ring-2 transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-primary-400 transition-colors"
                >
                  <Search className="w-6 h-6" />
                </button>
              </div>
            </form>
            <nav className="space-y-4">
              <div>
                <CountrySelector
                  countries={countries}
                  selectedCountry={selectedCountry}
                  onCountryChange={onCountryChange}
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}