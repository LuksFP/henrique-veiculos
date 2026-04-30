export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string;
          email: string;
          is_admin: boolean;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          is_admin?: boolean;
          user_id: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          is_admin?: boolean;
          user_id?: string;
        };
        Relationships: [];
      };
      vehicles: {
        Row: {
          bg: string | null;
          color: string | null;
          created_at: string;
          fuel: string;
          id: string;
          image_path: string | null;
          image_url: string | null;
          is_available: boolean;
          is_featured: boolean;
          km: string | null;
          make: string;
          model: string;
          options: string[];
          price: string;
          sort_order: number;
          transmission: string;
          updated_at: string;
          year: number;
        };
        Insert: {
          bg?: string | null;
          color?: string | null;
          created_at?: string;
          fuel: string;
          id?: string;
          image_path?: string | null;
          image_url?: string | null;
          is_available?: boolean;
          is_featured?: boolean;
          km?: string | null;
          make: string;
          model: string;
          options?: string[];
          price: string;
          sort_order?: number;
          transmission: string;
          updated_at?: string;
          year: number;
        };
        Update: {
          bg?: string | null;
          color?: string | null;
          created_at?: string;
          fuel?: string;
          id?: string;
          image_path?: string | null;
          image_url?: string | null;
          is_available?: boolean;
          is_featured?: boolean;
          km?: string | null;
          make?: string;
          model?: string;
          options?: string[];
          price?: string;
          sort_order?: number;
          transmission?: string;
          updated_at?: string;
          year?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type VehicleRow = Database["public"]["Tables"]["vehicles"]["Row"];
