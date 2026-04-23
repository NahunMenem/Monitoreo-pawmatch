"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { addPatitasToUser, deleteUserCascade, getUsers } from "@/lib/api";
import { BackendUser } from "@/lib/types";

type PatitasModalState = {
  user: BackendUser;
  amount: string;
  reason: string;
} | null;

type DeleteModalState = {
  user: BackendUser;
  confirmText: string;
} | null;

const limit = 20;

function Avatar({ user, size = 44 }: { user: BackendUser; size?: number }) {
  if (user.photo_url) {
    return (
      <Image
        src={user.photo_url}
        alt={user.name}
        width={size}
        height={size}
        className="rounded-full object-cover"
        unoptimized
      />
    );
  }

  const colors = ["#FF7A1A", "#FF5B45", "#7C3AED", "#0F9D8F", "#2563EB"];
  const safeName = user.name?.trim() || user.email || "?";
  const color = colors[safeName.charCodeAt(0) % colors.length];

  return (
    <div
      className="flex items-center justify-center rounded-full text-sm font-black text-white"
      style={{ width: size, height: size, background: color }}
    >
      {safeName[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

function MetricPill({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: number;
  tone?: "slate" | "orange" | "rose";
}) {
  const classes =
    tone === "orange"
      ? "bg-orange-50 text-orange-700 border-orange-200"
      : tone === "rose"
        ? "bg-rose-50 text-rose-700 border-rose-200"
        : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${classes}`}>
      <span>{label}</span>
      <span>{value.toLocaleString("es-AR")}</span>
    </span>
  );
}

export default function UsuariosPage() {
  const { data: session } = useSession();

  const [users, setUsers] = useState<BackendUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [patitasModal, setPatitasModal] = useState<PatitasModalState>(null);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const pages = Math.max(1, Math.ceil(total / limit));

  const load = useCallback(async () => {
    if (!session?.backendToken) return;

    setLoading(true);
    setError("");

    try {
      const res = await getUsers(session.backendToken, page, limit, search || undefined);
      setUsers(res.users);
      setTotal(res.total);
    } catch {
      setError(
        "No se pudo cargar la lista de usuarios. Verificá que el backend admin esté activo."
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, session]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPatitas = useMemo(
    () => users.reduce((sum, user) => sum + (user.patitas || 0), 0),
    [users]
  );

  const totalPetsShown = useMemo(
    () => users.reduce((sum, user) => sum + (user.pets_count ?? 0), 0),
    [users]
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  async function handleAddPatitas() {
    if (!patitasModal || !session?.backendToken) return;

    const amount = parseInt(patitasModal.amount, 10);
    if (!amount || amount <= 0) {
      setSaveError("Ingresá una cantidad válida mayor a 0.");
      return;
    }

    setSaving(true);
    setSaveError("");
    setSaveSuccess("");

    try {
      const updated = await addPatitasToUser(
        session.backendToken,
        patitasModal.user.id,
        amount,
        patitasModal.reason || "Asignación manual admin"
      );

      setUsers((prev) =>
        prev.map((user) =>
          user.id === updated.id ? { ...user, patitas: updated.patitas } : user
        )
      );
      setSaveSuccess(`+${amount} Patitas cargadas a ${patitasModal.user.name}.`);
      setTimeout(() => {
        setPatitasModal(null);
        setSaveSuccess("");
      }, 1400);
    } catch {
      setSaveError("Error al asignar Patitas. Verificá el backend admin.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteUser() {
    if (!deleteModal || !session?.backendToken) return;
    if (deleteModal.confirmText.trim().toLowerCase() !== "eliminar") return;

    setDeleting(true);
    setSaveError("");
    setSaveSuccess("");

    try {
      await deleteUserCascade(session.backendToken, deleteModal.user.id);
      setUsers((prev) => prev.filter((user) => user.id !== deleteModal.user.id));
      setTotal((prev) => Math.max(0, prev - 1));
      setDeleteModal(null);
      setSaveSuccess(`Usuario ${deleteModal.user.name} eliminado con todas sus mascotas.`);
      setTimeout(() => setSaveSuccess(""), 2600);
    } catch {
      setSaveError(
        "No se pudo eliminar el usuario. Asegurate de tener actualizado el admin_router del backend."
      );
    } finally {
      setDeleting(false);
    }
  }

  const fmt = (value: string) =>
    new Date(value).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[34px] border border-white/70 bg-[radial-gradient(circle_at_top_left,_rgba(255,122,26,0.20),_transparent_28%),linear-gradient(135deg,_rgba(255,255,255,0.9),_rgba(255,255,255,0.76))] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
        <div className="absolute -right-12 top-0 h-40 w-40 rounded-full bg-[#ff7a1a]/10 blur-3xl" />
        <div className="absolute left-10 top-24 h-24 w-24 rounded-full bg-[#ff5b45]/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-orange-700">
              PawMatch Admin
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Gestión de usuarios con contexto real
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Buscá cuentas, cargá Patitas y eliminá usuarios junto con todas sus
              mascotas desde un panel mucho más claro.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="card min-w-[160px] p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                Usuarios
              </p>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {total.toLocaleString("es-AR")}
              </p>
              <p className="mt-1 text-xs text-slate-500">Total registrado</p>
            </div>
            <div className="card min-w-[160px] p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                Mascotas
              </p>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {totalPetsShown.toLocaleString("es-AR")}
              </p>
              <p className="mt-1 text-xs text-slate-500">En esta página</p>
            </div>
            <div className="card min-w-[160px] p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                Patitas
              </p>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {totalPatitas.toLocaleString("es-AR")}
              </p>
              <p className="mt-1 text-xs text-slate-500">Saldo visible</p>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="card flex items-start gap-3 border-amber-200 bg-amber-50/90 p-4">
          <div className="mt-0.5 rounded-full bg-amber-100 p-2 text-amber-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-amber-900">Atención</p>
            <p className="mt-1 text-sm text-amber-800">{error}</p>
          </div>
        </div>
      )}

      {(saveError || saveSuccess) && (
        <div
          className={`card flex items-start gap-3 p-4 ${
            saveError ? "border-rose-200 bg-rose-50/90" : "border-emerald-200 bg-emerald-50/90"
          }`}
        >
          <div
            className={`mt-0.5 rounded-full p-2 ${
              saveError ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {saveError ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              )}
            </svg>
          </div>
          <p className={`text-sm font-bold ${saveError ? "text-rose-800" : "text-emerald-800"}`}>
            {saveError || saveSuccess}
          </p>
        </div>
      )}

      <section className="card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black text-slate-900">Base de usuarios</p>
            <p className="mt-1 text-xs text-slate-500">
              Administrá cuentas, Patitas y limpieza completa de perfiles.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-xl">
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
              </svg>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar por nombre o email..."
                className="input pl-11"
              />
            </div>
            <button type="submit" className="btn-primary min-w-[120px]">
              Buscar
            </button>
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                  setPage(1);
                }}
                className="btn-ghost min-w-[110px]"
              >
                Limpiar
              </button>
            )}
          </form>
        </div>

        <div className="grid gap-3 border-b border-slate-100 bg-slate-50/75 px-5 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-slate-400 lg:grid-cols-[minmax(320px,1.8fr)_minmax(220px,1.2fr)_140px_160px_180px]">
          <span>Usuario</span>
          <span>Email</span>
          <span className="lg:text-right">Patitas</span>
          <span>Mascotas</span>
          <span className="lg:text-right">Acciones</span>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="grid animate-pulse gap-3 px-5 py-4 lg:grid-cols-[minmax(320px,1.8fr)_minmax(220px,1.2fr)_140px_160px_180px]"
              >
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-slate-200" />
                  <div className="space-y-2">
                    <div className="h-3.5 w-32 rounded-full bg-slate-200" />
                    <div className="h-3 w-20 rounded-full bg-slate-100" />
                  </div>
                </div>
                <div className="h-3.5 w-40 self-center rounded-full bg-slate-100" />
                <div className="h-3.5 w-16 self-center justify-self-end rounded-full bg-slate-100" />
                <div className="h-8 w-24 self-center rounded-full bg-slate-100" />
                <div className="ml-auto flex gap-2">
                  <div className="h-10 w-24 rounded-2xl bg-slate-100" />
                  <div className="h-10 w-20 rounded-2xl bg-slate-100" />
                </div>
              </div>
            ))
          ) : users.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <p className="text-base font-black text-slate-800">
                {search ? `Sin resultados para "${search}"` : "Todavía no hay usuarios"}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Probá con otro email, otro nombre o volvé a cargar la lista.
              </p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="grid gap-4 px-5 py-4 transition-colors hover:bg-white/60 lg:grid-cols-[minmax(320px,1.8fr)_minmax(220px,1.2fr)_140px_160px_180px]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-[22px] border border-white/80 bg-slate-50 p-1 shadow-sm">
                    <Avatar user={user} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-black text-slate-900">{user.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <MetricPill label="Alta" value={1} />
                      <span className="text-[12px] text-slate-500">{fmt(user.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-[13px] font-semibold text-slate-600">
                  <span className="truncate">{user.email}</span>
                </div>

                <div className="flex items-center lg:justify-end">
                  <div className="rounded-2xl bg-orange-50 px-3 py-2 text-right">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-orange-500">
                      Patitas
                    </p>
                    <p className="text-base font-black text-slate-900">
                      {user.patitas.toLocaleString("es-AR")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <MetricPill label="Mascotas" value={user.pets_count ?? 0} tone="orange" />
                  <MetricPill label="Perdidos" value={user.lost_reports_count ?? 0} />
                  <MetricPill label="Adopción" value={user.adoptions_count ?? 0} tone="rose" />
                </div>

                <div className="flex items-center justify-start gap-2 lg:justify-end">
                  <button
                    onClick={() => {
                      setPatitasModal({ user, amount: "", reason: "" });
                      setSaveError("");
                      setSaveSuccess("");
                    }}
                    className="btn-primary whitespace-nowrap px-4"
                  >
                    Cargar Patitas
                  </button>
                  <button
                    onClick={() => {
                      setDeleteModal({ user, confirmText: "" });
                      setSaveError("");
                      setSaveSuccess("");
                    }}
                    className="btn-danger whitespace-nowrap px-4"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {pages > 1 && (
          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Mostrando {((page - 1) * limit) + 1} a {Math.min(page * limit, total)} de{" "}
              <span className="font-black text-slate-800">{total.toLocaleString("es-AR")}</span> usuarios
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="btn-ghost disabled:opacity-40"
              >
                Anterior
              </button>
              <div className="rounded-2xl bg-white/75 px-4 py-2 text-sm font-black text-slate-700">
                {page} / {pages}
              </div>
              <button
                onClick={() => setPage((prev) => Math.min(pages, prev + 1))}
                disabled={page >= pages}
                className="btn-ghost disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </section>

      {patitasModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
          <div className="card w-full max-w-lg overflow-hidden">
            <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(255,122,26,0.10),rgba(255,91,69,0.05))] px-6 py-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-500">
                    Acción rápida
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-slate-900">
                    Cargar Patitas
                  </h3>
                </div>
                <button
                  onClick={() => setPatitasModal(null)}
                  className="rounded-full bg-white/80 p-2 text-slate-400 transition hover:text-slate-700"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-5 flex items-center gap-4 rounded-[24px] border border-white/80 bg-white/80 p-4">
                <Avatar user={patitasModal.user} size={54} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-black text-slate-900">{patitasModal.user.name}</p>
                  <p className="truncate text-sm text-slate-500">{patitasModal.user.email}</p>
                </div>
                <div className="rounded-2xl bg-orange-50 px-3 py-2 text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-500">Actual</p>
                  <p className="text-lg font-black text-slate-900">
                    {patitasModal.user.patitas.toLocaleString("es-AR")} 🐾
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  Cantidad
                </label>
                <input
                  type="number"
                  min="1"
                  autoFocus
                  placeholder="Ej: 100"
                  value={patitasModal.amount}
                  onChange={(e) =>
                    setPatitasModal({ ...patitasModal, amount: e.target.value })
                  }
                  className="input text-lg font-black"
                />
                {patitasModal.amount && parseInt(patitasModal.amount, 10) > 0 && (
                  <p className="mt-2 text-xs text-slate-500">
                    Nuevo balance estimado:{" "}
                    <span className="font-black text-slate-800">
                      {(patitasModal.user.patitas + parseInt(patitasModal.amount, 10)).toLocaleString("es-AR")} 🐾
                    </span>
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  Motivo
                </label>
                <input
                  type="text"
                  placeholder="Ej: compensación, promoción, premio..."
                  value={patitasModal.reason}
                  onChange={(e) =>
                    setPatitasModal({ ...patitasModal, reason: e.target.value })
                  }
                  className="input"
                />
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={handleAddPatitas}
                disabled={saving || !patitasModal.amount}
                className="btn-primary flex-1 disabled:opacity-55"
              >
                {saving ? "Asignando..." : "Asignar Patitas"}
              </button>
              <button onClick={() => setPatitasModal(null)} className="btn-ghost px-5">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="card w-full max-w-lg overflow-hidden">
            <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(255,91,91,0.12),rgba(229,57,53,0.06))] px-6 py-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-rose-500">
                    Acción crítica
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-slate-900">
                    Eliminar usuario
                  </h3>
                </div>
                <button
                  onClick={() => setDeleteModal(null)}
                  className="rounded-full bg-white/80 p-2 text-slate-400 transition hover:text-slate-700"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-5 rounded-[24px] border border-white/80 bg-white/85 p-4">
                <div className="flex items-center gap-4">
                  <Avatar user={deleteModal.user} size={54} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-black text-slate-900">
                      {deleteModal.user.name}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      {deleteModal.user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <MetricPill label="Mascotas" value={deleteModal.user.pets_count ?? 0} tone="orange" />
                  <MetricPill label="Perdidos" value={deleteModal.user.lost_reports_count ?? 0} />
                  <MetricPill label="Adopción" value={deleteModal.user.adoptions_count ?? 0} tone="rose" />
                </div>
              </div>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div className="rounded-[24px] border border-rose-200 bg-rose-50/90 p-4 text-sm leading-6 text-rose-900">
                Se eliminará la cuenta y también sus mascotas, likes, matches, chats,
                reportes de perdidos, publicaciones de adopción, notificaciones y tokens
                asociados. Esta acción no se puede deshacer.
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  Confirmación
                </label>
                <input
                  type="text"
                  value={deleteModal.confirmText}
                  onChange={(e) =>
                    setDeleteModal({ ...deleteModal, confirmText: e.target.value })
                  }
                  placeholder='Escribí "eliminar" para continuar'
                  className="input"
                />
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={handleDeleteUser}
                disabled={deleting || deleteModal.confirmText.trim().toLowerCase() !== "eliminar"}
                className="btn-danger flex-1 disabled:opacity-55"
              >
                {deleting ? "Eliminando..." : "Eliminar usuario y mascotas"}
              </button>
              <button onClick={() => setDeleteModal(null)} className="btn-ghost px-5">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
