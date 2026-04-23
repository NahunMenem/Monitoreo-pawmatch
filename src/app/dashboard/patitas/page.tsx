"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getPatitasPacks, getPublicPacks, updatePatitasPack } from "@/lib/api";
import { PatitasPack } from "@/lib/types";

const PACK_META: Record<string, { gradient: string; accent: string; label: string }> = {
  starter: { gradient: "linear-gradient(135deg,#D1FAE5,#6EE7B7)", accent: "#059669", label: "Básico" },
  popular: { gradient: "linear-gradient(135deg,#FFF0E6,#FFD6B3)", accent: "#FF6B00", label: "Popular ⭐" },
  pro:     { gradient: "linear-gradient(135deg,#EDE9FE,#C4B5FD)", accent: "#7C3AED", label: "Pro 🚀" },
};
function getMeta(id: string) {
  return PACK_META[id] ?? { gradient: "linear-gradient(135deg,#F3F4F6,#E5E7EB)", accent: "#6B7280", label: id };
}

export default function PatitasPage() {
  const { data: session } = useSession();
  const [packs, setPacks] = useState<PatitasPack[]>([]);
  const [editing, setEditing] = useState<Record<string, PatitasPack>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [flash, setFlash] = useState<Record<string, "ok" | "err">>({});
  const [loading, setLoading] = useState(true);
  const [adminMode, setAdminMode] = useState(false);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getPatitasPacks(session?.backendToken ?? "");
        setPacks(data); setAdminMode(true);
      } catch {
        try {
          const data = await getPublicPacks();
          setPacks(data); setAdminMode(false);
          setWarning("Modo lectura — instalá el admin_router.py para editar precios.");
        } catch { setPacks([]); }
      } finally { setLoading(false); }
    })();
  }, [session]);

  const cur = (p: PatitasPack) => editing[p.id] ?? p;
  const totalPat = (p: PatitasPack) => Number(cur(p).base_patitas) + Number(cur(p).bonus_patitas);

  function startEdit(p: PatitasPack) { setEditing((e) => ({ ...e, [p.id]: { ...p } })); }
  function cancelEdit(id: string) { setEditing((e) => { const n = { ...e }; delete n[id]; return n; }); }
  function onChange(id: string, k: keyof PatitasPack, v: string | number | boolean) {
    setEditing((e) => ({ ...e, [id]: { ...e[id], [k]: v } }));
  }

  async function save(id: string) {
    const updated = editing[id]; if (!updated) return;
    setSaving((s) => ({ ...s, [id]: true }));
    try {
      const result = await updatePatitasPack(session?.backendToken ?? "", id, {
        name: updated.name, price: Number(updated.price),
        base_patitas: Number(updated.base_patitas),
        bonus_patitas: Number(updated.bonus_patitas),
        is_active: updated.is_active,
      });
      setPacks((prev) => prev.map((p) => (p.id === id ? result : p)));
      cancelEdit(id);
      setFlash((f) => ({ ...f, [id]: "ok" }));
      setTimeout(() => setFlash((f) => { const n = { ...f }; delete n[id]; return n; }), 2000);
    } catch {
      setFlash((f) => ({ ...f, [id]: "err" }));
      setTimeout(() => setFlash((f) => { const n = { ...f }; delete n[id]; return n; }), 3000);
    } finally { setSaving((s) => ({ ...s, [id]: false })); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Patitas & Packs</h1>
          <p className="text-gray-400 text-xs mt-0.5">Precios y cantidades de Patitas por paquete</p>
        </div>
        {adminMode && (
          <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Modo edición activo
          </span>
        )}
      </div>

      {warning && (
        <div className="card p-4 flex items-start gap-3 border-amber-200 bg-amber-50">
          <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p className="text-sm text-amber-800">{warning}</p>
        </div>
      )}

      {/* Summary */}
      {!loading && packs.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Packs activos", value: packs.filter((p) => p.is_active).length, icon: "📦" },
            { label: "Precio mínimo", value: `$${Math.min(...packs.map((p) => p.price)).toLocaleString("es-AR")}`, icon: "💰" },
            { label: "Máximo total 🐾", value: Math.max(...packs.map((p) => p.base_patitas + p.bonus_patitas)).toLocaleString("es-AR"), icon: "🐾" },
          ].map((s) => (
            <div key={s.label} className="card p-4 flex items-center gap-4">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Packs */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse space-y-4">
              <div className="h-10 w-full bg-gray-100 rounded-xl" />
              <div className="h-8 w-24 bg-gray-100 rounded-lg" />
              <div className="h-4 w-full bg-gray-50 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {packs.map((pack) => {
            const isEditing = !!editing[pack.id];
            const c = cur(pack);
            const meta = getMeta(pack.id);

            return (
              <div key={pack.id}
                className={`card overflow-hidden transition-all ${isEditing ? "ring-2 ring-[#FF6B00] shadow-lg shadow-orange-100" : ""}`}>
                {/* Header */}
                <div className="p-5" style={{ background: meta.gradient }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge" style={{ background: `${meta.accent}20`, color: meta.accent }}>
                      {meta.label}
                    </span>
                    {adminMode && (
                      <button
                        onClick={() => onChange(pack.id, "is_active", !c.is_active)}
                        className={`w-9 h-5 rounded-full relative transition-colors ${c.is_active ? "bg-[#FF6B00]" : "bg-gray-300"}`}
                        title={c.is_active ? "Desactivar" : "Activar"}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${c.is_active ? "left-4" : "left-0.5"}`} />
                      </button>
                    )}
                    {!adminMode && (
                      <span className={`badge ${pack.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {pack.is_active ? "Activo" : "Inactivo"}
                      </span>
                    )}
                  </div>
                  {isEditing ? (
                    <input value={c.name} onChange={(e) => onChange(pack.id, "name", e.target.value)}
                      className="input text-lg font-bold bg-white/80 backdrop-blur" />
                  ) : (
                    <h3 className="text-xl font-bold text-gray-900">{c.name}</h3>
                  )}
                  <p className="text-[11px] text-gray-500 mt-0.5 font-mono">id: {pack.id}</p>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                  {/* Price */}
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Precio ARS</p>
                    {isEditing ? (
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
                        <input type="number" value={c.price} min={0}
                          onChange={(e) => onChange(pack.id, "price", e.target.value)}
                          className="input pl-7 text-xl font-bold" />
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">${c.price.toLocaleString("es-AR")}</p>
                    )}
                  </div>

                  {/* Patitas */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Base 🐾</p>
                      {isEditing ? (
                        <input type="number" value={c.base_patitas} min={0}
                          onChange={(e) => onChange(pack.id, "base_patitas", e.target.value)}
                          className="input font-bold" />
                      ) : (
                        <p className="text-xl font-bold" style={{ color: meta.accent }}>{c.base_patitas}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Bonus 🐾</p>
                      {isEditing ? (
                        <input type="number" value={c.bonus_patitas} min={0}
                          onChange={(e) => onChange(pack.id, "bonus_patitas", e.target.value)}
                          className="input font-bold" />
                      ) : (
                        <p className="text-xl font-bold text-gray-400">+{c.bonus_patitas}</p>
                      )}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                    <span className="text-xs text-gray-500 font-medium">Total Patitas</span>
                    <span className="font-bold text-base" style={{ color: meta.accent }}>{totalPat(pack)} 🐾</span>
                  </div>

                  {/* Flash */}
                  {flash[pack.id] === "ok" && (
                    <p className="text-xs text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2 flex items-center gap-1.5 font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      Guardado correctamente
                    </p>
                  )}
                  {flash[pack.id] === "err" && (
                    <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">Error al guardar — verificá el backend admin</p>
                  )}
                </div>

                {/* Actions */}
                {adminMode && (
                  <div className="px-5 pb-5 flex gap-2.5">
                    {isEditing ? (
                      <>
                        <button onClick={() => save(pack.id)} disabled={saving[pack.id]}
                          className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
                          {saving[pack.id]
                            ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                          }
                          {saving[pack.id] ? "Guardando..." : "Guardar"}
                        </button>
                        <button onClick={() => cancelEdit(pack.id)} className="btn-ghost px-4">Cancelar</button>
                      </>
                    ) : (
                      <button onClick={() => startEdit(pack)}
                        className="w-full flex items-center justify-center gap-2 text-[13px] font-medium text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-gray-300 rounded-xl py-2.5 transition-all bg-white hover:bg-gray-50">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        Editar
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Info */}
      <div className="card p-5 border-blue-100 bg-blue-50/50">
        <p className="text-xs font-semibold text-blue-700 mb-2">¿Cómo funcionan los packs?</p>
        <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside leading-relaxed">
          <li><strong>Precio</strong>: lo que paga el usuario en pesos argentinos (ARS) con Mercado Pago</li>
          <li><strong>Patitas base</strong>: cantidad que recibe al pagar</li>
          <li><strong>Bonus</strong>: Patitas extra como incentivo (aparecen en la app como "¡X Patitas de regalo!")</li>
          <li>Los cambios se reflejan en la app móvil inmediatamente</li>
        </ul>
      </div>
    </div>
  );
}
