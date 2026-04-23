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
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
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
      <div className="min-h-screen bg-[#1A1208] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1208] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#FF6B00] mb-4 shadow-lg shadow-orange-900/40">
            <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white">
              <path d="M4.5 10.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5S6 8.2 6 9s-.7 1.5-1.5 1.5zm3-5C6.7 5.5 6 4.8 6 4s.7-1.5 1.5-1.5S9 3.2 9 4s-.7 1.5-1.5 1.5zm5 0C11.7 5.5 11 4.8 11 4s.7-1.5 1.5-1.5S14 3.2 14 4s-.7 1.5-1.5 1.5zm3 5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5S18 8.2 18 9s-.7 1.5-1.5 1.5zm-5.5 1.5c-2.8 0-5 1.8-5 4 0 2.5 2.4 4.5 5 4.5s5-2 5-4.5c0-2.2-2.2-4-5-4z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">PawMatch Admin</h1>
          <p className="text-[#9CA3AF] text-sm">Centro de monitoreo</p>
        </div>

        {/* Card */}
        <div className="bg-[#2D1B0E] rounded-3xl p-8 shadow-2xl border border-[#3D2A18]">
          <h2 className="text-white text-xl font-semibold mb-2">Bienvenido</h2>
          <p className="text-[#9CA3AF] text-sm mb-8 leading-relaxed">
            Acceso restringido. Iniciá sesión con la cuenta de Google autorizada.
          </p>

          {error && (
            <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-3 mb-5 flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-3 bg-white rounded-xl py-3.5 px-6">
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-700 font-semibold text-sm">Verificando acceso...</span>
            </div>
          ) : (
            <div ref={btnRef} className="flex justify-center min-h-[44px] items-center" />
          )}

          <p className="text-center text-[#6B5744] text-xs mt-5">
            Solo <span className="text-[#FF9A3C]">nahundeveloper@gmail.com</span> tiene acceso
          </p>
        </div>

        <p className="text-center text-[#6B5744] text-xs mt-6">
          © 2025 PawMatch · Centro de monitoreo interno
        </p>
      </div>
    </div>
  );
}
