import Link from "next/link";
import { MapleLeaf } from "@/components/ui/maple-leaf";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8 text-center">
        {/* Maple Leaf Icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MapleLeaf size={48} />
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Maple<span className="text-primary">Track</span>
        </h1>

        <p className="max-w-md text-foreground-muted">
          Seu GPS para imigrar para o Canad&aacute;. O primeiro sistema que guia
          casais e fam&iacute;lias em cada etapa &mdash; da an&aacute;lise de
          perfil at&eacute; a cidadania canadense.
        </p>

        <Link
          href="/login"
          className="rounded-xl bg-primary px-8 py-3 text-lg font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
        >
          Começar agora
        </Link>

        <p className="text-xs text-foreground-dim">
          Gratuito para casais &bull; Login com Google ou Email
        </p>
      </div>
    </div>
  );
}
