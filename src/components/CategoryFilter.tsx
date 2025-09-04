import type { Database } from '../lib/database.types'

type Category = Database['public']['Tables']['categories']['Row']

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
  onCategoryChange: (categoryId: string | null) => void
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="glass-card rounded-2xl p-6 shadow-lg">
      <h3 className="font-semibold text-gray-100 mb-4 text-lg">🏷️ Categories</h3>
      <div className="space-y-3">
        <button
          onClick={() => onCategoryChange(null)}
          className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
            selectedCategory === null
              ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
              : 'text-gray-300 hover:bg-dark-700 hover:text-gray-100'
          }`}
        >
          🌟 All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              selectedCategory === category.id
                ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                : 'text-gray-300 hover:bg-dark-700 hover:text-gray-100'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}