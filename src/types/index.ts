import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type {
  users,
  households,
  profiles,
  languageTests,
  crsScores,
  immigrationPrograms,
  immigrationPlans,
  journeyPhases,
  journeySteps,
  documents,
  notifications,
  achievements,
} from "@/db/schema";

// ════════════════════════════════════════════
// Database Model Types (inferred from schema)
// ════════════════════════════════════════════

// Select types (reading from DB)
export type User = InferSelectModel<typeof users>;
export type Household = InferSelectModel<typeof households>;
export type Profile = InferSelectModel<typeof profiles>;
export type LanguageTest = InferSelectModel<typeof languageTests>;
export type CRSScore = InferSelectModel<typeof crsScores>;
export type ImmigrationProgram = InferSelectModel<typeof immigrationPrograms>;
export type ImmigrationPlan = InferSelectModel<typeof immigrationPlans>;
export type JourneyPhase = InferSelectModel<typeof journeyPhases>;
export type JourneyStep = InferSelectModel<typeof journeySteps>;
export type Document = InferSelectModel<typeof documents>;
export type Notification = InferSelectModel<typeof notifications>;
export type Achievement = InferSelectModel<typeof achievements>;

// Insert types (writing to DB)
export type NewUser = InferInsertModel<typeof users>;
export type NewHousehold = InferInsertModel<typeof households>;
export type NewProfile = InferInsertModel<typeof profiles>;
export type NewLanguageTest = InferInsertModel<typeof languageTests>;
export type NewCRSScore = InferInsertModel<typeof crsScores>;
export type NewImmigrationProgram = InferInsertModel<typeof immigrationPrograms>;
export type NewImmigrationPlan = InferInsertModel<typeof immigrationPlans>;
export type NewJourneyPhase = InferInsertModel<typeof journeyPhases>;
export type NewJourneyStep = InferInsertModel<typeof journeySteps>;
export type NewDocument = InferInsertModel<typeof documents>;
export type NewNotification = InferInsertModel<typeof notifications>;
export type NewAchievement = InferInsertModel<typeof achievements>;

// ════════════════════════════════════════════
// Enum Types (for type-safe usage in components)
// ════════════════════════════════════════════

export type UserRole = "APPLICANT" | "ADMIN";

export type EducationLevel =
  | "HIGH_SCHOOL"
  | "ONE_YEAR_DIPLOMA"
  | "TWO_YEAR_DIPLOMA"
  | "BACHELORS"
  | "TWO_OR_MORE_CERTIFICATES"
  | "MASTERS"
  | "PHD"
  | "TECHNICAL";

export type LanguageTestType =
  | "IELTS_GENERAL"
  | "IELTS_ACADEMIC"
  | "CELPIP"
  | "TEF"
  | "TCF";

export type LanguageTestStatus =
  | "PLANNED"
  | "SCHEDULED"
  | "COMPLETED"
  | "EXPIRED";

export type ProgramCategory =
  | "EXPRESS_ENTRY"
  | "PNP"
  | "FAMILY"
  | "PILOT"
  | "STUDY";

export type PlanPriority = "PRIMARY" | "SECONDARY" | "TERTIARY";

export type PlanStatus =
  | "RESEARCHING"
  | "PREPARING"
  | "APPLIED"
  | "PROCESSING"
  | "APPROVED"
  | "REJECTED"
  | "ON_HOLD";

export type PhaseStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "BLOCKED";

export type StepStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "DONE"
  | "BLOCKED"
  | "SKIPPED";

export type StepPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type DocumentType =
  | "PASSPORT"
  | "BIRTH_CERTIFICATE"
  | "MARRIAGE_CERTIFICATE"
  | "DIPLOMA"
  | "TRANSCRIPT"
  | "ECA"
  | "IELTS_RESULT"
  | "CELPIP_RESULT"
  | "TEF_RESULT"
  | "POLICE_CLEARANCE"
  | "MEDICAL_EXAM"
  | "PROOF_OF_FUNDS"
  | "EMPLOYMENT_LETTER"
  | "REFERENCE_LETTER"
  | "PHOTOS"
  | "OTHER";

export type DocumentStatus =
  | "NOT_STARTED"
  | "GATHERING"
  | "SUBMITTED"
  | "APPROVED"
  | "EXPIRED"
  | "NEEDS_UPDATE";

export type NotificationType =
  | "DOCUMENT_EXPIRING"
  | "STEP_DUE"
  | "SCORE_UPDATE"
  | "PROGRAM_CHANGE"
  | "MILESTONE"
  | "REMINDER";

export type AchievementType = "MILESTONE" | "STREAK" | "COMPLETION" | "SCORE";

// ════════════════════════════════════════════
// UI Types (for components)
// ════════════════════════════════════════════

export interface ProfileWithTests extends Profile {
  languageTests: LanguageTest[];
  crsScores: CRSScore[];
  documents: Document[];
}

export interface HouseholdWithMembers extends Household {
  users: User[];
  profiles: Profile[];
}

export interface PlanWithDetails extends ImmigrationPlan {
  program: ImmigrationProgram;
  phases: (JourneyPhase & { steps: JourneyStep[] })[];
}
