"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { GrowthDataPoint } from "@/lib/types";

export default function GrowthChart({ data }: { data: GrowthDataPoint[] }) {
  const hasData =
    data.length > 0 &&
    data.some((d) => d.usuarios > 0 || d.mascotas > 0 || d.matches > 0);

  return (
    <div className="card p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-slate-900">Crecimiento de la app</p>
          <p className="mt-0.5 text-xs text-slate-400">Ultimas 8 semanas</p>
        </div>
        {!hasData && (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-black text-amber-600">
            Sin datos - backend pendiente
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={hasData ? data : []}
          margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EBF0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.8)",
              boxShadow: "0 18px 40px rgba(15,23,42,0.12)",
              fontSize: 12,
              background: "rgba(255,255,255,0.94)",
            }}
            labelStyle={{
              fontWeight: 800,
              color: "#0F172A",
              marginBottom: 4,
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: 12, fontSize: 11 }}
            formatter={(value) => <span className="font-bold text-slate-500">{value}</span>}
          />
          <Line
            type="monotone"
            dataKey="usuarios"
            name="Usuarios"
            stroke="#FF6B00"
            strokeWidth={2.4}
            dot={{ r: 3, fill: "#FF6B00", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="mascotas"
            name="Mascotas"
            stroke="#7C3AED"
            strokeWidth={2.4}
            dot={{ r: 3, fill: "#7C3AED", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="matches"
            name="Matches"
            stroke="#0F9D8F"
            strokeWidth={2.4}
            dot={{ r: 3, fill: "#0F9D8F", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
