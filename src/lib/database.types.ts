export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      countries: {
        Row: {
          code: string
          name: string
          currency: string
          currency_symbol: string
          flag_emoji: string
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          code: string
          name: string
          currency: string
          currency_symbol?: string
          flag_emoji?: string
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          code?: string
          name?: string
          currency?: string
          currency_symbol?: string
          flag_emoji?: string
          is_active?: boolean | null
          created_at?: string | null
        }
        Relationships: []
      }
      featured_deals: {
        Row: {
          id: string
          product_id: string
          savings_amount: number
          savings_percentage: number
          lowest_price: number
          highest_price: number
          deal_rank: number
          last_updated: string | null
          expires_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          product_id: string
          savings_amount?: number
          savings_percentage?: number
          lowest_price: number
          highest_price: number
          deal_rank: number
          last_updated?: string | null
          expires_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          savings_amount?: number
          savings_percentage?: number
          lowest_price?: number
          highest_price?: number
          deal_rank?: number
          last_updated?: string | null
          expires_at?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "featured_deals_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      price_history: {
        Row: {
          id: string
          product_id: string
          retailer_id: string
          price: number
          currency: string | null
          recorded_at: string | null
        }
        Insert: {
          id?: string
          product_id: string
          retailer_id: string
          price: number
          currency?: string | null
          recorded_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          retailer_id?: string
          price?: number
          currency?: string | null
          recorded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_history_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          }
        ]
      }
      prices: {
        Row: {
          id: string
          product_id: string
          retailer_id: string
          price: number
          currency: string | null
          product_url: string
          availability: string | null
          last_checked: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          product_id: string
          retailer_id: string
          price: number
          currency?: string | null
          product_url: string
          availability?: string | null
          last_checked?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          retailer_id?: string
          price?: number
          currency?: string | null
          product_url?: string
          availability?: string | null
          last_checked?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prices_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          brand: string | null
          model: string | null
          category_id: string | null
          image_url: string | null
          specifications: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          brand?: string | null
          model?: string | null
          category_id?: string | null
          image_url?: string | null
          specifications?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          brand?: string | null
          model?: string | null
          category_id?: string | null
          image_url?: string | null
          specifications?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      retailer_countries: {
        Row: {
          id: string
          retailer_id: string
          country_code: string
          website_url: string
          is_primary: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          retailer_id: string
          country_code: string
          website_url: string
          is_primary?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          retailer_id?: string
          country_code?: string
          website_url?: string
          is_primary?: boolean | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retailer_countries_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "retailer_countries_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          }
        ]
      }
      retailers: {
        Row: {
          id: string
          name: string
          website_url: string
          logo_url: string | null
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          website_url: string
          logo_url?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          website_url?: string
          logo_url?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}