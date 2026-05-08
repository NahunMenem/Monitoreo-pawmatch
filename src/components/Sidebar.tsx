"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

const NAV = [
  {
    href: "/dashboard",
    exact: true,
    label: "Dashboard",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/usuarios",
    label: "Usuarios",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/patitas",
    label: "Patitas & Packs",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3"/>
        <path strokeLinecap="round" d="M8.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM15.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/ventas",
    label: "Ventas & Ingresos",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
    ),
  },
];

const NAV_MASCOTAS = [
  {
    href: "/dashboard/mascotas",
    label: "Buscando Pareja",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/adopciones",
    label: "En Adopción",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/perdidos",
    label: "Mascotas Perdidas",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="z-40 flex w-full flex-col bg-[#0B0705] px-4 pb-4 pt-4 text-white shadow-[0_24px_80px_rgba(11,7,5,0.42)] lg:fixed lg:inset-y-0 lg:left-0 lg:min-h-screen lg:w-72 lg:border-r lg:border-white/8 lg:px-4 lg:pb-4 lg:pt-5">
      {/* Logo */}
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <Image
          src="https://res.cloudinary.com/dqsacd9ez/image/upload/v1776962385/PawMatch_2_wzj2kr.png"
          alt="PawMatch"
          width={156}
          height={46}
          className="h-10 w-auto object-contain"
          unoptimized
        />
        <p className="ml-0.5 mt-2 text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">Admin Center</p>
        <p className="mt-3 max-w-[190px] text-[12px] leading-5 text-white/55">
          Controlá usuarios, Patitas y actividad crítica desde un solo panel.
        </p>
      </div>

      {/* Nav */}
      <nav className="grid grid-cols-1 gap-1 px-2 py-5 sm:grid-cols-2 lg:flex lg:flex-1 lg:flex-col">
        {NAV.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[13px] font-bold transition-all ${
                active
                  ? "bg-gradient-to-r from-[#ff7a1a] to-[#ff5b45] text-white shadow-[0_18px_34px_rgba(255,107,53,0.28)]"
                  : "text-white/55 hover:bg-white/6 hover:text-white/85"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}

        <div className="px-3 pb-1 pt-6">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-white/22">Mascotas</p>
        </div>
        {NAV_MASCOTAS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[13px] font-bold transition-all ${
                active
                  ? "bg-gradient-to-r from-[#ff7a1a] to-[#ff5b45] text-white shadow-[0_18px_34px_rgba(255,107,53,0.28)]"
                  : "text-white/55 hover:bg-white/6 hover:text-white/85"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
        <div className="px-3 pb-1 pt-6">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-white/22">Sistema</p>
        </div>
        <a
          href="https://petmatch-back-production.up.railway.app/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-[13px] font-bold text-white/45 transition-all hover:bg-white/6 hover:text-white/78"
        >
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
          </svg>
          API Docs
        </a>
      </nav>

      {/* User */}
      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:mt-auto">
        <div className="group mb-2 flex cursor-default items-center gap-3 rounded-2xl px-2 py-2.5 transition-all hover:bg-white/5">
          {session?.user?.image ? (
            <Image src={session.user.image} alt="avatar" width={28} height={28}
              className="rounded-full ring-2 ring-[#FF6B00]/60" unoptimized />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#ff7a1a] to-[#ff5b45] text-xs font-black text-white">
              {session?.user?.name?.[0] ?? "A"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="truncate text-[12px] font-bold text-white/82">{session?.user?.name ?? "Admin"}</p>
            <p className="truncate text-[10px] text-white/32">{session?.user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-[12px] font-bold text-white/45 transition-all hover:bg-white/6 hover:text-white/78"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
