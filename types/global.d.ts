import { User, AuthState, Session, CashflowRecord } from "./supabase";

declare global {
  type AppUser = User;
  type AppAuthState = AuthState;
  type AppSession = Session;
  type Transaction = CashflowRecord;
}

export {};
