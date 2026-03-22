"use client";

import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface StepProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function StepPreferences({ data, onUpdate }: StepProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-6 text-lg font-semibold text-foreground">
        Preferencias
      </h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="preferredProvince">Provincia Preferida</Label>
          <Select
            id="preferredProvince"
            value={(data.preferredProvince as string) || ""}
            onChange={(e) => onUpdate({ preferredProvince: e.target.value })}
          >
            <option value="">Sem preferencia</option>
            <option value="ON">Ontario</option>
            <option value="BC">British Columbia</option>
            <option value="AB">Alberta</option>
            <option value="QC">Quebec</option>
            <option value="MB">Manitoba</option>
            <option value="SK">Saskatchewan</option>
            <option value="NS">Nova Scotia</option>
            <option value="NB">New Brunswick</option>
            <option value="PE">Prince Edward Island</option>
            <option value="NL">Newfoundland and Labrador</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeline">Prazo Desejado</Label>
          <Select
            id="timeline"
            value={(data.timeline as string) || ""}
            onChange={(e) => onUpdate({ timeline: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="6m">6 meses</option>
            <option value="1y">1 ano</option>
            <option value="2y">2 anos</option>
            <option value="3y">3 anos ou mais</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pathwayType">Tipo de Programa Preferido</Label>
          <Select
            id="pathwayType"
            value={(data.pathwayType as string) || ""}
            onChange={(e) => onUpdate({ pathwayType: e.target.value })}
          >
            <option value="">Sem preferencia</option>
            <option value="express_entry">Express Entry</option>
            <option value="pnp">Programa Provincial (PNP)</option>
            <option value="study">Estudo + Trabalho</option>
            <option value="business">Imigracao de Negocios</option>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-surface p-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              Notificacoes por e-mail
            </p>
            <p className="text-xs text-foreground-muted">
              Receber atualizacoes sobre prazos e draws
            </p>
          </div>
          <Switch
            checked={(data.emailNotifications as boolean) ?? true}
            onCheckedChange={(val) => onUpdate({ emailNotifications: val })}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-surface p-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              Acompanhamento de conjuge
            </p>
            <p className="text-xs text-foreground-muted">
              Gerenciar o processo do conjuge em paralelo
            </p>
          </div>
          <Switch
            checked={(data.trackSpouse as boolean) ?? false}
            onCheckedChange={(val) => onUpdate({ trackSpouse: val })}
          />
        </div>
      </div>
    </div>
  );
}
