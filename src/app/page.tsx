import Link from "next/link";
import { MapleLeaf } from "@/components/ui/maple-leaf";
import { HeroIllustration } from "@/components/illustrations";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      {/* Subtle background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-[#E31C5F]/[0.04] blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-[#008489]/[0.04] blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 md:flex-row md:gap-16 md:text-left">
        {/* Text content */}
        <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
          {/* Maple Leaf Icon - larger and more prominent */}
          <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-[#E31C5F]/[0.08] text-[#E31C5F] shadow-sm">
            <MapleLeaf size={64} />
          </div>

          <div className="flex flex-col items-center gap-4 md:items-start">
            <h1 className="text-5xl font-extrabold tracking-tight text-[#222222]">
              Maple<span className="text-[#E31C5F]">Track</span>
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-[#717171]">
              Seu GPS para imigrar para o Canad&aacute;. O primeiro sistema que
              guia casais e fam&iacute;lias em cada etapa &mdash; da
              an&aacute;lise de perfil at&eacute; a cidadania canadense.
            </p>
          </div>

          <Link
            href="/login"
            className="rounded-2xl bg-[#E31C5F] px-10 py-4 text-lg font-semibold text-white shadow-md shadow-[#E31C5F]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#d1185a] hover:shadow-lg hover:shadow-[#E31C5F]/30"
          >
            Começar agora
          </Link>

          <p className="text-sm text-[#717171]">
            Gratuito para casais &bull; Login com Google ou Email
          </p>
        </div>

        {/* Hero Illustration */}
        <div className="hidden md:block">
          <HeroIllustration width={320} />
        </div>
        <div className="mt-2 md:hidden">
          <HeroIllustration width={240} />
        </div>
      </div>
    </div>
  );
}
