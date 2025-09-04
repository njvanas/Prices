import { ChevronDown, Globe } from 'lucide-react'
import type { Database } from '../lib/database.types'

type Country = Database['public']['Tables']['countries']['Row']

interface CountrySelectorProps {
  countries: Country[]
  selectedCountry: string
  onCountryChange: (countryCode: string) => void
}

export function CountrySelector({ countries, selectedCountry, onCountryChange }: CountrySelectorProps) {
  return (
    <div className="relative">
      <select
        value={selectedCountry}
        onChange={(e) => onCountryChange(e.target.value)}
        className="appearance-none bg-dark-700/50 border border-dark-600 text-gray-200 px-4 py-2 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:bg-dark-700/70"
      >
        {countries.map((country) => (
          <option key={country.code} value={country.code} className="bg-dark-800 text-gray-200">
            {country.flag_emoji} {country.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Globe className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  )
}