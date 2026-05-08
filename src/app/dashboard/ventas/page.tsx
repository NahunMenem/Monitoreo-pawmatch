"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  TooltipProps,
} from "recharts";
import { VentaRecord } from "@/lib/types";

// ── Constants ──────────────────────────────────────────────────────────────────
const PROVINCIAS_ARG = [
  "Todas las provincias",
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

const PACK_BADGE: Record<string, string> = {
  Starter: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Popular: "bg-blue-50 text-blue-700 border-blue-200",
  Pro: "bg-violet-50 text-violet-700 border-violet-200",
};

// ── Mock data — replace with: await getVentas(token, filters) when backend endpoint is ready ──
const MOCK_VENTAS: VentaRecord[] = [
  { id: "v001", fecha: "2026-01-03", usuario: "Lucas García", email: "lucas.g@mail.com", pack: "Popular", monto: 5000, provincia: "Buenos Aires" },
  { id: "v002", fecha: "2026-01-05", usuario: "María González", email: "maria.g@mail.com", pack: "Starter", monto: 2000, provincia: "CABA" },
  { id: "v003", fecha: "2026-01-07", usuario: "Juan Pérez", email: "juan.p@mail.com", pack: "Pro", monto: 9000, provincia: "Córdoba" },
  { id: "v004", fecha: "2026-01-09", usuario: "Ana Rodríguez", email: "ana.r@mail.com", pack: "Popular", monto: 5000, provincia: "Buenos Aires" },
  { id: "v005", fecha: "2026-01-11", usuario: "Carlos López", email: "carlos.l@mail.com", pack: "Starter", monto: 2000, provincia: "Santa Fe" },
  { id: "v006", fecha: "2026-01-13", usuario: "Valentina Torres", email: "val.t@mail.com", pack: "Popular", monto: 5000, provincia: "Mendoza" },
  { id: "v007", fecha: "2026-01-15", usuario: "Marcos Fernández", email: "marcos.f@mail.com", pack: "Pro", monto: 9000, provincia: "CABA" },
  { id: "v008", fecha: "2026-01-17", usuario: "Sofía Martínez", email: "sofia.m@mail.com", pack: "Popular", monto: 5000, provincia: "Buenos Aires" },
  { id: "v009", fecha: "2026-01-19", usuario: "Diego Díaz", email: "diego.d@mail.com", pack: "Starter", monto: 2000, provincia: "Tucumán" },
  { id: "v010", fecha: "2026-01-21", usuario: "Lucía Sánchez", email: "lucia.s@mail.com", pack: "Popular", monto: 5000, provincia: "Córdoba" },
  { id: "v011", fecha: "2026-01-23", usuario: "Agustín Romero", email: "agus.r@mail.com", pack: "Starter", monto: 2000, provincia: "Buenos Aires" },
  { id: "v012", fecha: "2026-01-25", usuario: "Camila Herrera", email: "cami.h@mail.com", pack: "Pro", monto: 9000, provincia: "Mendoza" },
  { id: "v013", fecha: "2026-01-27", usuario: "Nicolás Álvarez", email: "nico.a@mail.com", pack: "Popular", monto: 5000, provincia: "Santa Fe" },
  { id: "v014", fecha: "2026-01-29", usuario: "Florencia Ruiz", email: "flor.r@mail.com", pack: "Starter", monto: 2000, provincia: "Buenos Aires" },
  { id: "v015", fecha: "2026-02-02", usuario: "Tomás Morales", email: "tomas.m@mail.com", pack: "Popular", monto: 5000, provincia: "CABA" },
  { id: "v016", fecha: "2026-02-04", usuario: "Martina Gutiérrez", email: "marti.g@mail.com", pack: "Starter", monto: 2000, provincia: "Buenos Aires" },
  { id: "v017", fecha: "2026-02-06", usuario: "Sebastián Castro", email: "seba.c@mail.com", pack: "Pro", monto: 9000, provincia: "Córdoba" },
  { id: "v018", fecha: "2026-02-08", usuario: "Isabella Ortiz", email: "isa.o@mail.com", pack: "Popular", monto: 5000, provincia: "Salta" },
  { id: "v019", fecha: "2026-02-10", usuario: "Rodrigo Flores", email: "rodri.f@mail.com", pack: "Popular", monto: 5000, provincia: "Buenos Aires" },
  { id: "v020", fecha: "2026-02-12", usuario: "Emilia Vargas", email: "emi.v@mail.com", pack: "Starter", monto: 2000, provincia: "Mendoza" },
  { id: "v021", fecha: "2026-02-14", usuario: "Ignacio Ramos", email: "igna.r@mail.com", pack: "Popular", monto: 5000, provincia: "CABA" },
  { id: "v022", fecha: "2026-02-16", usuario: "Valentín Medina", email: "val.m@mail.com", pack: "Starter", monto: 2000, provincia: "Entre Ríos" },
  { id: "v023", fecha: "2026-02-18", usuario: "Paula Acosta", email: "pau.a@mail.com", pack: "Pro", monto: 9000, provincia: "Buenos Aires" },
  { id: "v024", fecha: "2026-02-20", usuario: "Ramiro Rojas", email: "rami.r@mail.com", pack: "Popular", monto: 5000, provincia: "Santa Fe" },
  { id: "v025", fecha: "2026-02-22", usuario: "Daniela Vega", email: "dani.v@mail.com", pack: "Starter", monto: 2000, provincia: "Tucumán" },
  { id: "v026", fecha: "2026-02-24", usuario: "Manuel Suárez", email: "manu.s@mail.com", pack: "Popular", monto: 5000, provincia: "Córdoba" },
  { id: "v027", fecha: "2026-02-26", usuario: "Carolina Molina", email: "caro.m@mail.com", pack: "Starter", monto: 2000, provincia: "Buenos Aires" },
  { id: "v028", fecha: "2026-02-28", usuario: "Santiago Moreno", email: "santi.m@mail.com", pack: "Pro", monto: 9000, provincia: "CABA" },
  { id: "v029", fecha: "2026-03-02", usuario: "Micaela Silva", email: "mica.s@mail.com", pack: "Popular", monto: 5000, provincia: "Buenos Aires" },
  { id: "v030", fecha: "2026-03-04", usuario: "Hernán Aguilar", email: "hernan.a@mail.com", pack: "Starter", monto: 2000, provincia: "Misiones" },
  { id: "v031", fecha: "2026-03-06", usuario: "Julieta Contreras", email: "juli.c@mail.com", pack: "Popular", monto: 5000, provincia: "Córdoba" },
  { id: "v032", fecha: "2026-03-08", usuario: "Facundo Guerrero", email: "facu.g@mail.com", pack: "Pro", monto: 9000, provincia: "Buenos Aires" },
  { id: "v033", fecha: "2026-03-10", usuario: "Natalia Reyes", email: "nati.r@mail.com", pack: "Popular", monto: 5000, provincia: "CABA" },
  { id: "v034", fecha: "2026-03-12", usuario: "Ezequiel Navarro", email: "eze.n@mail.com", pack: "Starter", monto: 2000, provincia: "Santa Fe" },
  { id: "v035", fecha: "2026-03-14", usuario: "Agustina Cortés", email: "agusti.c@mail.com", pack: "Popular", monto: 5000, provincia: "Mendoza" },
  { id: "v036", fecha: "2026-03-16", usuario: "Federico Jiménez", email: "fede.j@mail.com", pack: "Starter", monto: 2000, provincia: "Buenos Aires" },
  { id: "v037", fecha: "2026-03-18", usuario: "Silvana Torres", email: "silv.t@mail.com", pack: "Pro", monto: 9000, provincia: "Neuquén" },
  { id: "v038", fecha: "2026-03-20", usuario: "Maximiliano Ríos", email: "maxi.r@mail.com", pack: "Popular", monto: 5000, provincia: "Tucumán" },
  { id: "v039", fecha: "2026-03-22", usuario: "Belén Cabrera", email: "belen.c@mail.com", pack: "Starter", monto: 2000, provincia: "CABA" },
  { id: "v040", fecha: "2026-03-24", usuario: "Leandro Fuentes", email: "lean.f@mail.com", pack: "Popular", monto: 5000, provincia: "Córdoba" },
  { id: "v041", fecha: "2026-03-26", usuario: "Cristina Campos", email: "cris.c@mail.com", pack: "Starter", monto: 2000, provincia: "Buenos Aires" },
  { id: "v042", fecha: "2026-03-28", usuario: "Pablo Espinoza", email: "pablo.e@mail.com", pack: "Pro", monto: 9000, provincia: "Santa Fe" },
  { id: "v043", fecha: "2026-03-30", usuario: "Adriana Carrillo", email: "adri.c@mail.com", pack: "Popular", monto: 5000, provincia: "Entre Ríos" },
  { id: "v044", fecha: "2026-04-01", usuario: "Gustavo Pedraza", email: "gus.p@mail.com", pack: "Starter", monto: 2000, provincia: "Buenos Aires" },
  { id: "v045", fecha: "2026-04-03", usuario: "Lorena Delgado", email: "lore.d@mail.com", pack: "Popular", monto: 5000, provincia: "CABA" },
  { id: "v046", fecha: "2026-04-05", usuario: "Andrés Paredes", email: "andres.p@mail.com", pack: "Pro", monto: 9000, provincia: "Córdoba" },
  { id: "v047", fecha: "2026-04-07", usuario: "Rosa Mendoza", email: "rosa.m@mail.com", pack: "Popular", monto: 5000, provincia: "Buenos Aires" },
  { id: "v048", fecha: "2026-04-09", usuario: "Roberto Gallardo", email: "rober.g@mail.com", pack: "Starter", monto: 2000, provincia: "Chaco" },
  { id: "v049", fecha: "2026-04-11", usuario: "Patricia Salinas", email: "patri.s@mail.com", pack: "Popular", monto: 5000, provincia: "Mendoza" },
  { id: "v050", fecha: "2026-04-13", usuario: "Hugo Castillo", email: "hugo.c@mail.com", pack: "Starter", monto: 2000, provincia: "Buenos Aires" },
  { id: "v051", fecha: "2026-04-15", usuario: "Viviana Lara", email: "vivi.l@mail.com", pack: "Pro", monto: 9000, provincia: "CABA" },
  { id: "v052", fecha: "2026-04-17", usuario: "Osvaldo Serrano", email: "osval.s@mail.com", pack: "Popular", monto: 5000, provincia: "Santa Fe" },
  { id: "v053", fecha: "2026-04-19", usuario: "Mónica Ávila", email: "moni.a@mail.com", pack: "Starter", monto: 2000, provincia: "Tucumán" },
  { id: "v054", fecha: "2026-04-21", usuario: "Claudio Ibáñez", email: "clau.i@mail.com", pack: "Popular", monto: 5000, provincia: "Córdoba" },
  { id: "v055", fecha: "2026-04-23", usuario: "Noemí Valdez", email: "noemi.v@mail.com", pack: "Starter", monto: 2000, provincia: "Buenos Aires" },
  { id: "v056", fecha: "2026-04-25", usuario: "Walter Montes", email: "walter.m@mail.com", pack: "Pro", monto: 9000, provincia: "Río Negro" },
  { id: "v057", fecha: "2026-04-27", usuario: "Elena Carvajal", email: "elena.c@mail.com", pack: "Popular", monto: 5000, provincia: "CABA" },
  { id: "v058", fecha: "2026-04-29", usuario: "Rubén Peña", email: "ruben.p@mail.com", pack: "Starter", monto: 2000, provincia: "Buenos Aires" },
  { id: "v059", fecha: "2026-05-01", usuario: "Alicia Mora", email: "alicia.m@mail.com", pack: "Popular", monto: 5000, provincia: "Córdoba" },
  { id: "v060", fecha: "2026-05-02", usuario: "Enzo Portillo", email: "enzo.p@mail.com", pack: "Starter", monto: 2000, provincia: "Buenos Aires" },
  { id: "v061", fecha: "2026-05-03", usuario: "Laura Cárdenas", email: "lau.c@mail.com", pack: "Pro", monto: 9000, provincia: "CABA" },
  { id: "v062", fecha: "2026-05-04", usuario: "Axel Villanueva", email: "axel.v@mail.com", pack: "Popular", monto: 5000, provincia: "Santa Fe" },
  { id: "v063", fecha: "2026-05-05", usuario: "Verónica Escobar", email: "vero.e@mail.com", pack: "Starter", monto: 2000, provincia: "Mendoza" },
  { id: "v064", fecha: "2026-05-06", usuario: "Mauricio Hurtado", email: "mauri.h@mail.com", pack: "Popular", monto: 5000, provincia: "Buenos Aires" },
  { id: "v065", fecha: "2026-05-07", usuario: "Adrián Quintero", email: "adri.q@mail.com", pack: "Pro", monto: 9000, provincia: "Tucumán" },
  { id: "v066", fecha: "2026-05-07", usuario: "Natalia Rivas", email: "nati.riv@mail.com", pack: "Popular", monto: 5000, provincia: "CABA" },
  { id: "v067", fecha: "2026-05-08", usuario: "Gabriel Soto", email: "gabi.s@mail.com", pack: "Starter", monto: 2000, provincia: "Entre Ríos" },
  { id: "v068", fecha: "2026-05-08", usuario: "Marcela Figueroa", email: "marce.f@mail.com", pack: "Popular", monto: 5000, provincia: "Buenos Aires" },
  { id: "v069", fecha: "2026-05-08", usuario: "Arturo Zamora", email: "artu.z@mail.com", pack: "Starter", monto: 2000, provincia: "Córdoba" },
  { id: "v070", fecha: "2026-05-08", usuario: "Beatriz Montoya", email: "bea.m@mail.com", pack: "Popular", monto: 5000, provincia: "Santa Fe" },
  { id: "v071", fecha: "2026-05-08", usuario: "Ramón Ibarra", email: "ramon.i@mail.com", pack: "Pro", monto: 9000, provincia: "Buenos Aires" },
  { id: "v072", fecha: "2026-05-08", usuario: "Cecilia Bravo", email: "ceci.b@mail.com", pack: "Starter", monto: 2000, provincia: "Corrientes" },
  { id: "v073", fecha: "2026-05-08", usuario: "Óscar Fuentes", email: "oscar.f@mail.com", pack: "Popular", monto: 5000, provincia: "Jujuy" },
  { id: "v074", fecha: "2026-05-08", usuario: "Inés Salamanca", email: "ines.s@mail.com", pack: "Starter", monto: 2000, provincia: "San Juan" },
  { id: "v075", fecha: "2026-05-08", usuario: "Lorenzo Ponce", email: "loren.p@mail.com", pack: "Popular", monto: 5000, provincia: "Buenos Aires" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatARS(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function KpiCard({
  title,
  value,
  sub,
  gradient,
  icon,
}: {
  title: string;
  value: string;
  sub: string;
  gradient: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-5 text-white shadow-lg"
      style={{ background: gradient }}
    >
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
      <div className="relative">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20">
          {icon}
        </div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">{title}</p>
        <p className="mt-1 text-2xl font-black tracking-tight">{value}</p>
        <p className="mt-1 text-[11px] text-white/60">{sub}</p>
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-white/60 bg-white/90 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="font-bold text-slate-700">{label}</p>
      <p className="mt-0.5 font-black text-orange-600">{formatARS(payload[0].value ?? 0)}</p>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
const PAGE_SIZE = 15;

export default function VentasPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("")
  const [provincia, setProvincia] = useState("Todas las provincias");
  const [tablePage, setTablePage] = useState(1);

  const hasFilters = !!(dateFrom || dateTo || provincia !== "Todas las provincias");

  const filtered = useMemo(() => {
    return MOCK_VENTAS.filter((v) => {
      if (provincia !== "Todas las provincias" && v.provincia !== provincia) return false;
      if (dateFrom && v.fecha < dateFrom) return false;
      if (dateTo && v.fecha > dateTo) return false;
      return true;
    }).sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [dateFrom, dateTo, provincia]);

  // KPIs
  const totalRevenue = useMemo(() => filtered.reduce((s, v) => s + v.monto, 0), [filtered]);
  const totalTx = filtered.length;
  const avgTicket = totalTx > 0 ? Math.round(totalRevenue / totalTx) : 0;
  const topProvincia = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((v) => { map[v.provincia] = (map[v.provincia] || 0) + v.monto; });
    return Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  }, [filtered]);

  // Bar chart — provinces when global, pack breakdown when province is filtered
  const isProvinceFiltered = provincia !== "Todas las provincias";
  const barData = useMemo(() => {
    if (isProvinceFiltered) {
      const map: Record<string, number> = { Starter: 0, Popular: 0, Pro: 0 };
      filtered.forEach((v) => { map[v.pack] += v.monto; });
      return Object.entries(map).map(([name, total]) => ({ name, total }));
    }
    const map: Record<string, number> = {};
    filtered.forEach((v) => { map[v.provincia] = (map[v.provincia] || 0) + v.monto; });
    return Object.entries(map)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [filtered, isProvinceFiltered]);

  // Line chart — monthly trend
  const trendData = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((v) => {
      const month = v.fecha.slice(0, 7);
      map[month] = (map[month] || 0) + v.monto;
    });
    return Object.entries(map)
      .sort()
      .map(([key, total]) => ({
        label: new Date(key + "-01").toLocaleDateString("es-AR", { month: "short", year: "2-digit" }),
        total,
      }));
  }, [filtered]);

  // Table pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedRows = filtered.slice((tablePage - 1) * PAGE_SIZE, tablePage * PAGE_SIZE);

  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setProvincia("Todas las provincias");
    setTablePage(1);
  };

  const handleProvinceChange = (v: string) => {
    setProvincia(v);
    setTablePage(1);
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-[radial-gradient(circle_at_top_left,_rgba(255,122,26,0.18),_transparent_24%),linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(255,255,255,0.78))] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
        <div className="absolute -right-12 top-0 h-40 w-40 rounded-full bg-[#ff7a1a]/10 blur-3xl" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-orange-500">PawMatch Admin</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Ventas & Ingresos</h1>
            <p className="mt-2 text-sm text-slate-500">
              Historial de compras de Patitas — filtrá por fecha y provincia
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-700 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            {totalTx} transacciones
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          title="Total ingresos"
          value={formatARS(totalRevenue)}
          sub={`${totalTx} transacciones`}
          gradient="linear-gradient(135deg, #059669, #047857)"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KpiCard
          title="Transacciones"
          value={totalTx.toLocaleString("es-AR")}
          sub="en el período seleccionado"
          gradient="linear-gradient(135deg, #2563EB, #1d4ed8)"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <KpiCard
          title="Ticket promedio"
          value={formatARS(avgTicket)}
          sub="por transacción"
          gradient="linear-gradient(135deg, #7C3AED, #6d28d9)"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
        />
        <KpiCard
          title="Provincia top"
          value={topProvincia}
          sub="mayor volumen de ingresos"
          gradient="linear-gradient(135deg, #FF7A1A, #FF5B45)"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
      </div>

      {/* ── Filters ── */}
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-black text-slate-700">Filtros</p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500 transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpiar filtros
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Desde</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setTablePage(1); }}
              className="input h-10 min-w-[160px] text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Hasta</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setTablePage(1); }}
              className="input h-10 min-w-[160px] text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Provincia</label>
            <select
              value={provincia}
              onChange={(e) => handleProvinceChange(e.target.value)}
              className="input h-10 min-w-[220px] cursor-pointer text-sm"
            >
              {PROVINCIAS_ARG.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          {hasFilters && (
            <div className="flex h-10 items-center rounded-2xl border border-orange-200 bg-orange-50 px-3 text-[11px] font-bold text-orange-600">
              {totalTx} resultado{totalTx !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      {/* ── Charts ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Bar chart */}
        <div className="card p-5">
          <p className="mb-4 text-sm font-black text-slate-700">
            {isProvinceFiltered ? `Ingresos por pack — ${provincia}` : "Top provincias por ingreso"}
          </p>
          {barData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-slate-400">
              Sin datos para el período seleccionado
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 4, right: 4, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  width={44}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="total"
                  radius={[6, 6, 0, 0]}
                  fill="url(#barGrad)"
                />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF7A1A" />
                    <stop offset="100%" stopColor="#FF5B45" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Line chart */}
        <div className="card p-5">
          <p className="mb-4 text-sm font-black text-slate-700">Tendencia mensual de ingresos</p>
          {trendData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-slate-400">
              Sin datos para el período seleccionado
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 700 }} />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  width={44}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#FF7A1A"
                  strokeWidth={3}
                  dot={{ fill: "#FF7A1A", r: 4 }}
                  activeDot={{ r: 6, fill: "#FF5B45" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <p className="text-sm font-black text-slate-700">Historial de compras</p>
          <p className="text-[11px] text-slate-400">
            {filtered.length} registro{filtered.length !== 1 ? "s" : ""}
            {totalPages > 1 && ` · pág. ${tablePage}/${totalPages}`}
          </p>
        </div>

        {paginatedRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-sm text-slate-400">
            <svg className="h-10 w-10 text-slate-200" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            No hay compras para los filtros aplicados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Usuario</th>
                  <th className="hidden px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 md:table-cell">Email</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Pack</th>
                  <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Monto</th>
                  <th className="hidden px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 lg:table-cell">Provincia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedRows.map((v) => (
                  <tr key={v.id} className="transition-colors hover:bg-orange-50/30">
                    <td className="px-6 py-3.5 text-[13px] font-semibold text-slate-500">{formatDate(v.fecha)}</td>
                    <td className="px-6 py-3.5">
                      <p className="text-[13px] font-bold text-slate-800">{v.usuario}</p>
                    </td>
                    <td className="hidden px-6 py-3.5 text-[12px] text-slate-400 md:table-cell">{v.email}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${PACK_BADGE[v.pack]}`}>
                        {v.pack}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="text-[13px] font-black text-slate-800">{formatARS(v.monto)}</span>
                    </td>
                    <td className="hidden px-6 py-3.5 text-[12px] text-slate-500 lg:table-cell">{v.provincia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
            <button
              onClick={() => setTablePage((p) => Math.max(1, p - 1))}
              disabled={tablePage === 1}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-slate-500 transition-all hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const p = totalPages <= 7 ? i + 1 : i < 3 ? i + 1 : i === 3 ? tablePage : totalPages - (6 - i);
                return (
                  <button
                    key={p}
                    onClick={() => setTablePage(p)}
                    className={`h-7 w-7 rounded-xl text-[12px] font-bold transition-all ${
                      tablePage === p
                        ? "bg-gradient-to-r from-[#ff7a1a] to-[#ff5b45] text-white shadow-md"
                        : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setTablePage((p) => Math.min(totalPages, p + 1))}
              disabled={tablePage === totalPages}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-slate-500 transition-all hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
