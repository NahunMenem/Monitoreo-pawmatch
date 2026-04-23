import { AdminStats } from "@/lib/types";

interface CardProps {
  title: string;
  value: number | string;
  sub?: string;
  gradient: string;
  textColor: string;
  icon: React.ReactNode;
  trend?: number;
}

function StatCard({ title, value, sub, gradient, textColor, icon, trend }: CardProps) {
  const fmt = (v: number | string) =>
    typeof v === "number" ? v.toLocaleString("es-AR") : v;
  return (
    <div className="card flex flex-col gap-5 p-5 transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
      <div className="flex items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm"
          style={{ background: gradient }}
        >
          <span style={{ color: textColor }}>{icon}</span>
        </div>
        {trend !== undefined && (
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-black ${
              trend >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
            }`}
          >
            {trend >= 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="leading-none tracking-tight text-slate-900 text-[30px] font-black">{fmt(value)}</p>
        <p className="mt-1.5 text-[13px] font-bold text-slate-500">{title}</p>
        {sub && <p className="mt-1 text-[11px] text-slate-400">{sub}</p>}
      </div>
    </div>
  );
}

const CARDS = (s: AdminStats | null): CardProps[] => [
  {
    title: "Usuarios registrados",
    value: s?.users.total ?? "—",
    sub: s ? `+${s.users.new_this_week} esta semana` : undefined,
    gradient: "linear-gradient(135deg,#FFF0E6,#FFD6B3)",
    textColor: "#FF6B00",
    trend: s?.users.growth_pct,
    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>,
  },
  {
    title: "Mascotas totales",
    value: s?.pets.total ?? "—",
    sub: s ? `${s.pets.looking_for_partner} buscando pareja` : undefined,
    gradient: "linear-gradient(135deg,#EDE9FE,#C4B5FD)",
    textColor: "#7C3AED",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M4.5 10.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm3-5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm3 5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-5.5 2c-2.5 0-4.5 1.6-4.5 3.5S7.5 20 10 20s4.5-1.6 4.5-3.5S12.5 12.5 10 12.5z"/></svg>,
  },
  {
    title: "Adopciones",
    value: s?.adoptions.total ?? "—",
    sub: s ? `${s.adoptions.adopted} adoptadas · ${s.adoptions.available} disponibles` : undefined,
    gradient: "linear-gradient(135deg,#D1FAE5,#6EE7B7)",
    textColor: "#059669",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
  },
  {
    title: "Mascotas perdidas",
    value: s?.lost_pets.total ?? "—",
    sub: s ? `${s.lost_pets.active} activas · ${s.lost_pets.found} encontradas` : undefined,
    gradient: "linear-gradient(135deg,#FEE2E2,#FCA5A5)",
    textColor: "#DC2626",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35"/></svg>,
  },
  {
    title: "Matches realizados",
    value: s?.matches.total ?? "—",
    sub: s ? `+${s.matches.new_this_week} esta semana` : undefined,
    gradient: "linear-gradient(135deg,#FCE7F3,#F9A8D4)",
    textColor: "#DB2777",
    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>,
  },
  {
    title: "Transacciones Patitas",
    value: s?.patitas.total_transactions ?? "—",
    sub: s ? `$${s.patitas.revenue_this_month?.toLocaleString("es-AR")} este mes` : undefined,
    gradient: "linear-gradient(135deg,#FEF3C7,#FCD34D)",
    textColor: "#D97706",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  },
];

export default function StatsGrid({ stats }: { stats: AdminStats | null }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {CARDS(stats).map((c) => <StatCard key={c.title} {...c} />)}
    </div>
  );
}
