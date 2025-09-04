export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          created_at?: string
        }
      }
      retailers: {
        Row: {
          id: string
          name: string
          website_url: string
          logo_url: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          website_url: string
          logo_url?: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          website_url?: string
          logo_url?: string
          is_active?: boolean
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          brand: string
          model: string
          category_id: string | null
          image_url: string
          specifications: Record<string, any>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          brand?: string
          model?: string
          category_id?: string | null
          image_url?: string
          specifications?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          brand?: string
          model?: string
          category_id?: string | null
          image_url?: string
          specifications?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
      }
      prices: {
        Row: {
          id: string
          product_id: string
          retailer_id: string
          price: number
          currency: string
          product_url: string
          availability: string
          last_checked: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          retailer_id: string
          price: number
          currency?: string
          product_url: string
          availability?: string
          last_checked?: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          retailer_id?: string
          price?: number
          currency?: string
          product_url?: string
          availability?: string
          last_checked?: string
          created_at?: string
        }
      }
      price_history: {
        Row: {
          id: string
          product_id: string
          retailer_id: string
          price: number
          currency: string
          recorded_at: string
        }
        Insert: {
          id?: string
          product_id: string
          retailer_id: string
          price: number
          currency?: string
          recorded_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          retailer_id?: string
          price?: number
          currency?: string
          recorded_at?: string
        }
      }
    }
  }
}