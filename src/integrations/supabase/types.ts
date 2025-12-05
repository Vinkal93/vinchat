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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          bot_id: string
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          session_id: string | null
          visitor_info: Json | null
        }
        Insert: {
          bot_id: string
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          session_id?: string | null
          visitor_info?: Json | null
        }
        Update: {
          bot_id?: string
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          session_id?: string | null
          visitor_info?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string | null
          id: string
          key_hash: string
          last_used_at: string | null
          name: string
          provider: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key_hash: string
          last_used_at?: string | null
          name: string
          provider: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key_hash?: string
          last_used_at?: string | null
          name?: string
          provider?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_templates: {
        Row: {
          category: string
          created_at: string | null
          default_settings: Json | null
          description: string | null
          icon: string | null
          id: string
          is_featured: boolean | null
          name: string
          suggested_questions: string[] | null
          system_prompt: string
          welcome_message: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          default_settings?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          is_featured?: boolean | null
          name: string
          suggested_questions?: string[] | null
          system_prompt: string
          welcome_message?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          default_settings?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          is_featured?: boolean | null
          name?: string
          suggested_questions?: string[] | null
          system_prompt?: string
          welcome_message?: string | null
        }
        Relationships: []
      }
      bots: {
        Row: {
          allowed_topics: string[] | null
          blocked_keywords: string[] | null
          business_only: boolean | null
          created_at: string | null
          description: string | null
          id: string
          max_tokens: number | null
          model: string | null
          name: string
          status: Database["public"]["Enums"]["bot_status"] | null
          system_prompt: string | null
          temperature: number | null
          total_conversations: number | null
          total_messages: number | null
          updated_at: string | null
          welcome_message: string | null
          widget_avatar_url: string | null
          widget_color: string | null
          widget_position: string | null
          widget_title: string | null
          workspace_id: string
        }
        Insert: {
          allowed_topics?: string[] | null
          blocked_keywords?: string[] | null
          business_only?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          max_tokens?: number | null
          model?: string | null
          name: string
          status?: Database["public"]["Enums"]["bot_status"] | null
          system_prompt?: string | null
          temperature?: number | null
          total_conversations?: number | null
          total_messages?: number | null
          updated_at?: string | null
          welcome_message?: string | null
          widget_avatar_url?: string | null
          widget_color?: string | null
          widget_position?: string | null
          widget_title?: string | null
          workspace_id: string
        }
        Update: {
          allowed_topics?: string[] | null
          blocked_keywords?: string[] | null
          business_only?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          max_tokens?: number | null
          model?: string | null
          name?: string
          status?: Database["public"]["Enums"]["bot_status"] | null
          system_prompt?: string | null
          temperature?: number | null
          total_conversations?: number | null
          total_messages?: number | null
          updated_at?: string | null
          welcome_message?: string | null
          widget_avatar_url?: string | null
          widget_color?: string | null
          widget_position?: string | null
          widget_title?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bots_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          bot_id: string
          ended_at: string | null
          id: string
          message_count: number | null
          session_id: string
          started_at: string | null
          visitor_info: Json | null
        }
        Insert: {
          bot_id: string
          ended_at?: string | null
          id?: string
          message_count?: number | null
          session_id: string
          started_at?: string | null
          visitor_info?: Json | null
        }
        Update: {
          bot_id?: string
          ended_at?: string | null
          id?: string
          message_count?: number | null
          session_id?: string
          started_at?: string | null
          visitor_info?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base: {
        Row: {
          bot_id: string
          chunks_count: number | null
          content: string | null
          created_at: string | null
          file_path: string | null
          file_size: number | null
          id: string
          is_processed: boolean | null
          metadata: Json | null
          source_type: Database["public"]["Enums"]["knowledge_source_type"]
          title: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          bot_id: string
          chunks_count?: number | null
          content?: string | null
          created_at?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_processed?: boolean | null
          metadata?: Json | null
          source_type: Database["public"]["Enums"]["knowledge_source_type"]
          title: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          bot_id?: string
          chunks_count?: number | null
          content?: string | null
          created_at?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_processed?: boolean | null
          metadata?: Json | null
          source_type?: Database["public"]["Enums"]["knowledge_source_type"]
          title?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_base_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          role: string
          sources: Json | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          role: string
          sources?: Json | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          role?: string
          sources?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workspaces: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner_id: string
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          owner_id: string
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner_id?: string
          settings?: Json | null
          updated_at?: string | null
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
      app_role: "admin" | "user"
      bot_status: "active" | "inactive" | "draft"
      knowledge_source_type: "file" | "url" | "text" | "api"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "user"],
      bot_status: ["active", "inactive", "draft"],
      knowledge_source_type: ["file", "url", "text", "api"],
    },
  },
} as const
