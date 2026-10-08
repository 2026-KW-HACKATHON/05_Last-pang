
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
    "council_report_summaries": {
      Row: { "ai_text": string | null, "edited_text": string | null, "generated_at": string, "month": string, "reviewed_at": string | null, "reviewed_by": string | null, "sent_at": string | null, "source": string, "status": string }
      Insert: { "ai_text"?: string | null, "edited_text"?: string | null, "generated_at"?: string, "month": string, "reviewed_at"?: string | null, "reviewed_by"?: string | null, "sent_at"?: string | null, "source"?: string, "status"?: string }
      Update: { "ai_text"?: string | null, "edited_text"?: string | null, "generated_at"?: string, "month"?: string, "reviewed_at"?: string | null, "reviewed_by"?: string | null, "sent_at"?: string | null, "source"?: string, "status"?: string }
      Relationships: [{ foreignKeyName: "council_report_summaries_reviewed_by_fkey", columns: ["reviewed_by"], isOneToOne: false, referencedRelation: "profiles", referencedColumns: ["id"] }]
    }
    "coupons": {
      Row: { "created_at": string, "deal_id": string, "expires_at": string, "id": string, "issued_at": string, "status": string, "used_at": string | null, "user_id": string }
      Insert: { "created_at"?: string, "deal_id": string, "expires_at": string, "id"?: string, "issued_at"?: string, "status"?: string, "used_at"?: string | null, "user_id": string }
      Update: { "created_at"?: string, "deal_id"?: string, "expires_at"?: string, "id"?: string, "issued_at"?: string, "status"?: string, "used_at"?: string | null, "user_id"?: string }
      Relationships: [{ foreignKeyName: "coupons_deal_id_fkey", columns: ["deal_id"], isOneToOne: false, referencedRelation: "deals", referencedColumns: ["id"] }, { foreignKeyName: "coupons_user_id_fkey", columns: ["user_id"], isOneToOne: false, referencedRelation: "profiles", referencedColumns: ["id"] }]
    }
    "deal_events": {
      Row: { "created_at": string, "deal_id": string, "id": number, "type": string, "user_id": string | null }
      Insert: { "created_at"?: string, "deal_id": string, "id"?: never, "type": string, "user_id"?: string | null }
      Update: { "created_at"?: string, "deal_id"?: string, "id"?: never, "type"?: string, "user_id"?: string | null }
      Relationships: [{ foreignKeyName: "deal_events_deal_id_fkey", columns: ["deal_id"], isOneToOne: false, referencedRelation: "deals", referencedColumns: ["id"] }, { foreignKeyName: "deal_events_user_id_fkey", columns: ["user_id"], isOneToOne: false, referencedRelation: "profiles", referencedColumns: ["id"] }]
    }
    "deal_reports": {
      Row: { "created_at": string, "deal_id": string, "detail": string | null, "id": string, "reason": string, "reporter_id": string | null, "resolved_at": string | null, "resolved_by": string | null, "status": string, "store_id": string }
      Insert: { "created_at"?: string, "deal_id": string, "detail"?: string | null, "id"?: string, "reason": string, "reporter_id"?: string | null, "resolved_at"?: string | null, "resolved_by"?: string | null, "status"?: string, "store_id": string }
      Update: { "created_at"?: string, "deal_id"?: string, "detail"?: string | null, "id"?: string, "reason"?: string, "reporter_id"?: string | null, "resolved_at"?: string | null, "resolved_by"?: string | null, "status"?: string, "store_id"?: string }
      Relationships: [{ foreignKeyName: "deal_reports_deal_id_fkey", columns: ["deal_id"], isOneToOne: false, referencedRelation: "deals", referencedColumns: ["id"] }, { foreignKeyName: "deal_reports_reporter_id_fkey", columns: ["reporter_id"], isOneToOne: false, referencedRelation: "profiles", referencedColumns: ["id"] }, { foreignKeyName: "deal_reports_resolved_by_fkey", columns: ["resolved_by"], isOneToOne: false, referencedRelation: "profiles", referencedColumns: ["id"] }, { foreignKeyName: "deal_reports_store_id_fkey", columns: ["store_id"], isOneToOne: false, referencedRelation: "stores", referencedColumns: ["id"] }]
    }
    "deal_rules": {
      Row: { "coupon_ttl_min": number, "created_at": string, "deal_price": number, "end_time": string, "id": string, "is_active": boolean, "original_price": number, "qty": number, "repeat_days": number[], "start_time": string, "store_id": string, "title": string }
      Insert: { "coupon_ttl_min"?: number, "created_at"?: string, "deal_price": number, "end_time": string, "id"?: string, "is_active"?: boolean, "original_price": number, "qty": number, "repeat_days": number[], "start_time": string, "store_id": string, "title": string }
      Update: { "coupon_ttl_min"?: number, "created_at"?: string, "deal_price"?: number, "end_time"?: string, "id"?: string, "is_active"?: boolean, "original_price"?: number, "qty"?: number, "repeat_days"?: number[], "start_time"?: string, "store_id"?: string, "title"?: string }
      Relationships: [{ foreignKeyName: "deal_rules_store_id_fkey", columns: ["store_id"], isOneToOne: false, referencedRelation: "stores", referencedColumns: ["id"] }]
    }
    "deals": {
      Row: { "close_reason": string | null, "closed_at": string | null, "coupon_ttl_min": number, "created_at": string, "created_by": string | null, "deal_price": number, "ends_at": string, "id": string, "original_price": number, "paused_at": string | null, "remaining_qty": number, "rule_id": string | null, "sold_out_at": string | null, "starts_at": string, "status": string, "store_id": string, "title": string, "total_qty": number, "type": string }
      Insert: { "close_reason"?: string | null, "closed_at"?: string | null, "coupon_ttl_min"?: number, "created_at"?: string, "created_by"?: string | null, "deal_price": number, "ends_at": string, "id"?: string, "original_price": number, "paused_at"?: string | null, "remaining_qty": number, "rule_id"?: string | null, "sold_out_at"?: string | null, "starts_at": string, "status"?: string, "store_id": string, "title": string, "total_qty": number, "type": string }
      Update: { "close_reason"?: string | null, "closed_at"?: string | null, "coupon_ttl_min"?: number, "created_at"?: string, "created_by"?: string | null, "deal_price"?: number, "ends_at"?: string, "id"?: string, "original_price"?: number, "paused_at"?: string | null, "remaining_qty"?: number, "rule_id"?: string | null, "sold_out_at"?: string | null, "starts_at"?: string, "status"?: string, "store_id"?: string, "title"?: string, "total_qty"?: number, "type"?: string }
      Relationships: [{ foreignKeyName: "deals_created_by_fkey", columns: ["created_by"], isOneToOne: false, referencedRelation: "profiles", referencedColumns: ["id"] }, { foreignKeyName: "deals_rule_id_fkey", columns: ["rule_id"], isOneToOne: false, referencedRelation: "deal_rules", referencedColumns: ["id"] }, { foreignKeyName: "deals_store_id_fkey", columns: ["store_id"], isOneToOne: false, referencedRelation: "stores", referencedColumns: ["id"] }]
    }
    "notification_settings": {
      Row: { "deal_alerts": boolean, "notices": boolean, "quiet_enabled": boolean, "quiet_end": string, "quiet_start": string, "start_alerts": boolean, "updated_at": string, "use_location": boolean, "user_id": string }
      Insert: { "deal_alerts"?: boolean, "notices"?: boolean, "quiet_enabled"?: boolean, "quiet_end"?: string, "quiet_start"?: string, "start_alerts"?: boolean, "updated_at"?: string, "use_location"?: boolean, "user_id": string }
      Update: { "deal_alerts"?: boolean, "notices"?: boolean, "quiet_enabled"?: boolean, "quiet_end"?: string, "quiet_start"?: string, "start_alerts"?: boolean, "updated_at"?: string, "use_location"?: boolean, "user_id"?: string }
      Relationships: [{ foreignKeyName: "notification_settings_user_id_fkey", columns: ["user_id"], isOneToOne: true, referencedRelation: "profiles", referencedColumns: ["id"] }]
    }
    "notifications": {
      Row: { "audience": string, "body": string | null, "created_at": string, "deal_id": string | null, "id": number, "kind": string, "link": string | null, "read_at": string | null, "store_id": string | null, "title": string, "user_id": string }
      Insert: { "audience": string, "body"?: string | null, "created_at"?: string, "deal_id"?: string | null, "id"?: never, "kind": string, "link"?: string | null, "read_at"?: string | null, "store_id"?: string | null, "title": string, "user_id": string }
      Update: { "audience"?: string, "body"?: string | null, "created_at"?: string, "deal_id"?: string | null, "id"?: never, "kind"?: string, "link"?: string | null, "read_at"?: string | null, "store_id"?: string | null, "title"?: string, "user_id"?: string }
      Relationships: [{ foreignKeyName: "notifications_deal_id_fkey", columns: ["deal_id"], isOneToOne: false, referencedRelation: "deals", referencedColumns: ["id"] }, { foreignKeyName: "notifications_store_id_fkey", columns: ["store_id"], isOneToOne: false, referencedRelation: "stores", referencedColumns: ["id"] }, { foreignKeyName: "notifications_user_id_fkey", columns: ["user_id"], isOneToOne: false, referencedRelation: "profiles", referencedColumns: ["id"] }]
    }
    "profiles": {
      Row: { "agreed_location_at": string | null, "agreed_push_at": string | null, "agreed_terms_at": string | null, "created_at": string, "id": string, "nickname": string | null, "owner_marketing_agreed_at": string | null, "owner_terms_agreed_at": string | null, "role": string }
      Insert: { "agreed_location_at"?: string | null, "agreed_push_at"?: string | null, "agreed_terms_at"?: string | null, "created_at"?: string, "id": string, "nickname"?: string | null, "owner_marketing_agreed_at"?: string | null, "owner_terms_agreed_at"?: string | null, "role"?: string }
      Update: { "agreed_location_at"?: string | null, "agreed_push_at"?: string | null, "agreed_terms_at"?: string | null, "created_at"?: string, "id"?: string, "nickname"?: string | null, "owner_marketing_agreed_at"?: string | null, "owner_terms_agreed_at"?: string | null, "role"?: string }
      Relationships: [{ foreignKeyName: "profiles_id_fkey", columns: ["id"], isOneToOne: true, referencedRelation: "users", referencedColumns: ["id"] }]
    }
    "push_queue": {
      Row: { "body": string | null, "created_at": string, "deal_id": string, "id": number, "reason": string, "sent_at": string | null, "status": string, "user_id": string }
      Insert: { "body"?: string | null, "created_at"?: string, "deal_id": string, "id"?: never, "reason": string, "sent_at"?: string | null, "status"?: string, "user_id": string }
      Update: { "body"?: string | null, "created_at"?: string, "deal_id"?: string, "id"?: never, "reason"?: string, "sent_at"?: string | null, "status"?: string, "user_id"?: string }
      Relationships: [{ foreignKeyName: "push_queue_deal_id_fkey", columns: ["deal_id"], isOneToOne: false, referencedRelation: "deals", referencedColumns: ["id"] }, { foreignKeyName: "push_queue_user_id_fkey", columns: ["user_id"], isOneToOne: false, referencedRelation: "profiles", referencedColumns: ["id"] }]
    }
    "push_subscriptions": {
      Row: { "auth": string, "created_at": string, "endpoint": string, "id": string, "p256dh": string, "updated_at": string, "user_id": string }
      Insert: { "auth": string, "created_at"?: string, "endpoint": string, "id"?: string, "p256dh": string, "updated_at"?: string, "user_id": string }
      Update: { "auth"?: string, "created_at"?: string, "endpoint"?: string, "id"?: string, "p256dh"?: string, "updated_at"?: string, "user_id"?: string }
      Relationships: [{ foreignKeyName: "push_subscriptions_user_id_fkey", columns: ["user_id"], isOneToOne: false, referencedRelation: "profiles", referencedColumns: ["id"] }]
    }
    "redemption_attempts": {
      Row: { "coupon_id": string | null, "created_at": string, "id": number, "store_id": string, "success": boolean, "user_id": string }
      Insert: { "coupon_id"?: string | null, "created_at"?: string, "id"?: never, "store_id": string, "success": boolean, "user_id": string }
      Update: { "coupon_id"?: string | null, "created_at"?: string, "id"?: never, "store_id"?: string, "success"?: boolean, "user_id"?: string }
      Relationships: [{ foreignKeyName: "redemption_attempts_coupon_id_fkey", columns: ["coupon_id"], isOneToOne: false, referencedRelation: "coupons", referencedColumns: ["id"] }, { foreignKeyName: "redemption_attempts_store_id_fkey", columns: ["store_id"], isOneToOne: false, referencedRelation: "stores", referencedColumns: ["id"] }, { foreignKeyName: "redemption_attempts_user_id_fkey", columns: ["user_id"], isOneToOne: false, referencedRelation: "profiles", referencedColumns: ["id"] }]
    }
    "resident_preferences": {
      Row: { "active_days": number[], "alert_dinner": boolean, "alert_lunch": boolean, "alert_morning": boolean, "base_lat": number | null, "base_lng": number | null, "categories": string[], "first_outing_lead_min": number, "radius_m": number, "time_slots": string[], "updated_at": string, "user_id": string }
      Insert: { "active_days"?: number[], "alert_dinner"?: boolean, "alert_lunch"?: boolean, "alert_morning"?: boolean, "base_lat"?: number | null, "base_lng"?: number | null, "categories"?: string[], "first_outing_lead_min"?: number, "radius_m"?: number, "time_slots"?: string[], "updated_at"?: string, "user_id": string }
      Update: { "active_days"?: number[], "alert_dinner"?: boolean, "alert_lunch"?: boolean, "alert_morning"?: boolean, "base_lat"?: number | null, "base_lng"?: number | null, "categories"?: string[], "first_outing_lead_min"?: number, "radius_m"?: number, "time_slots"?: string[], "updated_at"?: string, "user_id"?: string }
      Relationships: [{ foreignKeyName: "resident_preferences_user_id_fkey", columns: ["user_id"], isOneToOne: true, referencedRelation: "profiles", referencedColumns: ["id"] }]
    }
    "schedules": {
      Row: { "color": string, "created_at": string, "days": number[], "end_time": string, "id": string, "kind": string | null, "name": string, "start_time": string, "user_id": string }
      Insert: { "color"?: string, "created_at"?: string, "days": number[], "end_time": string, "id"?: string, "kind"?: string | null, "name": string, "start_time": string, "user_id": string }
      Update: { "color"?: string, "created_at"?: string, "days"?: number[], "end_time"?: string, "id"?: string, "kind"?: string | null, "name"?: string, "start_time"?: string, "user_id"?: string }
      Relationships: [{ foreignKeyName: "schedules_user_id_fkey", columns: ["user_id"], isOneToOne: false, referencedRelation: "profiles", referencedColumns: ["id"] }]
    }
    "store_secrets": {
      Row: { "code_issued_at": string | null, "code_rotated_at": string, "code_version": number, "redeem_code_hash": string | null, "store_id": string }
      Insert: { "code_issued_at"?: string | null, "code_rotated_at"?: string, "code_version"?: number, "redeem_code_hash"?: string | null, "store_id": string }
      Update: { "code_issued_at"?: string | null, "code_rotated_at"?: string, "code_version"?: number, "redeem_code_hash"?: string | null, "store_id"?: string }
      Relationships: [{ foreignKeyName: "store_secrets_store_id_fkey", columns: ["store_id"], isOneToOne: true, referencedRelation: "stores", referencedColumns: ["id"] }]
    }
    "stores": {
      Row: { "address": string, "address_requested_at": string | null, "approved_at": string | null, "business_no": string | null, "category": string, "created_at": string, "created_by_admin": boolean, "description": string | null, "id": string, "lat": number, "license_path": string | null, "link_code_hash": string | null, "lng": number, "name": string, "owner_id": string | null, "pending_address": string | null, "pending_lat": number | null, "pending_lng": number | null, "phone": string | null, "reject_code": string | null, "reject_reason": string | null, "representative_name": string | null, "reviewed_at": string | null, "status": string, "submitted_at": string, "suspend_code": string | null, "suspend_note": string | null, "suspended_at": string | null }
      Insert: { "address": string, "address_requested_at"?: string | null, "approved_at"?: string | null, "business_no"?: string | null, "category": string, "created_at"?: string, "created_by_admin"?: boolean, "description"?: string | null, "id"?: string, "lat": number, "license_path"?: string | null, "link_code_hash"?: string | null, "lng": number, "name": string, "owner_id"?: string | null, "pending_address"?: string | null, "pending_lat"?: number | null, "pending_lng"?: number | null, "phone"?: string | null, "reject_code"?: string | null, "reject_reason"?: string | null, "representative_name"?: string | null, "reviewed_at"?: string | null, "status"?: string, "submitted_at"?: string, "suspend_code"?: string | null, "suspend_note"?: string | null, "suspended_at"?: string | null }
      Update: { "address"?: string, "address_requested_at"?: string | null, "approved_at"?: string | null, "business_no"?: string | null, "category"?: string, "created_at"?: string, "created_by_admin"?: boolean, "description"?: string | null, "id"?: string, "lat"?: number, "license_path"?: string | null, "link_code_hash"?: string | null, "lng"?: number, "name"?: string, "owner_id"?: string | null, "pending_address"?: string | null, "pending_lat"?: number | null, "pending_lng"?: number | null, "phone"?: string | null, "reject_code"?: string | null, "reject_reason"?: string | null, "representative_name"?: string | null, "reviewed_at"?: string | null, "status"?: string, "submitted_at"?: string, "suspend_code"?: string | null, "suspend_note"?: string | null, "suspended_at"?: string | null }
      Relationships: [{ foreignKeyName: "stores_owner_id_fkey", columns: ["owner_id"], isOneToOne: true, referencedRelation: "profiles", referencedColumns: ["id"] }]
    }
    "zones": {
      Row: { "center_lat": number, "center_lng": number, "exposure_weight": number, "id": string, "is_redistribution": boolean, "name": string, "sort": number }
      Insert: { "center_lat": number, "center_lng": number, "exposure_weight"?: number, "id": string, "is_redistribution"?: boolean, "name": string, "sort"?: number }
      Update: { "center_lat"?: number, "center_lng"?: number, "exposure_weight"?: number, "id"?: string, "is_redistribution"?: boolean, "name"?: string, "sort"?: number }
      Relationships: []
    }
  }
  Views: { [_ in never]: never }
  Functions: {
    "admin_close_deal": { Args: { "p_deal_id": string }; Returns: Json }
    "admin_create_deal": { Args: { "p_store_id": string, "p_title": string, "p_original_price": number, "p_deal_price": number, "p_duration_min": number, "p_total_qty": number, "p_coupon_ttl_min": number, "p_starts_at"?: string }; Returns: Json }
    "admin_create_store": { Args: { "p_name": string, "p_category": string, "p_address": string, "p_lat": number, "p_lng": number, "p_description"?: string, "p_representative_name"?: string, "p_business_no"?: string, "p_phone"?: string }; Returns: Json }
    "admin_deal_push_status": { Args: { "p_deal_id": string }; Returns: Json }
    "admin_delete_store": { Args: { "p_store_id": string }; Returns: Json }
    "admin_get_report_detail": { Args: { "p_deal_id": string }; Returns: Json }
    "admin_get_store": { Args: { "p_store_id": string }; Returns: Json }
    "admin_issue_link_code": { Args: { "p_store_id": string }; Returns: Json }
    "admin_list_applications": { Args: { "p_status"?: string }; Returns: Json }
    "admin_list_report_groups": { Args: { "p_status"?: string }; Returns: Json }
    "admin_list_stores": { Args: { "p_filter"?: string, "p_query"?: string }; Returns: Json }
    "admin_push_funnel": { Args: { "p_store_id": string }; Returns: Json }
    "admin_push_readiness": { Args: Record<PropertyKey, never>; Returns: Json }
    "admin_resolve_reports": { Args: { "p_deal_id": string, "p_confirm": boolean }; Returns: Json }
    "admin_rotate_store_code": { Args: { "p_store_id": string }; Returns: Json }
    "admin_send_deal_push_now": { Args: { "p_deal_id": string }; Returns: Json }
    "admin_send_test_push": { Args: { "p_deal_id": string }; Returns: Json }
    "admin_suspend_store": { Args: { "p_store_id": string, "p_code": string, "p_note"?: string }; Returns: Json }
    "admin_unsuspend_store": { Args: { "p_store_id": string }; Returns: Json }
    "admin_update_store": { Args: { "p_store_id": string, "p_name": string, "p_category": string, "p_address": string, "p_lat": number, "p_lng": number, "p_description"?: string, "p_representative_name"?: string, "p_business_no"?: string, "p_phone"?: string }; Returns: Json }
    "app_policy": { Args: Record<PropertyKey, never>; Returns: Json }
    "approve_store": { Args: { "p_store_id": string, "p_approve": boolean, "p_reject_code"?: string, "p_reject_reason"?: string }; Returns: Json }
    "approve_store_address": { Args: { "p_store_id": string, "p_approve": boolean }; Returns: Json }
    "claim_coupon": { Args: { "p_deal_id": string }; Returns: Json }
    "close_deal": { Args: { "p_deal_id": string }; Returns: Json }
    "close_ended_deals": { Args: Record<PropertyKey, never>; Returns: undefined }
    "create_instant_deal": { Args: { "p_title": string, "p_original_price": number, "p_deal_price": number, "p_duration_min": number, "p_total_qty": number, "p_coupon_ttl_min": number, "p_starts_at"?: string }; Returns: Json }
    "delete_my_account": { Args: Record<PropertyKey, never>; Returns: Json }
    "distance_m": { Args: { "lat1": number, "lng1": number, "lat2": number, "lng2": number }; Returns: number }
    "enqueue_deal_pushes": { Args: Record<PropertyKey, never>; Returns: number }
    "estimate_push_targets": { Args: { "p_starts_at": string, "p_duration_min"?: number }; Returns: number }
    "expire_coupons": { Args: Record<PropertyKey, never>; Returns: undefined }
    "generate_redeem_code": { Args: Record<PropertyKey, never>; Returns: string }
    "generate_weekly_deals": { Args: Record<PropertyKey, never>; Returns: undefined }
    "get_alert_times": { Args: { "p_user_id": string, "p_day": string }; Returns: { "slot": string, "at_time": string, "label": string }[] }
    "get_council_report": { Args: { "p_month": string }; Returns: Json }
    "get_my_alert_preview": { Args: { "p_from"?: string }; Returns: Json }
    "get_my_daily_usage": { Args: Record<PropertyKey, never>; Returns: Json }
    "get_my_free_times": { Args: { "p_from"?: string }; Returns: Json }
    "get_my_store": { Args: Record<PropertyKey, never>; Returns: Json }
    "get_owner_deal_history": { Args: { "p_tab"?: string, "p_limit"?: number }; Returns: Json }
    "get_owner_deal_result": { Args: { "p_deal_id": string }; Returns: Json }
    "get_redeem_lock": { Args: Record<PropertyKey, never>; Returns: Json }
    "get_shared_deal_preview": { Args: { "p_deal_id": string }; Returns: Json }
    "get_store_code_status": { Args: Record<PropertyKey, never>; Returns: Json }
    "get_store_report": { Args: { "p_from": string, "p_to": string }; Returns: Json }
    "get_today_deal_quota": { Args: Record<PropertyKey, never>; Returns: Json }
    "invoke_push_sender": { Args: Record<PropertyKey, never>; Returns: undefined }
    "is_admin": { Args: Record<PropertyKey, never>; Returns: boolean }
    "is_in_service_area": { Args: { "p_lat": number, "p_lng": number }; Returns: boolean }
    "link_store_by_code": { Args: { "p_code": string }; Returns: Json }
    "log_deal_event": { Args: { "p_deal_id": string, "p_type": string }; Returns: undefined }
    "mark_notifications_read": { Args: { "p_ids"?: number[] }; Returns: Json }
    "my_approved_store_id": { Args: Record<PropertyKey, never>; Returns: string }
    "my_store_id": { Args: Record<PropertyKey, never>; Returns: string }
    "notify_store_owner": { Args: { "p_store_id": string, "p_kind": string, "p_title": string, "p_body"?: string, "p_deal_id"?: string, "p_link"?: string }; Returns: undefined }
    "purge_old_notifications": { Args: Record<PropertyKey, never>; Returns: undefined }
    "recommend_deals": { Args: { "p_lat": number, "p_lng": number, "p_radius_m"?: number }; Returns: { "deal_id": string, "store_id": string, "store_name": string, "category": string, "title": string, "original_price": number, "deal_price": number, "remaining_qty": number, "total_qty": number, "starts_at": string, "ends_at": string, "coupon_ttl_min": number, "distance_m": number }[] }
    "redeem_coupon": { Args: { "p_coupon_id": string, "p_code": string }; Returns: Json }
    "register_store": { Args: { "p_name": string, "p_category": string, "p_address": string, "p_lat": number, "p_lng": number, "p_representative_name": string, "p_business_no": string, "p_phone"?: string, "p_license_path"?: string, "p_description"?: string, "p_marketing_agreed"?: boolean }; Returns: Json }
    "report_deal": { Args: { "p_deal_id": string, "p_reason": string, "p_detail"?: string }; Returns: Json }
    "request_store_address_change": { Args: { "p_address": string, "p_lat": number, "p_lng": number }; Returns: Json }
    "rotate_store_code": { Args: Record<PropertyKey, never>; Returns: Json }
    "save_council_summary_draft": { Args: { "p_month": string, "p_text": string, "p_source"?: string }; Returns: Json }
    "set_council_summary_status": { Args: { "p_month": string, "p_status": string }; Returns: Json }
    "store_zone_id": { Args: { "p_lat": number, "p_lng": number }; Returns: string }
    "update_council_summary": { Args: { "p_month": string, "p_text": string }; Returns: Json }
  }
  Enums: { [_ in never]: never }
  CompositeTypes: { [_ in never]: never }
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
