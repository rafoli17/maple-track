import { z } from "zod/v4";

// ════════════════════════════════════════════
// Onboarding Step Schemas
// ════════════════════════════════════════════

export const stepPersonalSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  dateOfBirth: z.string().min(1, "Data de nascimento é obrigatória"),
  nationality: z.string().min(1, "Nacionalidade é obrigatória"),
  currentCountry: z.string().min(1, "País atual é obrigatório"),
});

export const stepEducationSchema = z.object({
  educationLevel: z.enum([
    "HIGH_SCHOOL",
    "ONE_YEAR_DIPLOMA",
    "TWO_YEAR_DIPLOMA",
    "BACHELORS",
    "TWO_OR_MORE_CERTIFICATES",
    "MASTERS",
    "PHD",
    "TECHNICAL",
  ]),
  fieldOfStudy: z.string().optional(),
});

export const stepExperienceSchema = z.object({
  currentOccupation: z.string().min(1, "Ocupação é obrigatória"),
  nocCode: z.string().optional(),
  yearsOfExperience: z.number().min(0).max(50),
  canadianExperienceYears: z.number().min(0).max(50).default(0),
});

export const stepLanguageSchema = z.object({
  hasTest: z.boolean(),
  testType: z
    .enum(["IELTS_GENERAL", "IELTS_ACADEMIC", "CELPIP", "TEF", "TCF"])
    .optional(),
  speaking: z.number().min(0).max(12).optional(),
  listening: z.number().min(0).max(12).optional(),
  reading: z.number().min(0).max(12).optional(),
  writing: z.number().min(0).max(12).optional(),
});

export const stepSpouseSchema = z.object({
  inviteSpouse: z.boolean(),
  spouseEmail: z.string().email("Email inválido").optional(),
});

export const stepFinancesSchema = z.object({
  fundsAvailable: z.number().min(0, "Valor deve ser positivo"),
});

export const stepChildrenSchema = z.object({
  hasChildren: z.boolean(),
  numberOfChildren: z.number().min(0).max(20).default(0),
});

export const stepPreferencesSchema = z.object({
  preferredProvinces: z.array(z.string()).default([]),
  acceptsRural: z.boolean().default(false),
  speaksFrench: z.boolean().default(false),
});

// ════════════════════════════════════════════
// API Schemas
// ════════════════════════════════════════════

export const profileUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  currentCountry: z.string().optional(),
  educationLevel: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  yearsOfExperience: z.number().optional(),
  currentOccupation: z.string().optional(),
  nocCode: z.string().optional(),
  canadianExperienceYears: z.number().optional(),
  canadianEducation: z.boolean().optional(),
  maritalStatus: z.string().optional(),
  hasChildren: z.boolean().optional(),
  numberOfChildren: z.number().optional(),
  fundsAvailable: z.string().optional(),
});

export const languageTestCreateSchema = z.object({
  testType: z.enum(["IELTS_GENERAL", "IELTS_ACADEMIC", "CELPIP", "TEF", "TCF"]),
  speaking: z.number().min(0).max(12).optional(),
  listening: z.number().min(0).max(12).optional(),
  reading: z.number().min(0).max(12).optional(),
  writing: z.number().min(0).max(12).optional(),
  testDate: z.string().optional(),
  status: z.enum(["PLANNED", "SCHEDULED", "COMPLETED", "EXPIRED"]).default("PLANNED"),
  profileId: z.string().uuid().optional(),
});

export const planCreateSchema = z.object({
  programId: z.string().uuid(),
  priority: z.enum(["PRIMARY", "SECONDARY", "TERTIARY"]),
  notes: z.string().optional(),
});

export const documentCreateSchema = z.object({
  name: z.string().min(1),
  type: z.enum([
    "PASSPORT", "BIRTH_CERTIFICATE", "MARRIAGE_CERTIFICATE", "DIPLOMA",
    "TRANSCRIPT", "ECA", "IELTS_RESULT", "CELPIP_RESULT", "TEF_RESULT",
    "POLICE_CLEARANCE", "MEDICAL_EXAM", "PROOF_OF_FUNDS", "EMPLOYMENT_LETTER",
    "REFERENCE_LETTER", "PHOTOS", "OTHER",
  ]),
  status: z.enum(["NOT_STARTED", "GATHERING", "SUBMITTED", "APPROVED", "EXPIRED", "NEEDS_UPDATE"]).default("NOT_STARTED"),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  notes: z.string().optional(),
  immigrationPlanId: z.string().uuid().optional(),
  profileId: z.string().uuid().optional(),
  originalLanguage: z.string().optional(),
  translationRequired: z.boolean().optional(),
  translationCompleted: z.boolean().optional(),
});

export const stepUpdateSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "BLOCKED", "SKIPPED"]),
  notes: z.string().optional(),
});

export type StepPersonalData = z.infer<typeof stepPersonalSchema>;
export type StepEducationData = z.infer<typeof stepEducationSchema>;
export type StepExperienceData = z.infer<typeof stepExperienceSchema>;
export type StepLanguageData = z.infer<typeof stepLanguageSchema>;
export type StepSpouseData = z.infer<typeof stepSpouseSchema>;
export type StepFinancesData = z.infer<typeof stepFinancesSchema>;
export type StepChildrenData = z.infer<typeof stepChildrenSchema>;
export type StepPreferencesData = z.infer<typeof stepPreferencesSchema>;
