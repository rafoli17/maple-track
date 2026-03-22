"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, UserPlus, Mail, User, Crown, Save } from "lucide-react";

interface HouseholdClientProps {
  household: any;
  members: any[];
}

export function HouseholdClient({ household, members }: HouseholdClientProps) {
  const router = useRouter();
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [inviteSent, setInviteSent] = React.useState(false);
  const [householdName, setHouseholdName] = React.useState(
    household?.name || ""
  );
  const [isSaving, setIsSaving] = React.useState(false);

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setIsSending(true);
    try {
      await fetch("/api/household/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });
      setInviteSent(true);
      setInviteEmail("");
    } catch {
      // Error
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveName = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/household", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: householdName }),
      });
      router.refresh();
    } catch {
      // Error
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Household</h1>
        <p className="text-sm text-foreground-muted">
          Gerencie os membros do seu household e convide seu conjuge.
        </p>
      </div>

      {/* Navigation tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        <Link
          href="/settings"
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-foreground-muted transition-colors hover:bg-card"
        >
          Perfil
        </Link>
        <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
          Household
        </span>
      </div>

      {/* Household name */}
      {household && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
            <Users className="h-5 w-5 text-foreground-muted" />
            Dados do Household
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              className="h-10 flex-1 rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Nome do household"
            />
            <button
              onClick={handleSaveName}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-light disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      )}

      {/* Members list */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
          <Users className="h-5 w-5 text-foreground-muted" />
          Membros ({members.length})
        </h2>
        {members.length > 0 ? (
          <ul className="space-y-3">
            {members.map((member: any) => (
              <li
                key={member.id}
                className="flex items-center gap-3 rounded-lg bg-surface p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {member.firstName} {member.lastName}
                    </p>
                    {member.isPrimaryApplicant && (
                      <Crown className="h-4 w-4 text-warning" />
                    )}
                  </div>
                  <p className="text-xs text-foreground-dim">
                    {member.isPrimaryApplicant
                      ? "Aplicante Principal"
                      : "Conjuge"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-foreground-dim">
            Nenhum membro encontrado.
          </p>
        )}
      </div>

      {/* Invite spouse */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
          <UserPlus className="h-5 w-5 text-foreground-muted" />
          Convidar Conjuge
        </h2>
        <p className="mb-4 text-sm text-foreground-muted">
          Envie um convite por email para seu conjuge entrar no mesmo household.
          Ambos poderao visualizar e gerenciar os planos de imigracao juntos.
        </p>
        {inviteSent ? (
          <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3">
            <Mail className="h-4 w-4 text-success" />
            <p className="text-sm text-success">
              Convite enviado com sucesso! Verifique o email.
            </p>
          </div>
        ) : (
          <div className="flex gap-3">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="email@conjuge.com"
              className="h-10 flex-1 rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleInvite}
              disabled={isSending || !inviteEmail}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-light disabled:opacity-50"
            >
              <Mail className="h-4 w-4" />
              {isSending ? "Enviando..." : "Enviar Convite"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
