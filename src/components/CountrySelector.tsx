import React from 'react'
import { Globe } from 'lucide-react'
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
    <div className="relative">
      <select
        value={selectedCountry}
        onChange={(e) => onCountryChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 cursor-pointer"
      >
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name} ({country.currency_symbol})
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <Globe className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  )
}