import { User as SupabaseUser } from "@supabase/supabase-js";

export interface UserMetadata {
  full_name?: string;
  avatar_url?: string;
  username?: string;
}

export interface AppMetadata {
  provider?: string;
  providers?: string[];
}

export interface User extends SupabaseUser {
  user_metadata: UserMetadata;
  app_metadata: AppMetadata;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: User;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: Error | null;
}

export interface CashflowRecord {
  id: string;
  user_id: string;
  type: string;
  category: string;
  amount: number;
  note?: string;
  date: string;
  created_at: string;
  updated_at?: string;
}

export type CashflowInsert = Omit<
  CashflowRecord,
  "id" | "created_at" | "updated_at"
>;

export type CashflowUpdate = Partial<
  Omit<CashflowRecord, "id" | "user_id" | "created_at">
>;

export interface Database {
  public: {
    Tables: {
      cashflow: {
        Row: CashflowRecord;
        Insert: CashflowInsert;
        Update: CashflowUpdate;
      };
      // Add other tables here
    };
  };
}
