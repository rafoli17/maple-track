"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { MapleLeaf } from "@/components/ui/maple-leaf";

function LoginContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const isVerify = searchParams.get("verify") === "true";
  const error = searchParams.get("error");

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl });
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    await signIn("resend", { email, callbackUrl });
    setEmailSent(true);
    setIsLoading(false);
  };

  if (isVerify || emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E31C5F]/[0.08] text-[#E31C5F] shadow-sm">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <h1 className="mb-3 text-2xl font-bold text-[#222222]">
            Verifique seu email
          </h1>
          <p className="text-[#717171]">
            Enviamos um link m&aacute;gico para o seu email. Clique no link para
            fazer login.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      {/* Background gradient effect */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-[#E31C5F]/[0.03] blur-3xl" />
        <div className="absolute -bottom-1/2 right-0 h-[600px] w-[600px] rounded-full bg-[#008489]/[0.03] blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E31C5F]/[0.08] text-[#E31C5F] shadow-sm">
            <MapleLeaf size={36} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#222222]">
            Maple<span className="text-[#E31C5F]">Track</span>
          </h1>
          <p className="text-center text-sm text-[#717171]">
            Seu GPS para imigrar para o Canad&aacute;
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="mb-1 text-center text-lg font-semibold text-[#222222]">
            Bem-vindo de volta
          </h2>
          <p className="mb-8 text-center text-sm text-[#717171]">
            Entre para acompanhar sua jornada
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error === "OAuthAccountNotLinked"
                ? "Este email j\u00e1 est\u00e1 associado a outra conta."
                : "Ocorreu um erro ao fazer login. Tente novamente."}
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#DDDDDD] bg-white px-4 py-3.5 text-sm font-medium text-[#222222] shadow-sm transition-all duration-200 hover:-translate-y-px hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
              />
            </svg>
            {isLoading ? "Conectando..." : "Continuar com Google"}
          </button>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#EBEBEB]" />
            <span className="text-xs font-medium text-[#717171]">ou</span>
            <div className="h-px flex-1 bg-[#EBEBEB]" />
          </div>

          {/* Email Sign In */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#222222]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-xl border border-[#DDDDDD] bg-white px-4 py-3 text-sm text-[#222222] placeholder:text-[#B0B0B0] transition-all focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full rounded-xl bg-[#E31C5F] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-px hover:bg-[#d1185a] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Enviando..." : "Enviar link m\u00e1gico"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-[#717171]">
          Ao entrar, voc&ecirc; concorda com nossos termos de uso e
          pol&iacute;tica de privacidade.
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E31C5F] border-t-transparent" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
