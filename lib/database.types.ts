export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          vehicle_id: string | null;
          vehicle_label: string | null;
          status: "novo" | "contato" | "em_negociacao" | "proposta" | "fechado" | "perdido";
          source: "whatsapp" | "site" | "indicacao" | "instagram" | "outro" | "avaliacao" | "consignacao" | "financiamento";
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
          status?: "novo" | "contato" | "em_negociacao" | "proposta" | "fechado" | "perdido";
          source?: "whatsapp" | "site" | "indicacao" | "instagram" | "outro" | "avaliacao" | "consignacao" | "financiamento";
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
          status?: "novo" | "contato" | "em_negociacao" | "proposta" | "fechado" | "perdido";
          source?: "whatsapp" | "site" | "indicacao" | "instagram" | "outro" | "avaliacao" | "consignacao" | "financiamento";
          notes?: string | null;
          updated_at?: string;
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

export type VehicleRow = Database["public"]["Tables"]["vehicles"]["Row"];
export type VehicleImageRow = Database["public"]["Tables"]["vehicle_images"]["Row"];
export type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
