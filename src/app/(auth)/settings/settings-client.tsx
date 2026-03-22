"use client";

import { User, Mail, Settings } from "lucide-react";

interface SettingsClientProps {
  user: {
    name: string;
    email: string;
    image: string;
  };
  profile: any;
}

export function SettingsClient({ user, profile }: SettingsClientProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuracoes</h1>
        <p className="text-sm text-foreground-muted">
          Gerencie suas preferencias e perfil.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Perfil
        </h2>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                {user.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
            <div>
              <p className="font-medium text-foreground">{user.name}</p>
              <p className="text-sm text-foreground-muted flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Preferencias
        </h2>
        <p className="text-sm text-foreground-muted">
          Em breve voce podera personalizar suas preferencias aqui.
        </p>
      </div>
    </div>
  );
}
