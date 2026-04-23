"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
    handleGoogleCredential: (response: { credential: string }) => void;
  }
}

const LOGO_URL =
  "https://res.cloudinary.com/dqsacd9ez/image/upload/v1776962385/PawMatch_1_yodapx.png";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const btnRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) router.replace("/dashboard");
  }, [session, router]);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || !btnRef.current) return;

    window.handleGoogleCredential = async (response: { credential: string }) => {
      setLoading(true);
      setError("");
      const result = await signIn("google-idtoken", {
        idToken: response.credential,
        redirect: false,
        callbackUrl: "/dashboard",
      });
      if (result?.error) {
        setError("Acceso denegado. Solo nahundeveloper@gmail.com puede ingresar.");
        setLoading(false);
      } else if (result?.url) {
        router.replace(result.url);
      }
    };

    const loadGIS = () => {
      if (!window.google || !btnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: window.handleGoogleCredential,
        auto_select: false,
      });
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: "filled_black",
        size: "large",
        text: "signin_with",
        shape: "pill",
        width: "320",
        logo_alignment: "left",
      });
    };

    if (window.google) {
      loadGIS();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = loadGIS;
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    }
  }, [router, status]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#ff6b00] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,107,0,0.18),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_24%)]" />
      <div className="absolute left-1/2 top-[-12rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#ff6b00]/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-5 py-10">
        <div className="grid w-full max-w-5xl gap-8 overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr] lg:p-6">
          <section className="relative overflow-hidden rounded-[30px] border border-white/8 bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-7 sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,107,0,0.18),_transparent_26%)]" />
            <div className="relative">
              <img
                src={LOGO_URL}
                alt="PawMatch"
                className="h-auto w-[220px] max-w-full drop-shadow-[0_18px_40px_rgba(255,107,0,0.22)] sm:w-[280px]"
              />
              <p className="mt-6 inline-flex rounded-full border border-[#ff6b00]/30 bg-[#ff6b00]/12 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#ffb26f]">
                Monitoreo privado
              </p>
              <h1 className="mt-6 max-w-md text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-5xl">
                Controla ventas, usuarios y actividad desde un panel serio.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/68 sm:text-[15px]">
                Acceso interno de PawMatch para ver ingresos por Mercado Pago, gestionar usuarios y
                seguir el pulso real de la plataforma.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Ingresos", value: "Mercado Pago" },
                  { label: "Acceso", value: "Google seguro" },
                  { label: "Panel", value: "Tiempo real" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/8 bg-black/30 px-4 py-4"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/42">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex items-center">
            <div className="w-full rounded-[30px] border border-white/8 bg-[#0d0d0d] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-9">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#ffb26f]">
                Acceso protegido
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
                Ingresar al admin
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/62">
                Inicia sesión con la cuenta autorizada para administrar ingresos, Patitas y usuarios.
              </p>

              {error && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-500/25 bg-red-500/10 p-4">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <div className="mt-8 rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                {loading ? (
                  <div className="flex items-center justify-center gap-3 rounded-2xl bg-white py-3.5 px-6">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                    <span className="text-sm font-semibold text-gray-700">Verificando acceso...</span>
                  </div>
                ) : (
                  <div ref={btnRef} className="flex min-h-[44px] items-center justify-center" />
                )}
              </div>

              <div className="mt-6 rounded-2xl border border-white/8 bg-black/30 px-4 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/42">
                  Cuenta habilitada
                </p>
                <p className="mt-2 text-sm text-white">
                  Solo <span className="font-semibold text-[#ffb26f]">nahundeveloper@gmail.com</span>
                </p>
              </div>

              <p className="mt-6 text-center text-xs text-white/35">
                © 2026 PawMatch · Admin Center
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
