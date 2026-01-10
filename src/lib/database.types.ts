export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string | null
          image: string | null
          is_admin: boolean | null
          role: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          image?: string | null
          is_admin?: boolean | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          image?: string | null
          is_admin?: boolean | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      pages: {
        Row: {
          id: string
          slug: string
          title: string
          content: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          content?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          content?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      expertise_cards: {
        Row: {
          id: string
          title: string
          description: string
          long_description: string
          icon: string
          skills: string[]
          images: string[]
          order: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          long_description: string
          icon: string
          skills?: string[]
          images?: string[]
          order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          long_description?: string
          icon?: string
          skills?: string[]
          images?: string[]
          order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      timeline_entries: {
        Row: {
          id: string
          year: string
          title: string
          content: Json | null
          images: string[]
          order: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          year: string
          title: string
          content?: Json | null
          images?: string[]
          order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          year?: string
          title?: string
          content?: Json | null
          images?: string[]
          order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      gallery_items: {
        Row: {
          id: string
          title: string
          number: string
          image: string
          tags: string[] | null
          description: string | null
          detailed_description: string | null
          link: string | null
          order: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          number: string
          image: string
          tags?: string[] | null
          description?: string | null
          detailed_description?: string | null
          link?: string | null
          order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          number?: string
          image?: string
          tags?: string[] | null
          description?: string | null
          detailed_description?: string | null
          link?: string | null
          order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          subject: string | null
          message: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject?: string | null
          message: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string | null
          message?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}


