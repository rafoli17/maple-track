/**
 * CRS (Comprehensive Ranking System) Calculator
 * Based on real IRCC scoring criteria (March 2026)
 *
 * Maximum CRS: 1200 points
 * - Core/Human Capital: 460 (with spouse) or 500 (without spouse)
 * - Spouse Factors: 40
 * - Skill Transferability: 100
 * - Additional Points: 600
 */

import type { EducationLevel } from "@/types";

// ════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════

export type MaritalStatusCRS = "single" | "married_or_common_law";

export interface LanguageScores {
  speaking: number; // CLB level (4-12+)
  listening: number;
  reading: number;
  writing: number;
}

export interface CRSProfile {
  age: number;
  educationLevel: EducationLevel;
  firstLanguage: LanguageScores;
  secondLanguage?: LanguageScores;
  canadianExperienceYears: number;
  foreignExperienceYears: number;
  maritalStatus: MaritalStatusCRS;
  canadianEducation?: boolean;
  canadianEducationLevel?: EducationLevel;
}

export interface CRSSpouseProfile {
  educationLevel: EducationLevel;
  firstLanguage: LanguageScores;
  canadianExperienceYears: number;
}

export interface CRSBreakdown {
  age: number;
  education: number;
  firstLanguage: number;
  secondLanguage: number;
  canadianExperience: number;
  subtotalCoreHumanCapital: number;

  spouseEducation: number;
  spouseLanguage: number;
  spouseCanadianExperience: number;
  subtotalSpouse: number;

  educationLanguage: number;
  educationCanadianExperience: number;
  foreignExperienceCanadianExperience: number;
  certificateOfQualificationLanguage: number;
  subtotalSkillTransfer: number;

  provincialNomination: number;
  jobOffer: number;
  canadianEducationPoints: number;
  siblingInCanada: number;
  frenchLanguagePoints: number;
  subtotalAdditional: number;

  total: number;
}

// ════════════════════════════════════════════
// AGE POINTS TABLE
// ════════════════════════════════════════════
// With spouse / Without spouse

const AGE_POINTS_WITH_SPOUSE: Record<number, number> = {
  17: 0,
  18: 90,
  19: 95,
  20: 100,
  21: 100,
  22: 100,
  23: 100,
  24: 100,
  25: 100,
  26: 100,
  27: 100,
  28: 100,
  29: 100,
  30: 95,
  31: 90,
  32: 85,
  33: 80,
  34: 75,
  35: 70,
  36: 65,
  37: 60,
  38: 55,
  39: 50,
  40: 45,
  41: 35,
  42: 25,
  43: 15,
  44: 5,
};

const AGE_POINTS_WITHOUT_SPOUSE: Record<number, number> = {
  17: 0,
  18: 99,
  19: 105,
  20: 110,
  21: 110,
  22: 110,
  23: 110,
  24: 110,
  25: 110,
  26: 110,
  27: 110,
  28: 110,
  29: 110,
  30: 105,
  31: 99,
  32: 94,
  33: 88,
  34: 83,
  35: 77,
  36: 72,
  37: 66,
  38: 61,
  39: 55,
  40: 50,
  41: 39,
  42: 28,
  43: 17,
  44: 6,
};

// ════════════════════════════════════════════
// EDUCATION POINTS
// ════════════════════════════════════════════

const EDUCATION_POINTS_WITH_SPOUSE: Record<EducationLevel, number> = {
  HIGH_SCHOOL: 28,
  ONE_YEAR_DIPLOMA: 84,
  TWO_YEAR_DIPLOMA: 91,
  BACHELORS: 112,
  POST_GRADUATION: 119,
  TWO_OR_MORE_CERTIFICATES: 119,
  MASTERS: 126,
  PHD: 140,
  TECHNICAL: 84,
};

const EDUCATION_POINTS_WITHOUT_SPOUSE: Record<EducationLevel, number> = {
  HIGH_SCHOOL: 30,
  ONE_YEAR_DIPLOMA: 90,
  TWO_YEAR_DIPLOMA: 98,
  BACHELORS: 120,
  POST_GRADUATION: 128,
  TWO_OR_MORE_CERTIFICATES: 128,
  MASTERS: 135,
  PHD: 150,
  TECHNICAL: 90,
};

// ════════════════════════════════════════════
// FIRST LANGUAGE POINTS (per ability)
// CLB level -> points
// ════════════════════════════════════════════

const FIRST_LANG_POINTS_WITH_SPOUSE: Record<number, number> = {
  3: 0,
  4: 6,
  5: 6,
  6: 8,
  7: 16,
  8: 22,
  9: 29,
  10: 32,
  11: 32,
  12: 32,
};

const FIRST_LANG_POINTS_WITHOUT_SPOUSE: Record<number, number> = {
  3: 0,
  4: 6,
  5: 6,
  6: 9,
  7: 17,
  8: 23,
  9: 31,
  10: 34,
  11: 34,
  12: 34,
};

// ════════════════════════════════════════════
// SECOND LANGUAGE POINTS (per ability)
// ════════════════════════════════════════════

const SECOND_LANG_POINTS: Record<number, number> = {
  3: 0,
  4: 0,
  5: 1,
  6: 1,
  7: 3,
  8: 3,
  9: 6,
  10: 6,
  11: 6,
  12: 6,
};

// ════════════════════════════════════════════
// CANADIAN EXPERIENCE POINTS
// ════════════════════════════════════════════

const CANADIAN_EXP_POINTS_WITH_SPOUSE: Record<number, number> = {
  0: 0,
  1: 35,
  2: 46,
  3: 56,
  4: 63,
  5: 70,
};

const CANADIAN_EXP_POINTS_WITHOUT_SPOUSE: Record<number, number> = {
  0: 0,
  1: 40,
  2: 53,
  3: 64,
  4: 72,
  5: 80,
};

// ════════════════════════════════════════════
// SPOUSE FACTOR POINTS
// ════════════════════════════════════════════

const SPOUSE_EDUCATION_POINTS: Record<EducationLevel, number> = {
  HIGH_SCHOOL: 2,
  ONE_YEAR_DIPLOMA: 6,
  TWO_YEAR_DIPLOMA: 7,
  BACHELORS: 8,
  POST_GRADUATION: 9,
  TWO_OR_MORE_CERTIFICATES: 9,
  MASTERS: 10,
  PHD: 10,
  TECHNICAL: 6,
};

const SPOUSE_LANG_POINTS: Record<number, number> = {
  3: 0,
  4: 0,
  5: 1,
  6: 1,
  7: 3,
  8: 3,
  9: 5,
  10: 5,
  11: 5,
  12: 5,
};

const SPOUSE_CANADIAN_EXP_POINTS: Record<number, number> = {
  0: 0,
  1: 5,
  2: 7,
  3: 8,
  4: 9,
  5: 10,
};

// ════════════════════════════════════════════
// SKILL TRANSFERABILITY COMBINATIONS
// ════════════════════════════════════════════
// Max 50 per combination, max 100 total

function getEducationLanguagePoints(
  educationLevel: EducationLevel,
  clbLevel: number
): number {
  const hasPostSecondary =
    educationLevel !== "HIGH_SCHOOL" && educationLevel !== "TECHNICAL";
  if (!hasPostSecondary) return 0;

  const hasOneOrMoreDegrees = [
    "ONE_YEAR_DIPLOMA",
    "TWO_YEAR_DIPLOMA",
    "BACHELORS",
    "TWO_OR_MORE_CERTIFICATES",
    "MASTERS",
    "PHD",
  ].includes(educationLevel);

  if (!hasOneOrMoreDegrees) return 0;

  if (clbLevel >= 9) {
    if (
      educationLevel === "MASTERS" ||
      educationLevel === "PHD" ||
      educationLevel === "TWO_OR_MORE_CERTIFICATES"
    )
      return 50;
    if (educationLevel === "BACHELORS") return 50;
    return 25;
  }
  if (clbLevel >= 7) {
    if (
      educationLevel === "MASTERS" ||
      educationLevel === "PHD" ||
      educationLevel === "TWO_OR_MORE_CERTIFICATES"
    )
      return 25;
    if (educationLevel === "BACHELORS") return 25;
    return 13;
  }
  return 0;
}

function getEducationCanadianExpPoints(
  educationLevel: EducationLevel,
  canadianExpYears: number
): number {
  const hasPostSecondary =
    educationLevel !== "HIGH_SCHOOL" && educationLevel !== "TECHNICAL";
  if (!hasPostSecondary || canadianExpYears === 0) return 0;

  const hasOneOrMoreDegrees = [
    "ONE_YEAR_DIPLOMA",
    "TWO_YEAR_DIPLOMA",
    "BACHELORS",
    "TWO_OR_MORE_CERTIFICATES",
    "MASTERS",
    "PHD",
  ].includes(educationLevel);

  if (!hasOneOrMoreDegrees) return 0;

  if (canadianExpYears >= 2) {
    if (
      educationLevel === "MASTERS" ||
      educationLevel === "PHD" ||
      educationLevel === "TWO_OR_MORE_CERTIFICATES"
    )
      return 50;
    if (educationLevel === "BACHELORS") return 50;
    return 25;
  }
  if (canadianExpYears >= 1) {
    if (
      educationLevel === "MASTERS" ||
      educationLevel === "PHD" ||
      educationLevel === "TWO_OR_MORE_CERTIFICATES"
    )
      return 25;
    if (educationLevel === "BACHELORS") return 25;
    return 13;
  }
  return 0;
}

function getForeignCanadianExpPoints(
  foreignExpYears: number,
  canadianExpYears: number
): number {
  if (canadianExpYears === 0 || foreignExpYears === 0) return 0;

  if (foreignExpYears >= 3 && canadianExpYears >= 2) return 50;
  if (foreignExpYears >= 3 && canadianExpYears >= 1) return 25;
  if (foreignExpYears >= 1 && canadianExpYears >= 2) return 25;
  if (foreignExpYears >= 1 && canadianExpYears >= 1) return 13;
  return 0;
}

// ════════════════════════════════════════════
// CANADIAN EDUCATION ADDITIONAL POINTS
// ════════════════════════════════════════════

function getCanadianEducationPoints(
  hasCanadianEd: boolean,
  level?: EducationLevel
): number {
  if (!hasCanadianEd || !level) return 0;
  if (level === "ONE_YEAR_DIPLOMA" || level === "TWO_YEAR_DIPLOMA")
    return 15;
  if (
    level === "BACHELORS" ||
    level === "MASTERS" ||
    level === "PHD" ||
    level === "TWO_OR_MORE_CERTIFICATES"
  )
    return 30;
  return 0;
}

// ════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════

function clampCLB(clb: number): number {
  return Math.min(12, Math.max(0, Math.floor(clb)));
}

function getAgePoints(age: number, hasSpouse: boolean): number {
  if (age < 17 || age >= 45) return 0;
  const table = hasSpouse
    ? AGE_POINTS_WITH_SPOUSE
    : AGE_POINTS_WITHOUT_SPOUSE;
  return table[age] ?? 0;
}

function getEducationPoints(
  level: EducationLevel,
  hasSpouse: boolean
): number {
  const table = hasSpouse
    ? EDUCATION_POINTS_WITH_SPOUSE
    : EDUCATION_POINTS_WITHOUT_SPOUSE;
  return table[level] ?? 0;
}

function getFirstLanguagePoints(
  scores: LanguageScores,
  hasSpouse: boolean
): number {
  const table = hasSpouse
    ? FIRST_LANG_POINTS_WITH_SPOUSE
    : FIRST_LANG_POINTS_WITHOUT_SPOUSE;
  const abilities: (keyof LanguageScores)[] = [
    "speaking",
    "listening",
    "reading",
    "writing",
  ];
  let total = 0;
  for (const ability of abilities) {
    const clb = clampCLB(scores[ability]);
    total += table[clb] ?? 0;
  }
  return total;
}

function getSecondLanguagePoints(scores?: LanguageScores): number {
  if (!scores) return 0;
  const abilities: (keyof LanguageScores)[] = [
    "speaking",
    "listening",
    "reading",
    "writing",
  ];
  let total = 0;
  for (const ability of abilities) {
    const clb = clampCLB(scores[ability]);
    total += SECOND_LANG_POINTS[clb] ?? 0;
  }
  return Math.min(24, total);
}

function getCanadianExperiencePoints(
  years: number,
  hasSpouse: boolean
): number {
  const capped = Math.min(5, Math.max(0, years));
  const table = hasSpouse
    ? CANADIAN_EXP_POINTS_WITH_SPOUSE
    : CANADIAN_EXP_POINTS_WITHOUT_SPOUSE;
  return table[capped] ?? 0;
}

function getMinCLB(scores: LanguageScores): number {
  return Math.min(scores.speaking, scores.listening, scores.reading, scores.writing);
}

// ════════════════════════════════════════════
// MAIN CALCULATOR
// ════════════════════════════════════════════

export function calculateCRS(
  profile: CRSProfile,
  spouseProfile?: CRSSpouseProfile,
  hasProvincialNomination: boolean = false,
  hasJobOffer: boolean = false,
  hasSibling: boolean = false
): CRSBreakdown {
  const hasSpouse = profile.maritalStatus === "married_or_common_law";
  const hasAccompanyingSpouse = hasSpouse && !!spouseProfile;

  // ── Core / Human Capital Factors ──
  const agePoints = getAgePoints(profile.age, hasAccompanyingSpouse);
  const educationPoints = getEducationPoints(
    profile.educationLevel,
    hasAccompanyingSpouse
  );
  const firstLangPoints = getFirstLanguagePoints(
    profile.firstLanguage,
    hasAccompanyingSpouse
  );
  const secondLangPoints = getSecondLanguagePoints(profile.secondLanguage);
  const canadianExpPoints = getCanadianExperiencePoints(
    profile.canadianExperienceYears,
    hasAccompanyingSpouse
  );

  const subtotalCore =
    agePoints + educationPoints + firstLangPoints + secondLangPoints + canadianExpPoints;

  // ── Spouse Factors ──
  let spouseEdPoints = 0;
  let spouseLangPoints = 0;
  let spouseCanadianExpPoints = 0;

  if (hasAccompanyingSpouse && spouseProfile) {
    spouseEdPoints = SPOUSE_EDUCATION_POINTS[spouseProfile.educationLevel] ?? 0;

    const abilities: (keyof LanguageScores)[] = [
      "speaking",
      "listening",
      "reading",
      "writing",
    ];
    for (const ability of abilities) {
      const clb = clampCLB(spouseProfile.firstLanguage[ability]);
      spouseLangPoints += SPOUSE_LANG_POINTS[clb] ?? 0;
    }
    spouseLangPoints = Math.min(20, spouseLangPoints);

    const spouseExpCapped = Math.min(
      5,
      Math.max(0, spouseProfile.canadianExperienceYears)
    );
    spouseCanadianExpPoints =
      SPOUSE_CANADIAN_EXP_POINTS[spouseExpCapped] ?? 0;
  }

  const subtotalSpouse =
    spouseEdPoints + spouseLangPoints + spouseCanadianExpPoints;

  // ── Skill Transferability ──
  const minCLB = getMinCLB(profile.firstLanguage);

  const edLangPoints = getEducationLanguagePoints(
    profile.educationLevel,
    minCLB
  );
  const edCanExpPoints = getEducationCanadianExpPoints(
    profile.educationLevel,
    profile.canadianExperienceYears
  );
  const foreignCanExpPoints = getForeignCanadianExpPoints(
    profile.foreignExperienceYears,
    profile.canadianExperienceYears
  );
  // Certificate of qualification + language (trade-specific, simplified)
  const certLangPoints = 0;

  const subtotalSkillTransfer = Math.min(
    100,
    edLangPoints + edCanExpPoints + foreignCanExpPoints + certLangPoints
  );

  // ── Additional Points ──
  const provincialNominationPoints = hasProvincialNomination ? 600 : 0;

  // Job offer: TEER 0/1 Major Group 00 = 200, other TEER 0/1/2/3 = 50
  // Simplified: using 50 for arranged employment
  const jobOfferPoints = hasJobOffer ? 50 : 0;

  const canadianEdPoints = getCanadianEducationPoints(
    profile.canadianEducation ?? false,
    profile.canadianEducationLevel
  );

  const siblingPoints = hasSibling ? 15 : 0;

  // French language bonus: CLB 7+ in French + CLB 4 or lower in English = 25
  // CLB 7+ in French + CLB 5+ in English = 50
  // Simplified: not calculated here as it requires knowing which test is French
  const frenchPoints = 0;

  const subtotalAdditional =
    provincialNominationPoints +
    jobOfferPoints +
    canadianEdPoints +
    siblingPoints +
    frenchPoints;

  const total =
    subtotalCore + subtotalSpouse + subtotalSkillTransfer + subtotalAdditional;

  return {
    age: agePoints,
    education: educationPoints,
    firstLanguage: firstLangPoints,
    secondLanguage: secondLangPoints,
    canadianExperience: canadianExpPoints,
    subtotalCoreHumanCapital: subtotalCore,

    spouseEducation: spouseEdPoints,
    spouseLanguage: spouseLangPoints,
    spouseCanadianExperience: spouseCanadianExpPoints,
    subtotalSpouse,

    educationLanguage: edLangPoints,
    educationCanadianExperience: edCanExpPoints,
    foreignExperienceCanadianExperience: foreignCanExpPoints,
    certificateOfQualificationLanguage: certLangPoints,
    subtotalSkillTransfer,

    provincialNomination: provincialNominationPoints,
    jobOffer: jobOfferPoints,
    canadianEducationPoints: canadianEdPoints,
    siblingInCanada: siblingPoints,
    frenchLanguagePoints: frenchPoints,
    subtotalAdditional,

    total,
  };
}

/**
 * Convert IELTS band score to CLB level
 */
export function ieltsToClb(
  ability: "speaking" | "listening" | "reading" | "writing",
  score: number
): number {
  const tables: Record<string, [number, number][]> = {
    speaking: [
      [7.5, 10],
      [7.0, 9],
      [6.5, 8],
      [6.0, 7],
      [5.5, 6],
      [5.0, 5],
      [4.0, 4],
    ],
    listening: [
      [8.5, 10],
      [8.0, 9],
      [7.5, 8],
      [6.0, 7],
      [5.5, 6],
      [5.0, 5],
      [4.5, 4],
    ],
    reading: [
      [7.0, 10],
      [6.5, 9],
      [6.0, 8],
      [6.0, 7],
      [5.0, 6],
      [4.0, 5],
      [3.5, 4],
    ],
    writing: [
      [7.5, 10],
      [7.0, 9],
      [6.5, 8],
      [6.0, 7],
      [5.5, 6],
      [5.0, 5],
      [4.0, 4],
    ],
  };

  const table = tables[ability];
  for (const [threshold, clb] of table) {
    if (score >= threshold) return clb;
  }
  return 3;
}

/**
 * Convert CELPIP score to CLB level
 * CELPIP scores map directly: CELPIP 10 = CLB 10, etc.
 */
export function celpipToClb(score: number): number {
  if (score >= 12) return 12;
  if (score >= 10) return 10;
  if (score >= 9) return 9;
  if (score >= 8) return 8;
  if (score >= 7) return 7;
  if (score >= 6) return 6;
  if (score >= 5) return 5;
  if (score >= 4) return 4;
  return 3;
}

/**
 * Convert TEF scores to CLB (NCLC) level
 */
export function tefToClb(
  ability: "speaking" | "listening" | "reading" | "writing",
  score: number
): number {
  const tables: Record<string, [number, number][]> = {
    speaking: [
      [393, 10],
      [371, 9],
      [349, 8],
      [310, 7],
      [271, 6],
      [226, 5],
      [181, 4],
    ],
    listening: [
      [316, 10],
      [298, 9],
      [280, 8],
      [249, 7],
      [217, 6],
      [181, 5],
      [145, 4],
    ],
    reading: [
      [263, 10],
      [248, 9],
      [233, 8],
      [207, 7],
      [181, 6],
      [151, 5],
      [121, 4],
    ],
    writing: [
      [393, 10],
      [371, 9],
      [349, 8],
      [310, 7],
      [271, 6],
      [226, 5],
      [181, 4],
    ],
  };

  const table = tables[ability];
  for (const [threshold, clb] of table) {
    if (score >= threshold) return clb;
  }
  return 3;
}
