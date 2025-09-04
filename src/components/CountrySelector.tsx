import { Globe } from 'lucide-react'
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
        className="appearance-none input-dark rounded-xl px-4 py-3 pr-12 text-sm font-medium hover:border-primary-500 focus:ring-2 transition-all duration-200 cursor-pointer"
      >
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name} {country.currency_symbol}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <Globe className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  )
}