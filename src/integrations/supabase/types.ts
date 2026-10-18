export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          accepted_rules: boolean
          agreed_price: number
          created_at: string
          document_paths: string[]
          full_name: string
          id: string
          notes: string
          phone: string
          status: string
          tour_id: string
          tourist_id: string
        }
        Insert: {
          accepted_rules: boolean
          agreed_price: number
          created_at?: string
          document_paths?: string[]
          full_name: string
          id?: string
          notes?: string
          phone: string
          status?: string
          tour_id: string
          tourist_id: string
        }
        Update: {
          accepted_rules?: boolean
          agreed_price?: number
          created_at?: string
          document_paths?: string[]
          full_name?: string
          id?: string
          notes?: string
          phone?: string
          status?: string
          tour_id?: string
          tourist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_tourist_id_fkey"
            columns: ["tourist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          tour_id: string
          tourist_id: string
        }
        Insert: {
          tour_id: string
          tourist_id: string
        }
        Update: {
          tour_id?: string
          tourist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_tourist_id_fkey"
            columns: ["tourist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leader_media: {
        Row: {
          caption: string
          created_at: string
          id: string
          kind: string
          leader_id: string
          path: string
          tour_id: string | null
          visible: boolean
        }
        Insert: {
          caption?: string
          created_at?: string
          id?: string
          kind: string
          leader_id: string
          path: string
          tour_id?: string | null
          visible?: boolean
        }
        Update: {
          caption?: string
          created_at?: string
          id?: string
          kind?: string
          leader_id?: string
          path?: string
          tour_id?: string | null
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "leader_media_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "leader_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "leader_media_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      leader_profiles: {
        Row: {
          bio: string
          created_at: string
          display_name: string
          status: string
          user_id: string
        }
        Insert: {
          bio?: string
          created_at?: string
          display_name?: string
          status?: string
          user_id: string
        }
        Update: {
          bio?: string
          created_at?: string
          display_name?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leader_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
          phone: string
        }
        Insert: {
          created_at?: string
          display_name?: string
          id: string
          phone?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          phone?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string
          created_at: string
          id: string
          leader_id: string
          rating: number
          tourist_id: string
        }
        Insert: {
          booking_id: string
          comment?: string
          created_at?: string
          id?: string
          leader_id: string
          rating: number
          tourist_id: string
        }
        Update: {
          booking_id?: string
          comment?: string
          created_at?: string
          id?: string
          leader_id?: string
          rating?: number
          tourist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "leader_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "reviews_tourist_id_fkey"
            columns: ["tourist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          capacity: number
          category: string
          created_at: string
          description: string
          destination: string
          ends_at: string
          id: string
          leader_id: string
          price: number
          published: boolean
          required_documents: string
          rules: string
          starts_at: string
          title: string
        }
        Insert: {
          capacity: number
          category?: string
          created_at?: string
          description?: string
          destination: string
          ends_at: string
          id?: string
          leader_id: string
          price: number
          published?: boolean
          required_documents?: string
          rules?: string
          starts_at: string
          title: string
        }
        Update: {
          capacity?: number
          category?: string
          created_at?: string
          description?: string
          destination?: string
          ends_at?: string
          id?: string
          leader_id?: string
          price?: number
          published?: boolean
          required_documents?: string
          rules?: string
          starts_at?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tours_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "leader_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_as_leader: { Args: never; Returns: undefined }
      decide_booking: {
        Args: { decision: string; request_id: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_trip_customer: { Args: { trip: string }; Returns: boolean }
      rate_trip: {
        Args: { message: string; request_id: string; stars: number }
        Returns: undefined
      }
      request_booking: {
        Args: {
          accept_rules: boolean
          contact: string
          documents: string[]
          passenger_name: string
          remarks: string
          trip: string
        }
        Returns: string
      }
      review_leader: {
        Args: { decision: string; target: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "tourist" | "leader" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["tourist", "leader", "admin"],
    },
  },
} as const
