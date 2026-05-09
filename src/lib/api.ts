import { AdminStats, BackendUser, GrowthDataPoint, PatitasPack, VentaRecord, VentaFilters, AdminPet, AdminAdoption, AdminLostPet } from "./types";

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://petmatch-back-production.up.railway.app";

async function apiFetch<T>(
  path: string,
  token: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BACKEND}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status}: ${text}`);
  }

  return res.json();
}

// Stats
export async function getAdminStats(token: string): Promise<AdminStats> {
  return apiFetch<AdminStats>("/admin/stats", token);
}

export async function getGrowthData(token: string): Promise<GrowthDataPoint[]> {
  return apiFetch<GrowthDataPoint[]>("/admin/stats/growth", token);
}

// Users
export async function getUsers(
  token: string,
  page = 1,
  limit = 20,
  search?: string
): Promise<{ users: BackendUser[]; total: number }> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.set("search", search);
  return apiFetch(`/admin/users?${params}`, token);
}

export async function addPatitasToUser(
  token: string,
  userId: string,
  amount: number,
  reason = "Asignación manual admin"
): Promise<BackendUser> {
  return apiFetch(`/admin/users/${userId}/patitas`, token, {
    method: "POST",
    body: JSON.stringify({ amount, reason }),
  });
}

export async function deleteUserCascade(
  token: string,
  userId: string
): Promise<{ success: boolean; deleted_user_id: string }> {
  return apiFetch(`/admin/users/${userId}`, token, {
    method: "DELETE",
  });
}

// Patitas packs
export async function getPatitasPacks(token: string): Promise<PatitasPack[]> {
  const data = await apiFetch<PatitasPack[] | { packs: PatitasPack[] }>(
    "/admin/patitas/packs",
    token
  );
  return Array.isArray(data) ? data : data.packs;
}

export async function updatePatitasPack(
  token: string,
  packId: string,
  updates: Partial<Omit<PatitasPack, "id">>
): Promise<PatitasPack> {
  return apiFetch<PatitasPack>(`/admin/patitas/packs/${packId}`, token, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

// Pets
export async function getAdminPets(
  token: string,
  params: { page?: number; limit?: number; search?: string; type?: string; sex?: string; provincia?: string } = {}
): Promise<{ total: number; page: number; pets: AdminPet[] }> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.search) q.set("search", params.search);
  if (params.type) q.set("type", params.type);
  if (params.sex) q.set("sex", params.sex);
  if (params.provincia) q.set("provincia", params.provincia);
  return apiFetch(`/admin/pets?${q}`, token);
}

// Adoptions
export async function getAdminAdoptions(
  token: string,
  params: { page?: number; limit?: number; search?: string; status?: string; type?: string; provincia?: string } = {}
): Promise<{ total: number; page: number; adoptions: AdminAdoption[] }> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.search) q.set("search", params.search);
  if (params.status) q.set("status", params.status);
  if (params.type) q.set("type", params.type);
  if (params.provincia) q.set("provincia", params.provincia);
  return apiFetch(`/admin/adoptions?${q}`, token);
}

// Lost pets
export async function getAdminLostPets(
  token: string,
  params: { page?: number; limit?: number; search?: string; status?: string; provincia?: string } = {}
): Promise<{ total: number; page: number; lost_pets: AdminLostPet[] }> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.search) q.set("search", params.search);
  if (params.status) q.set("status", params.status);
  if (params.provincia) q.set("provincia", params.provincia);
  return apiFetch(`/admin/lost-pets?${q}`, token);
}

// When the backend exposes GET /admin/ventas?dateFrom=&dateTo=&provincia=&page=&limit=
// replace MOCK_VENTAS in the page with: await getVentas(token, filters)
export async function getVentas(
  token: string,
  filters: VentaFilters = {}
): Promise<{ ventas: VentaRecord[]; total: number }> {
  const params = new URLSearchParams();
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  if (filters.provincia) params.set("provincia", filters.provincia);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  return apiFetch(`/admin/ventas?${params}`, token);
}

export async function getPublicPacks(): Promise<PatitasPack[]> {
  const res = await fetch(`${BACKEND}/patitas/packs`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch packs");

  const data = await res.json();
  const items: Array<{
    id: string;
    name: string;
    price: number;
    base_patitas: number;
    bonus_patitas: number;
  }> = Array.isArray(data) ? data : Object.values(data.packs ?? data);

  return items.map((p) => ({ ...p, is_active: true }));
}
