import React from 'react'
import { ChevronDown, Globe } from 'lucide-react'
import type { Database } from '../lib/database.types'

type Country = Database['public']['Tables']['countries']['Row']

interface CountrySelectorProps {
  countries: Country[]
  selectedCountry: string
  onCountryChange: (countryCode: string) => void
}

export function CountrySelector({ countries, selectedCountry, onCountryChange }: CountrySelectorProps) {
  const selectedCountryData = countries.find(c => c.code === selectedCountry)

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 bg-dark-700/50 hover:bg-dark-600/50 border border-dark-600 rounded-xl px-4 py-2.5 transition-all duration-200 hover:border-primary-500/50">
        <Globe className="w-4 h-4 text-gray-400" />
        <span className="text-gray-300 font-medium">
          {selectedCountryData?.flag_emoji} {selectedCountryData?.name || 'Select Country'}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary-400 transition-colors" />
      </button>

      <div className="absolute top-full left-0 mt-2 w-64 bg-dark-800 border border-dark-600 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-2 max-h-80 overflow-y-auto">
          {countries.map((country) => (
            <button
              key={country.code}
              onClick={() => onCountryChange(country.code)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${
                selectedCountry === country.code
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'hover:bg-dark-700/50 text-gray-300 hover:text-white'
              }`}
            >
              <span className="text-lg">{country.flag_emoji}</span>
              <div className="flex-1">
                <div className="font-medium">{country.name}</div>
                <div className="text-sm text-gray-400">{country.currency_symbol} {country.currency}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}