"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface StepProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function StepLanguage({ data, onUpdate }: StepProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-6 text-lg font-semibold text-foreground">
        Idiomas
      </h2>

      <div className="space-y-6">
        {/* English */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-foreground-muted">
            Ingles (IELTS / CELPIP)
          </h3>
          <div className="space-y-2">
            <Label htmlFor="englishTest">Teste</Label>
            <Select
              id="englishTest"
              value={(data.englishTest as string) || ""}
              onChange={(e) => onUpdate({ englishTest: e.target.value })}
            >
              <option value="">Selecione</option>
              <option value="ielts">IELTS General</option>
              <option value="celpip">CELPIP-G</option>
            </Select>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(["Speaking", "Listening", "Reading", "Writing"] as const).map(
              (band) => (
                <div key={band} className="space-y-1">
                  <Label htmlFor={`en${band}`} className="text-xs">
                    {band}
                  </Label>
                  <Input
                    id={`en${band}`}
                    type="number"
                    step="0.5"
                    min="0"
                    max="9"
                    placeholder="0.0"
                    value={
                      (data[`english${band}`] as string) || ""
                    }
                    onChange={(e) =>
                      onUpdate({ [`english${band}`]: e.target.value })
                    }
                  />
                </div>
              )
            )}
          </div>
        </div>

        {/* French */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-foreground-muted">
            Frances (TEF / TCF)
          </h3>
          <div className="space-y-2">
            <Label htmlFor="frenchTest">Teste</Label>
            <Select
              id="frenchTest"
              value={(data.frenchTest as string) || ""}
              onChange={(e) => onUpdate({ frenchTest: e.target.value })}
            >
              <option value="">Selecione</option>
              <option value="tef">TEF Canada</option>
              <option value="tcf">TCF Canada</option>
              <option value="none">Nao aplicavel</option>
            </Select>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(["Speaking", "Listening", "Reading", "Writing"] as const).map(
              (band) => (
                <div key={band} className="space-y-1">
                  <Label htmlFor={`fr${band}`} className="text-xs">
                    {band}
                  </Label>
                  <Input
                    id={`fr${band}`}
                    type="number"
                    min="0"
                    placeholder="0"
                    value={
                      (data[`french${band}`] as string) || ""
                    }
                    onChange={(e) =>
                      onUpdate({ [`french${band}`]: e.target.value })
                    }
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
