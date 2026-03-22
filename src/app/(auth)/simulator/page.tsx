"use client";

import * as React from "react";
import { Calculator, RotateCcw, Save } from "lucide-react";

const AGE_POINTS: Record<string, number> = {
  "17": 0, "18": 99, "19": 105, "20": 110, "21": 110, "22": 110, "23": 110,
  "24": 110, "25": 110, "26": 110, "27": 110, "28": 110, "29": 110,
  "30": 105, "31": 99, "32": 94, "33": 88, "34": 83, "35": 77, "36": 72,
  "37": 66, "38": 61, "39": 55, "40": 50, "41": 39, "42": 28, "43": 17,
  "44": 6, "45": 0,
};

const EDUCATION_POINTS: Record<string, number> = {
  HIGH_SCHOOL: 30,
  ONE_YEAR_DIPLOMA: 90,
  TWO_YEAR_DIPLOMA: 98,
  BACHELORS: 120,
  TWO_OR_MORE_CERTIFICATES: 128,
  MASTERS: 135,
  PHD: 150,
};

const CLB_POINTS: Record<number, number> = {
  4: 6, 5: 6, 6: 9, 7: 17, 8: 23, 9: 31, 10: 34,
};

const EXPERIENCE_POINTS: Record<string, number> = {
  "0": 0, "1": 40, "2": 53, "3": 64, "4": 72, "5": 80,
};

export default function SimulatorPage() {
  const [age, setAge] = React.useState("30");
  const [education, setEducation] = React.useState("BACHELORS");
  const [clb, setClb] = React.useState("7");
  const [experience, setExperience] = React.useState("3");
  const [canadianExperience, setCanadianExperience] = React.useState("0");
  const [hasSpouse, setHasSpouse] = React.useState(false);
  const [spouseEducation, setSpouseEducation] = React.useState("BACHELORS");
  const [spouseClb, setSpouseClb] = React.useState("7");
  const [spouseExperience, setSpouseExperience] = React.useState("0");

  const calculate = React.useMemo(() => {
    const agePoints = AGE_POINTS[age] || 0;
    const eduPoints = EDUCATION_POINTS[education] || 0;
    const langPoints = (CLB_POINTS[Number(clb)] || 0) * 4;
    const expPoints = EXPERIENCE_POINTS[experience] || 0;

    let coreScore = agePoints + eduPoints + langPoints + expPoints;
    coreScore = hasSpouse ? Math.min(coreScore, 460) : Math.min(coreScore, 500);

    let spouseScore = 0;
    if (hasSpouse) {
      const spEdu = Math.min((EDUCATION_POINTS[spouseEducation] || 0) * 0.1, 10);
      const spLang = Math.min((CLB_POINTS[Number(spouseClb)] || 0) * 4 * 0.1, 20);
      const spExp = Math.min((EXPERIENCE_POINTS[spouseExperience] || 0) * 0.1, 10);
      spouseScore = Math.round(spEdu + spLang + spExp);
    }

    const hasHighEdu = ["MASTERS", "PHD", "TWO_OR_MORE_CERTIFICATES"].includes(education);
    const hasHighLang = Number(clb) >= 7;
    const hasHighExp = Number(experience) >= 3;
    let skillTransfer = 0;
    if (hasHighEdu && hasHighLang) skillTransfer += 25;
    if (hasHighEdu && hasHighExp) skillTransfer += 25;
    if (hasHighLang && Number(canadianExperience) >= 1) skillTransfer += 25;
    if (hasHighExp && Number(canadianExperience) >= 1) skillTransfer += 25;
    skillTransfer = Math.min(skillTransfer, 100);

    let additional = 0;
    if (Number(canadianExperience) >= 1) additional += 15;

    const total = Math.min(coreScore + spouseScore + skillTransfer + additional, 1200);

    return {
      total,
      core: coreScore,
      spouse: spouseScore,
      skillTransfer,
      additional,
      breakdown: { agePoints, eduPoints, langPoints, expPoints },
    };
  }, [age, education, clb, experience, canadianExperience, hasSpouse, spouseEducation, spouseClb, spouseExperience]);

  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const handleSaveScore = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/crs", {
        method: "POST",
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {
      // Error
    } finally {
      setIsSaving(false);
    }
  };

  const reset = () => {
    setAge("30");
    setEducation("BACHELORS");
    setClb("7");
    setExperience("3");
    setCanadianExperience("0");
    setHasSpouse(false);
    setSpouseEducation("BACHELORS");
    setSpouseClb("7");
    setSpouseExperience("0");
    setSaveSuccess(false);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Simulador CRS</h1>
        <p className="text-sm text-foreground-muted">
          Calcule sua pontuacao no Comprehensive Ranking System do Express Entry.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-foreground">
              Aplicante Principal
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-foreground-muted">Idade</label>
                <input
                  type="number"
                  min="17"
                  max="45"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-foreground-muted">Educacao</label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                >
                  <option value="HIGH_SCHOOL">Ensino Medio</option>
                  <option value="ONE_YEAR_DIPLOMA">Diploma 1 ano</option>
                  <option value="TWO_YEAR_DIPLOMA">Diploma 2 anos</option>
                  <option value="BACHELORS">Bacharelado</option>
                  <option value="TWO_OR_MORE_CERTIFICATES">2+ Certificados</option>
                  <option value="MASTERS">Mestrado</option>
                  <option value="PHD">Doutorado</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-foreground-muted">CLB</label>
                <select
                  value={clb}
                  onChange={(e) => setClb(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                >
                  {[4, 5, 6, 7, 8, 9, 10].map((l) => (
                    <option key={l} value={l}>CLB {l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-foreground-muted">Experiencia</label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                >
                  {[0, 1, 2, 3, 4, 5].map((y) => (
                    <option key={y} value={y}>
                      {y === 0 ? "Nenhum" : y === 5 ? "5+" : `${y} ano${y > 1 ? "s" : ""}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-foreground-muted">Experiencia Canadense</label>
                <select
                  value={canadianExperience}
                  onChange={(e) => setCanadianExperience(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                >
                  {[0, 1, 2, 3, 4, 5].map((y) => (
                    <option key={y} value={y}>
                      {y === 0 ? "Nenhuma" : `${y} ano${y > 1 ? "s" : ""}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Spouse */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Conjuge</h2>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={hasSpouse}
                  onChange={(e) => setHasSpouse(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground-muted">Incluir</span>
              </label>
            </div>
            {hasSpouse && (
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm text-foreground-muted">Educacao</label>
                  <select
                    value={spouseEducation}
                    onChange={(e) => setSpouseEducation(e.target.value)}
                    className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                  >
                    <option value="HIGH_SCHOOL">Ensino Medio</option>
                    <option value="ONE_YEAR_DIPLOMA">Diploma 1 ano</option>
                    <option value="TWO_YEAR_DIPLOMA">Diploma 2 anos</option>
                    <option value="BACHELORS">Bacharelado</option>
                    <option value="MASTERS">Mestrado</option>
                    <option value="PHD">Doutorado</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-foreground-muted">CLB</label>
                  <select
                    value={spouseClb}
                    onChange={(e) => setSpouseClb(e.target.value)}
                    className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                  >
                    {[4, 5, 6, 7, 8, 9, 10].map((l) => (
                      <option key={l} value={l}>CLB {l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-foreground-muted">Experiencia</label>
                  <select
                    value={spouseExperience}
                    onChange={(e) => setSpouseExperience(e.target.value)}
                    className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                  >
                    {[0, 1, 2, 3, 4, 5].map((y) => (
                      <option key={y} value={y}>
                        {y === 0 ? "Nenhuma" : `${y} ano${y > 1 ? "s" : ""}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:shadow-md"
            >
              <RotateCcw className="h-4 w-4" />
              Resetar
            </button>
            <button
              onClick={handleSaveScore}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:bg-primary-light disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Salvando..." : saveSuccess ? "Salvo!" : "Salvar Score"}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm text-center">
            <Calculator className="mx-auto mb-2 h-6 w-6 text-primary" />
            <p className="text-sm text-foreground-muted">Score CRS Total</p>
            <p className="mt-1 text-5xl font-bold text-primary">{calculate.total}</p>
            <p className="mt-1 text-xs text-foreground-dim">de 1200 pontos</p>
            <div className="mt-4 h-3 rounded-full bg-border">
              <div
                className="h-3 rounded-full bg-primary transition-all duration-500"
                style={{ width: `${(calculate.total / 1200) * 100}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Detalhamento</h3>
            <div className="space-y-3">
              {[
                { label: "Core / Capital Humano", value: calculate.core },
                { label: "Fatores do Conjuge", value: calculate.spouse },
                { label: "Transferencia de Habilidades", value: calculate.skillTransfer },
                { label: "Pontos Adicionais", value: calculate.additional },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-foreground-muted">{item.label}</span>
                  <span className="text-sm font-medium text-foreground">{item.value}</span>
                </div>
              ))}
              <hr className="border-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Total</span>
                <span className="text-sm font-bold text-primary">{calculate.total}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Core Breakdown</h3>
            <div className="space-y-2 text-xs">
              {[
                { label: "Idade", value: calculate.breakdown.agePoints },
                { label: "Educacao", value: calculate.breakdown.eduPoints },
                { label: "Idioma", value: calculate.breakdown.langPoints },
                { label: "Experiencia", value: calculate.breakdown.expPoints },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-foreground-muted">{item.label}</span>
                  <span className="text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
