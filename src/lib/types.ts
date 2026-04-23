export interface AdminStats {
  users: { total: number; new_this_week: number; growth_pct: number };
  pets: { total: number; looking_for_partner: number; new_this_week: number };
  adoptions: { total: number; available: number; reserved: number; adopted: number };
  lost_pets: { total: number; active: number; found: number };
  matches: { total: number; new_this_week: number };
  patitas: { total_transactions: number; revenue_this_month: number };
}

export interface GrowthDataPoint {
  label: string;
  usuarios: number;
  mascotas: number;
  matches: number;
}

export interface PatitasPack {
  id: string;
  name: string;
  price: number;
  base_patitas: number;
  bonus_patitas: number;
  is_active: boolean;
}

export interface BackendUser {
  id: string;
  email: string;
  name: string;
  photo_url: string | null;
  patitas: number;
  created_at: string;
  pets_count?: number;
  lost_reports_count?: number;
  adoptions_count?: number;
}

declare module "next-auth" {
  interface Session {
    backendToken?: string;
    user: { name?: string | null; email?: string | null; image?: string | null };
  }
}
declare module "next-auth/jwt" {
  interface JWT { backendToken?: string }
}
