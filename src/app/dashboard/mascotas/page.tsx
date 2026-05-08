"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { getAdminPets } from "@/lib/api";
import { AdminPet } from "@/lib/types";

const LIMIT = 20;

const TYPE_LABEL: Record<string, string> = { dog: "Perro", cat: "Gato" };
const SEX_LABEL: Record<string, string> = { male: "Macho", female: "Hembra" };
const SIZE_LABEL: Record<string, string> = { small: "Pequeño", medium: "Mediano", large: "Grande" };

function PhotoThumb({ photos, name }: { photos: string[]; name: string }) {
  const src = photos[0];
  if (!src)
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-lg">🐾</div>
    );
  return (
    <Image
      src={src}
      alt={name}
      width={40}
      height={40}
      className="h-10 w-10 rounded-xl object-cover"
      unoptimized
    />
  );
}

function KpiCard({ title, value, sub, color }: { title: string; value: string | number; sub: string; color: string }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] p-5 text-white shadow-lg" style={{ background: color }}>
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
      <div className="relative">
        <p className="text-[11px] font-black uppercase tracking-widest text-white/70">{title}</p>
        <p className="mt-1 text-2xl font-black tracking-tight">{value}</p>
        <p className="mt-1 text-[11px] text-white/60">{sub}</p>
      </div>
    </div>
  );
}

export default function MascotasPage() {
  const { data: session } = useSession();
  const token = (session as any)?.backendToken ?? "";

  const [pets, setPets] = useState<AdminPet[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [sex, setSex] = useState("");
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getAdminPets(token, { page, limit: LIMIT, search: search || undefined, type: type || undefined, sex: sex || undefined });
      setPets(res.pets);
      setTotal(res.total);
    } catch { /* silent */ } finally { setLoading(false); }
  }, [token, page, search, type, sex]);

  useEffect(() => { fetch(); }, [fetch]);
  const resetPage = () => setPage(1);

  const dogs = pets.filter(p => p.type === "dog").length;
  const cats = pets.filter(p => p.type === "cat").length;
  const active = pets.filter(p => p.is_active).length;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-[radial-gradient(circle_at_top_left,_rgba(255,122,26,0.18),_transparent_24%),linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(255,255,255,0.78))] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
        <div className="absolute -right-12 top-0 h-40 w-40 rounded-full bg-[#ff7a1a]/10 blur-3xl" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-orange-500">PawMatch Admin</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Mascotas</h1>
            <p className="mt-2 text-sm text-slate-500">Mascotas publicadas buscando pareja en Explorar</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-700 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
            {total.toLocaleString("es-AR")} mascotas
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard title="Total mascotas" value={total.toLocaleString("es-AR")} sub="en la plataforma" color="linear-gradient(135deg,#FF7A1A,#FF5B45)" />
        <KpiCard title="Activas" value={active.toLocaleString("es-AR")} sub="buscando pareja" color="linear-gradient(135deg,#059669,#047857)" />
        <KpiCard title="Perros" value={dogs.toLocaleString("es-AR")} sub="en esta página" color="linear-gradient(135deg,#2563EB,#1d4ed8)" />
        <KpiCard title="Gatos" value={cats.toLocaleString("es-AR")} sub="en esta página" color="linear-gradient(135deg,#7C3AED,#6d28d9)" />
      </div>

      {/* Filters */}
      <div className="card p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-1 min-w-[200px] flex-col gap-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Buscar</label>
            <input
              type="text"
              placeholder="Nombre, dueño o email…"
              value={search}
              onChange={e => { setSearch(e.target.value); resetPage(); }}
              className="input h-10 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Tipo</label>
            <select value={type} onChange={e => { setType(e.target.value); resetPage(); }} className="input h-10 min-w-[130px] cursor-pointer text-sm">
              <option value="">Todos</option>
              <option value="dog">Perros</option>
              <option value="cat">Gatos</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Sexo</label>
            <select value={sex} onChange={e => { setSex(e.target.value); resetPage(); }} className="input h-10 min-w-[130px] cursor-pointer text-sm">
              <option value="">Todos</option>
              <option value="male">Macho</option>
              <option value="female">Hembra</option>
            </select>
          </div>
          {(search || type || sex) && (
            <button onClick={() => { setSearch(""); setType(""); setSex(""); resetPage(); }}
              className="flex h-10 items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-[12px] font-bold text-slate-500 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 transition-all">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <p className="text-sm font-black text-slate-700">Listado de mascotas</p>
          <p className="text-[11px] text-slate-400">{total} registro{total !== 1 ? "s" : ""}{totalPages > 1 && ` · pág. ${page}/${totalPages}`}</p>
        </div>

        {loading ? (
          <div className="divide-y divide-slate-50">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3.5">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
                  <div className="h-2.5 w-48 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : pets.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-sm text-slate-400">
            <span className="text-4xl">🐾</span>
            No hay mascotas para los filtros aplicados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80">
                  {["Foto", "Nombre", "Tipo", "Raza", "Sexo", "Tamaño", "Dueño", "Estado", "Vacunas", "Fecha"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pets.map(p => (
                  <tr key={p.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-5 py-3"><PhotoThumb photos={p.photos} name={p.name} /></td>
                    <td className="px-5 py-3 font-bold text-slate-800">{p.name}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${p.type === "dog" ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-violet-50 text-violet-700 border-violet-200"}`}>
                        {p.type === "dog" ? "🐶" : "🐱"} {TYPE_LABEL[p.type]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-slate-500">{p.breed || "—"}</td>
                    <td className="px-5 py-3 text-[12px] text-slate-600">{SEX_LABEL[p.sex] || "—"}</td>
                    <td className="px-5 py-3 text-[12px] text-slate-600">{SIZE_LABEL[p.size] || "—"}</td>
                    <td className="px-5 py-3">
                      <p className="text-[13px] font-bold text-slate-700">{p.owner_name}</p>
                      <p className="text-[11px] text-slate-400">{p.owner_email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${p.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                        {p.is_active ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-slate-600">{p.vaccines_up_to_date ? "✅" : "❌"}</td>
                    <td className="px-5 py-3 text-[12px] text-slate-400">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString("es-AR") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-slate-500 hover:border-orange-300 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Anterior
            </button>
            <span className="text-[12px] text-slate-400">Página {page} de {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-slate-500 hover:border-orange-300 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              Siguiente
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
