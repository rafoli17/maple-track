export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Maple Leaf Icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L9.5 7.5L4 6L6.5 11L2 13L7 14L5.5 19L10 16.5L12 22L14 16.5L18.5 19L17 14L22 13L17.5 11L20 6L14.5 7.5L12 2Z" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Maple<span className="text-primary">Track</span>
        </h1>

        <p className="max-w-md text-foreground-muted">
          Seu GPS para imigrar para o Canad&aacute;. O primeiro sistema que guia
          casais e fam&iacute;lias em cada etapa &mdash; da an&aacute;lise de
          perfil at&eacute; a cidadania canadense.
        </p>

        <div className="flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm text-foreground-dim">
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          Em desenvolvimento...
        </div>
      </div>
    </div>
  );
}
