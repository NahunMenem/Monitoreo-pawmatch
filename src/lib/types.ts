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

export interface VentaRecord {
  id: string;
  fecha: string;
  usuario: string;
  email: string;
  pack: "Starter" | "Popular" | "Pro";
  monto: number;
  provincia: string;
}

export interface AdminPet {
  id: string;
  name: string;
  type: "dog" | "cat";
  breed: string;
  sex: "male" | "female";
  size: "small" | "medium" | "large";
  vaccines_up_to_date: boolean;
  sterilized: boolean;
  is_active: boolean;
  photos: string[];
  created_at: string;
  owner_id: string;
  owner_name: string;
  owner_email: string;
}

export interface AdminAdoption {
  id: string;
  name: string;
  type: "dog" | "cat";
  sex: "male" | "female" | null;
  size: "small" | "medium" | "large";
  age: string;
  breed: string | null;
  health_status: string;
  location: string;
  status: "available" | "reserved" | "adopted";
  photos: string[];
  published_at: string;
  publisher_id: string;
  publisher_name: string;
  publisher_email: string;
}

export interface AdminLostPet {
  id: string;
  name: string;
  type: "dog" | "cat";
  sex: "male" | "female" | null;
  location: string;
  reward_amount: number | null;
  status: "active" | "found";
  photos: string[];
  reported_at: string;
  reporter_id: string;
  reporter_name: string;
  reporter_email: string;
}

export interface VentaFilters {
  dateFrom?: string;
  dateTo?: string;
  provincia?: string;
  page?: number;
  limit?: number;
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
