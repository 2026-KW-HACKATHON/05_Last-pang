
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "coupons": {
                  Row: {
                    "created_at": string,"deal_id": string,"expires_at": string,"id": string,"issued_at": string,"status": string,"used_at": string | null,"user_id": string
                  }
                  Insert: {
                    "created_at"?: string,"deal_id": string,"expires_at": string,"id"?: string,"issued_at"?: string,"status"?: string,"used_at"?: string | null,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"deal_id"?: string,"expires_at"?: string,"id"?: string,"issued_at"?: string,"status"?: string,"used_at"?: string | null,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "coupons_deal_id_fkey"
      columns: ["deal_id"]
isOneToOne: false
      referencedRelation: "deals"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "coupons_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"deal_events": {
                  Row: {
                    "created_at": string,"deal_id": string,"id": number,"type": string,"user_id": string | null
                  }
                  Insert: {
                    "created_at"?: string,"deal_id": string,"id"?: never,"type": string,"user_id"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"deal_id"?: string,"id"?: never,"type"?: string,"user_id"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "deal_events_deal_id_fkey"
      columns: ["deal_id"]
isOneToOne: false
      referencedRelation: "deals"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "deal_events_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"deal_rules": {
                  Row: {
                    "coupon_ttl_min": number,"created_at": string,"deal_price": number,"end_time": string,"id": string,"is_active": boolean,"original_price": number,"qty": number,"repeat_days": (number)[],"start_time": string,"store_id": string,"title": string
                  }
                  Insert: {
                    "coupon_ttl_min"?: number,"created_at"?: string,"deal_price": number,"end_time": string,"id"?: string,"is_active"?: boolean,"original_price": number,"qty": number,"repeat_days": (number)[],"start_time": string,"store_id": string,"title": string
                  }
                  Update: {
                    "coupon_ttl_min"?: number,"created_at"?: string,"deal_price"?: number,"end_time"?: string,"id"?: string,"is_active"?: boolean,"original_price"?: number,"qty"?: number,"repeat_days"?: (number)[],"start_time"?: string,"store_id"?: string,"title"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "deal_rules_store_id_fkey"
      columns: ["store_id"]
isOneToOne: false
      referencedRelation: "stores"
      referencedColumns: ["id"]
    }
                  ]
                },"deals": {
                  Row: {
                    "coupon_ttl_min": number,"created_at": string,"deal_price": number,"ends_at": string,"id": string,"original_price": number,"remaining_qty": number,"rule_id": string | null,"starts_at": string,"status": string,"store_id": string,"title": string,"total_qty": number,"type": string
                  }
                  Insert: {
                    "coupon_ttl_min"?: number,"created_at"?: string,"deal_price": number,"ends_at": string,"id"?: string,"original_price": number,"remaining_qty": number,"rule_id"?: string | null,"starts_at": string,"status"?: string,"store_id": string,"title": string,"total_qty": number,"type": string
                  }
                  Update: {
                    "coupon_ttl_min"?: number,"created_at"?: string,"deal_price"?: number,"ends_at"?: string,"id"?: string,"original_price"?: number,"remaining_qty"?: number,"rule_id"?: string | null,"starts_at"?: string,"status"?: string,"store_id"?: string,"title"?: string,"total_qty"?: number,"type"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "deals_rule_id_fkey"
      columns: ["rule_id"]
isOneToOne: false
      referencedRelation: "deal_rules"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "deals_store_id_fkey"
      columns: ["store_id"]
isOneToOne: false
      referencedRelation: "stores"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "agreed_location_at": string | null,"agreed_push_at": string | null,"agreed_terms_at": string | null,"created_at": string,"id": string,"nickname": string | null,"role": string
                  }
                  Insert: {
                    "agreed_location_at"?: string | null,"agreed_push_at"?: string | null,"agreed_terms_at"?: string | null,"created_at"?: string,"id": string,"nickname"?: string | null,"role"?: string
                  }
                  Update: {
                    "agreed_location_at"?: string | null,"agreed_push_at"?: string | null,"agreed_terms_at"?: string | null,"created_at"?: string,"id"?: string,"nickname"?: string | null,"role"?: string
                  }
                  Relationships: [
                    
                  ]
                },"push_queue": {
                  Row: {
                    "created_at": string,"deal_id": string,"id": number,"reason": string,"sent_at": string | null,"status": string,"user_id": string
                  }
                  Insert: {
                    "created_at"?: string,"deal_id": string,"id"?: never,"reason": string,"sent_at"?: string | null,"status"?: string,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"deal_id"?: string,"id"?: never,"reason"?: string,"sent_at"?: string | null,"status"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "push_queue_deal_id_fkey"
      columns: ["deal_id"]
isOneToOne: false
      referencedRelation: "deals"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "push_queue_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"push_subscriptions": {
                  Row: {
                    "auth": string,"created_at": string,"endpoint": string,"id": string,"p256dh": string,"updated_at": string,"user_id": string
                  }
                  Insert: {
                    "auth": string,"created_at"?: string,"endpoint": string,"id"?: string,"p256dh": string,"updated_at"?: string,"user_id": string
                  }
                  Update: {
                    "auth"?: string,"created_at"?: string,"endpoint"?: string,"id"?: string,"p256dh"?: string,"updated_at"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "push_subscriptions_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"redemption_attempts": {
                  Row: {
                    "coupon_id": string | null,"created_at": string,"id": number,"store_id": string,"success": boolean,"user_id": string
                  }
                  Insert: {
                    "coupon_id"?: string | null,"created_at"?: string,"id"?: never,"store_id": string,"success": boolean,"user_id": string
                  }
                  Update: {
                    "coupon_id"?: string | null,"created_at"?: string,"id"?: never,"store_id"?: string,"success"?: boolean,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "redemption_attempts_coupon_id_fkey"
      columns: ["coupon_id"]
isOneToOne: false
      referencedRelation: "coupons"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "redemption_attempts_store_id_fkey"
      columns: ["store_id"]
isOneToOne: false
      referencedRelation: "stores"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "redemption_attempts_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"resident_preferences": {
                  Row: {
                    "active_days": (number)[],"base_lat": number | null,"base_lng": number | null,"categories": (string)[],"radius_m": number,"time_slots": (string)[],"updated_at": string,"user_id": string
                  }
                  Insert: {
                    "active_days"?: (number)[],"base_lat"?: number | null,"base_lng"?: number | null,"categories"?: (string)[],"radius_m"?: number,"time_slots"?: (string)[],"updated_at"?: string,"user_id": string
                  }
                  Update: {
                    "active_days"?: (number)[],"base_lat"?: number | null,"base_lng"?: number | null,"categories"?: (string)[],"radius_m"?: number,"time_slots"?: (string)[],"updated_at"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "resident_preferences_user_id_fkey"
      columns: ["user_id"]
isOneToOne: true
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"schedules": {
                  Row: {
                    "at_time": string | null,"created_at": string,"days": (number)[],"end_time": string | null,"id": string,"name": string,"start_time": string | null,"trigger_type": string,"user_id": string
                  }
                  Insert: {
                    "at_time"?: string | null,"created_at"?: string,"days": (number)[],"end_time"?: string | null,"id"?: string,"name": string,"start_time"?: string | null,"trigger_type": string,"user_id": string
                  }
                  Update: {
                    "at_time"?: string | null,"created_at"?: string,"days"?: (number)[],"end_time"?: string | null,"id"?: string,"name"?: string,"start_time"?: string | null,"trigger_type"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "schedules_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"store_secrets": {
                  Row: {
                    "code_rotated_at": string,"code_version": number,"redeem_code_hash": string,"store_id": string
                  }
                  Insert: {
                    "code_rotated_at"?: string,"code_version"?: number,"redeem_code_hash": string,"store_id": string
                  }
                  Update: {
                    "code_rotated_at"?: string,"code_version"?: number,"redeem_code_hash"?: string,"store_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "store_secrets_store_id_fkey"
      columns: ["store_id"]
isOneToOne: true
      referencedRelation: "stores"
      referencedColumns: ["id"]
    }
                  ]
                },"stores": {
                  Row: {
                    "address": string,"category": string,"created_at": string,"id": string,"lat": number,"lng": number,"name": string,"owner_id": string,"reject_reason": string | null,"status": string
                  }
                  Insert: {
                    "address": string,"category": string,"created_at"?: string,"id"?: string,"lat": number,"lng": number,"name": string,"owner_id": string,"reject_reason"?: string | null,"status"?: string
                  }
                  Update: {
                    "address"?: string,"category"?: string,"created_at"?: string,"id"?: string,"lat"?: number,"lng"?: number,"name"?: string,"owner_id"?: string,"reject_reason"?: string | null,"status"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "stores_owner_id_fkey"
      columns: ["owner_id"]
isOneToOne: true
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "approve_store":
{ Args: { "p_approve": boolean,"p_reject_reason"?: string,"p_store_id": string }; Returns: Json
                           },
"claim_coupon":
{ Args: { "p_deal_id": string }; Returns: Json
                           },
"expire_coupons":
{ Args: Record<PropertyKey, never>; Returns: undefined
                           },
"generate_redeem_code":
{ Args: Record<PropertyKey, never>; Returns: string
                           },
"is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"my_approved_store_id":
{ Args: Record<PropertyKey, never>; Returns: string
                           },
"redeem_coupon":
{ Args: { "p_code": string,"p_coupon_id": string }; Returns: Json
                           },
"register_store":
{ Args: { "p_address": string,"p_category": string,"p_lat": number,"p_lng": number,"p_name": string }; Returns: Json
                           },
"rotate_store_code":
{ Args: Record<PropertyKey, never>; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            
          }
        }
} as const
