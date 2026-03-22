// ════════════════════════════════════════════
// Program Matcher — Match profile to programs
// ════════════════════════════════════════════

import type { Profile, ImmigrationProgram } from "@/types";

export interface ProgramMatch {
  program: ImmigrationProgram;
  matchPercentage: number;
  meetsRequirements: boolean;
  missingRequirements: string[];
  strengths: string[];
}

export function matchPrograms(
  profile: Profile,
  programs: ImmigrationProgram[],
  clbScore?: number,
  crsScore?: number
): ProgramMatch[] {
  return programs
    .map((program) => {
      const missing: string[] = [];
      const strengths: string[] = [];
      let score = 0;
      let maxScore = 0;

      // CLB check
      if (program.minimumCLB) {
        maxScore += 25;
        const profileCLB = clbScore || 0;
        if (profileCLB >= program.minimumCLB) {
          score += 25;
          strengths.push(`CLB ${profileCLB} atende mínimo de ${program.minimumCLB}`);
        } else {
          missing.push(`CLB mínimo: ${program.minimumCLB} (você tem ${profileCLB})`);
        }
      }

      // CRS check
      if (program.minimumCRS) {
        maxScore += 25;
        const profileCRS = crsScore || 0;
        if (profileCRS >= program.minimumCRS) {
          score += 25;
          strengths.push(`CRS ${profileCRS} acima do mínimo ${program.minimumCRS}`);
        } else {
          missing.push(`CRS mínimo: ${program.minimumCRS} (você tem ${profileCRS})`);
        }
      }

      // Education check
      if (profile.educationLevel) {
        maxScore += 20;
        const eduRank: Record<string, number> = {
          HIGH_SCHOOL: 1, ONE_YEAR_DIPLOMA: 2, TWO_YEAR_DIPLOMA: 3,
          TECHNICAL: 3, BACHELORS: 4, TWO_OR_MORE_CERTIFICATES: 5,
          MASTERS: 6, PHD: 7,
        };
        const rank = eduRank[profile.educationLevel] || 0;
        if (rank >= 4) { score += 20; strengths.push("Educação superior"); }
        else if (rank >= 2) { score += 10; }
        else { missing.push("Educação superior recomendada"); }
      }

      // Experience check
      maxScore += 15;
      const years = profile.yearsOfExperience || 0;
      if (years >= 3) { score += 15; strengths.push(`${years} anos de experiência`); }
      else if (years >= 1) { score += 8; }
      else { missing.push("Experiência profissional mínima de 1 ano"); }

      // Funds check
      if (program.minimumFunds) {
        maxScore += 15;
        const funds = parseFloat(profile.fundsAvailable || "0");
        const required = parseFloat(program.minimumFunds);
        if (funds >= required) {
          score += 15;
          strengths.push("Fundos suficientes");
        } else {
          missing.push(`Fundos mínimos: CAD $${required.toLocaleString()} (você tem $${funds.toLocaleString()})`);
        }
      }

      const matchPercentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 50;

      return {
        program,
        matchPercentage,
        meetsRequirements: missing.length === 0,
        missingRequirements: missing,
        strengths,
      };
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
}
