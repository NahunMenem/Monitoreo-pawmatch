import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdminStats, getGrowthData } from "@/lib/api";
import { AdminStats, GrowthDataPoint } from "@/lib/types";
import StatsGrid from "@/components/StatsGrid";
import GrowthChart from "@/components/GrowthChart";
import Link from "next/link";

async function safeStats(token: string): Promise<AdminStats | null> {
  try { return await getAdminStats(token); } catch { return null; }
}
async function safeGrowth(token: string): Promise<GrowthDataPoint[]> {
  try { return await getGrowthData(token); } catch { return []; }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const token = session?.backendToken ?? "";
  const [stats, growth] = await Promise.all([safeStats(token), safeGrowth(token)]);

  const now = new Date().toLocaleString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-[radial-gradient(circle_at_top_left,_rgba(255,122,26,0.18),_transparent_24%),linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(255,255,255,0.78))] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
        <div className="absolute -right-12 top-0 h-40 w-40 rounded-full bg-[#ff7a1a]/10 blur-3xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-orange-500">PawMatch Admin</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
            <p className="mt-2 text-sm text-slate-500">Actualizado: {now} (ARG)</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Sistema activo
          </div>
        </div>
      </div>

      {/* Backend warning */}
      {!stats && (
        <div className="card p-4 flex items-start gap-3 border-amber-200 bg-amber-50">
          <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div className="text-sm">
            <p className="font-semibold text-amber-800">Backend admin no activo</p>
            <p className="text-amber-700 text-xs mt-0.5">
              Agregá <code className="bg-amber-100 px-1 rounded font-mono">admin_router.py</code> al backend y registralo en{" "}
              <code className="bg-amber-100 px-1 rounded font-mono">main.py</code> según{" "}
              <code className="bg-amber-100 px-1 rounded font-mono">backend-patch/INSTALL.md</code>
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <StatsGrid stats={stats} />

      {/* Charts + Quick links */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <GrowthChart data={growth} />
        </div>
        <div className="card p-5 flex flex-col gap-3">
          <p className="font-semibold text-gray-800 text-sm">Accesos rápidos</p>
          {[
            { href: "/dashboard/usuarios", label: "Ver todos los usuarios", icon: "👥", color: "#FF6B00" },
            { href: "/dashboard/patitas", label: "Editar packs de Patitas", icon: "🐾", color: "#D97706" },
            { href: "https://petmatch-back-production.up.railway.app/docs", label: "API Docs (Railway)", icon: "📋", color: "#7C3AED", ext: true },
          ].map((item) => (
            item.ext ? (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all group">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 flex-1">{item.label}</span>
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </a>
            ) : (
              <Link key={item.label} href={item.href}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all group">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 flex-1">{item.label}</span>
                <svg className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </Link>
            )
          ))}

          {/* Breakdown */}
          {stats && (
            <>
              <div className="border-t border-gray-100 pt-3 mt-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Resumen</p>
                {[
                  { label: "Buscando pareja", val: stats.pets.looking_for_partner, color: "#FF6B00" },
                  { label: "Adoptadas", val: stats.adoptions.adopted, color: "#059669" },
                  { label: "Perdidas activas", val: stats.lost_pets.active, color: "#DC2626" },
                  { label: "Encontradas", val: stats.lost_pets.found, color: "#3B82F6" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: r.color }} />
                      <span className="text-xs text-gray-500">{r.label}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-800">{r.val.toLocaleString("es-AR")}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
