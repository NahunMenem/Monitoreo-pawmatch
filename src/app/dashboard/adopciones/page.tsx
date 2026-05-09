"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { getAdminAdoptions } from "@/lib/api";
import { AdminAdoption } from "@/lib/types";
import { ALL_PROVINCES, PROVINCIAS_ARG } from "@/lib/provinces";

const LIMIT = 20;

const TYPE_LABEL: Record<string, string> = { dog: "Perro", cat: "Gato" };
const SEX_LABEL: Record<string, string> = { male: "Macho", female: "Hembra" };
const SIZE_LABEL: Record<string, string> = { small: "Pequeño", medium: "Mediano", large: "Grande" };
const STATUS_LABEL: Record<string, string> = { available: "Disponible", reserved: "Reservado", adopted: "Adoptado" };
const STATUS_STYLE: Record<string, string> = {
  available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  reserved: "bg-blue-50 text-blue-700 border-blue-200",
  adopted: "bg-slate-100 text-slate-500 border-slate-200",
};

function PhotoThumb({ photos, name }: { photos: string[]; name: string }) {
  const src = photos[0];
  if (!src)
    return <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-lg">🏠</div>;
  return <Image src={src} alt={name} width={40} height={40} className="h-10 w-10 rounded-xl object-cover" unoptimized />;
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

export default function AdopcionesPage() {
  const { data: session } = useSession();
  const token = (session as any)?.backendToken ?? "";

  const [adoptions, setAdoptions] = useState<AdminAdoption[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [provincia, setProvincia] = useState(ALL_PROVINCES);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getAdminAdoptions(token, {
        page,
        limit: LIMIT,
        search: search || undefined,
        status: status || undefined,
        type: type || undefined,
        provincia: provincia !== ALL_PROVINCES ? provincia : undefined,
      });
      setAdoptions(res.adoptions);
      setTotal(res.total);
    } catch { /* silent */ } finally { setLoading(false); }
  }, [token, page, search, status, type, provincia]);

  useEffect(() => { fetch(); }, [fetch]);
  const resetPage = () => setPage(1);

  const available = adoptions.filter(a => a.status === "available").length;
  const reserved = adoptions.filter(a => a.status === "reserved").length;
  const adopted = adoptions.filter(a => a.status === "adopted").length;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-[radial-gradient(circle_at_top_left,_rgba(255,122,26,0.18),_transparent_24%),linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(255,255,255,0.78))] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
        <div className="absolute -right-12 top-0 h-40 w-40 rounded-full bg-[#ff7a1a]/10 blur-3xl" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-orange-500">PawMatch Admin</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">En Adopción</h1>
            <p className="mt-2 text-sm text-slate-500">Publicaciones de mascotas disponibles para adoptar</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-700 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
            {total.toLocaleString("es-AR")} publicaciones
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard title="Total" value={total.toLocaleString("es-AR")} sub="publicaciones" color="linear-gradient(135deg,#FF7A1A,#FF5B45)" />
        <KpiCard title="Disponibles" value={available.toLocaleString("es-AR")} sub="en esta página" color="linear-gradient(135deg,#059669,#047857)" />
        <KpiCard title="Reservadas" value={reserved.toLocaleString("es-AR")} sub="en esta página" color="linear-gradient(135deg,#2563EB,#1d4ed8)" />
        <KpiCard title="Adoptadas" value={adopted.toLocaleString("es-AR")} sub="en esta página" color="linear-gradient(135deg,#64748B,#475569)" />
      </div>

      {/* Filters */}
      <div className="card p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-1 min-w-[200px] flex-col gap-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Buscar</label>
            <input type="text" placeholder="Nombre, publicador o email…" value={search}
              onChange={e => { setSearch(e.target.value); resetPage(); }} className="input h-10 text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Estado</label>
            <select value={status} onChange={e => { setStatus(e.target.value); resetPage(); }} className="input h-10 min-w-[150px] cursor-pointer text-sm">
              <option value="">Todos</option>
              <option value="available">Disponible</option>
              <option value="reserved">Reservado</option>
              <option value="adopted">Adoptado</option>
            </select>
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
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Provincia</label>
            <select value={provincia} onChange={e => { setProvincia(e.target.value); resetPage(); }} className="input h-10 min-w-[190px] cursor-pointer text-sm">
              {PROVINCIAS_ARG.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          {(search || status || type || provincia !== ALL_PROVINCES) && (
            <button onClick={() => { setSearch(""); setStatus(""); setType(""); setProvincia(ALL_PROVINCES); resetPage(); }}
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
          <p className="text-sm font-black text-slate-700">Publicaciones de adopción</p>
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
        ) : adoptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-sm text-slate-400">
            <span className="text-4xl">🏠</span>
            No hay publicaciones para los filtros aplicados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80">
                  {["Foto", "Nombre", "Tipo", "Sexo", "Tamaño", "Edad", "Ubicación", "Publicador", "Estado", "Fecha"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {adoptions.map(a => (
                  <tr key={a.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-5 py-3"><PhotoThumb photos={a.photos} name={a.name} /></td>
                    <td className="px-5 py-3 font-bold text-slate-800">{a.name}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${a.type === "dog" ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-violet-50 text-violet-700 border-violet-200"}`}>
                        {a.type === "dog" ? "🐶" : "🐱"} {TYPE_LABEL[a.type]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-slate-600">{a.sex ? SEX_LABEL[a.sex] : "—"}</td>
                    <td className="px-5 py-3 text-[12px] text-slate-600">{SIZE_LABEL[a.size] || "—"}</td>
                    <td className="px-5 py-3 text-[12px] text-slate-600">{a.age}</td>
                    <td className="px-5 py-3 max-w-[140px]">
                      <p className="truncate text-[12px] text-slate-500">{a.location || "—"}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-[13px] font-bold text-slate-700">{a.publisher_name}</p>
                      <p className="text-[11px] text-slate-400">{a.publisher_email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${STATUS_STYLE[a.status] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
                        {STATUS_LABEL[a.status] || a.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-slate-400">
                      {a.published_at ? new Date(a.published_at).toLocaleDateString("es-AR") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
