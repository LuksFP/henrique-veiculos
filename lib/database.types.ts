export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: string;
          description: string;
          amount: number;
          category: "aluguel" | "folha" | "manutencao" | "marketing" | "outros";
          expense_date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          description: string;
          amount: number;
          category?: "aluguel" | "folha" | "manutencao" | "marketing" | "outros";
          expense_date?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          description?: string;
          amount?: number;
          category?: "aluguel" | "folha" | "manutencao" | "marketing" | "outros";
          expense_date?: string;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
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
      leads: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          vehicle_id: string | null;
          vehicle_label: string | null;
          status: "novo" | "contato" | "proposta" | "fechado" | "perdido";
          source: "whatsapp" | "site" | "indicacao" | "instagram" | "outro";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          vehicle_id?: string | null;
          vehicle_label?: string | null;
          status?: "novo" | "contato" | "proposta" | "fechado" | "perdido";
          source?: "whatsapp" | "site" | "indicacao" | "instagram" | "outro";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string | null;
          vehicle_id?: string | null;
          vehicle_label?: string | null;
          status?: "novo" | "contato" | "proposta" | "fechado" | "perdido";
          source?: "whatsapp" | "site" | "indicacao" | "instagram" | "outro";
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      sales: {
        Row: {
          id: string;
          vehicle_id: string | null;
          make: string;
          model: string;
          year: number;
          lead_id: string | null;
          client_name: string;
          sale_price: number;
          cost_price: number;
          commission: number;
          payment_method: "a_vista" | "financiado" | "consorcio" | "troca";
          sale_date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id?: string | null;
          make: string;
          model: string;
          year: number;
          lead_id?: string | null;
          client_name?: string;
          sale_price: number;
          cost_price?: number;
          commission?: number;
          payment_method?: "a_vista" | "financiado" | "consorcio" | "troca";
          sale_date?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          vehicle_id?: string | null;
          make?: string;
          model?: string;
          year?: number;
          lead_id?: string | null;
          client_name?: string;
          sale_price?: number;
          cost_price?: number;
          commission?: number;
          payment_method?: "a_vista" | "financiado" | "consorcio" | "troca";
          sale_date?: string;
          notes?: string | null;
        };
        Relationships: [];
      };
      vehicle_images: {
        Row: {
          id: string;
          vehicle_id: string;
          url: string;
          path: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          url: string;
          path: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          url?: string;
          path?: string;
          sort_order?: number;
          created_at?: string;
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

export type ExpenseRow = Database["public"]["Tables"]["expenses"]["Row"];
export type VehicleRow = Database["public"]["Tables"]["vehicles"]["Row"];
export type VehicleImageRow = Database["public"]["Tables"]["vehicle_images"]["Row"];
export type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
export type SaleRow = Database["public"]["Tables"]["sales"]["Row"];
