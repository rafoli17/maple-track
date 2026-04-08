CREATE TYPE "public"."achievement_type" AS ENUM('MILESTONE', 'STREAK', 'COMPLETION', 'SCORE');--> statement-breakpoint
CREATE TYPE "public"."document_status" AS ENUM('NOT_STARTED', 'GATHERING', 'SUBMITTED', 'APPROVED', 'EXPIRED', 'NEEDS_UPDATE');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('PASSPORT', 'BIRTH_CERTIFICATE', 'MARRIAGE_CERTIFICATE', 'DIPLOMA', 'TRANSCRIPT', 'ECA', 'IELTS_RESULT', 'CELPIP_RESULT', 'TEF_RESULT', 'POLICE_CLEARANCE', 'MEDICAL_EXAM', 'PROOF_OF_FUNDS', 'EMPLOYMENT_LETTER', 'REFERENCE_LETTER', 'PHOTOS', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."education_level" AS ENUM('HIGH_SCHOOL', 'ONE_YEAR_DIPLOMA', 'TWO_YEAR_DIPLOMA', 'BACHELORS', 'POST_GRADUATION', 'TWO_OR_MORE_CERTIFICATES', 'MASTERS', 'PHD', 'TECHNICAL');--> statement-breakpoint
CREATE TYPE "public"."language_test_status" AS ENUM('PLANNED', 'SCHEDULED', 'COMPLETED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."language_test_type" AS ENUM('IELTS_GENERAL', 'IELTS_ACADEMIC', 'CELPIP', 'TEF', 'TCF');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('DOCUMENT_EXPIRING', 'STEP_DUE', 'SCORE_UPDATE', 'PROGRAM_CHANGE', 'MILESTONE', 'REMINDER');--> statement-breakpoint
CREATE TYPE "public"."phase_status" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED');--> statement-breakpoint
CREATE TYPE "public"."plan_priority" AS ENUM('PRIMARY', 'SECONDARY', 'TERTIARY');--> statement-breakpoint
CREATE TYPE "public"."plan_status" AS ENUM('RESEARCHING', 'PREPARING', 'APPLIED', 'PROCESSING', 'APPROVED', 'REJECTED', 'ON_HOLD');--> statement-breakpoint
CREATE TYPE "public"."program_category" AS ENUM('EXPRESS_ENTRY', 'PNP', 'FAMILY', 'PILOT', 'STUDY');--> statement-breakpoint
CREATE TYPE "public"."step_priority" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "public"."step_status" AS ENUM('TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED', 'SKIPPED');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('APPLICANT', 'ADMIN');--> statement-breakpoint
CREATE TABLE "accounts" (
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"household_id" uuid NOT NULL,
	"type" "achievement_type" NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text,
	"unlocked_at" timestamp with time zone,
	"metadata" json
);
--> statement-breakpoint
CREATE TABLE "crs_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"total_score" integer NOT NULL,
	"core_score" integer,
	"spouse_score" integer,
	"skill_transfer_score" integer,
	"additional_score" integer,
	"breakdown" json,
	"calculated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"immigration_plan_id" uuid,
	"name" text NOT NULL,
	"type" "document_type" NOT NULL,
	"status" "document_status" DEFAULT 'NOT_STARTED' NOT NULL,
	"issue_date" timestamp with time zone,
	"expiry_date" timestamp with time zone,
	"file_url" text,
	"notes" text,
	"required_for_programs" json,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "households" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "immigration_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"household_id" uuid NOT NULL,
	"program_id" uuid NOT NULL,
	"priority" "plan_priority" NOT NULL,
	"status" "plan_status" DEFAULT 'RESEARCHING' NOT NULL,
	"started_at" timestamp with time zone,
	"target_date" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "immigration_programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"category" "program_category" NOT NULL,
	"description" text,
	"requirements" json,
	"processing_time_months" integer,
	"minimum_clb" integer,
	"minimum_crs" integer,
	"minimum_funds" numeric(12, 2),
	"is_active" boolean DEFAULT true NOT NULL,
	"last_updated" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "immigration_programs_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "journey_phases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"immigration_plan_id" uuid NOT NULL,
	"phase_number" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" "phase_status" DEFAULT 'NOT_STARTED' NOT NULL,
	"estimated_duration_days" integer,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"order" integer NOT NULL,
	"macro_milestone_id" text
);
--> statement-breakpoint
CREATE TABLE "journey_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"journey_phase_id" uuid NOT NULL,
	"immigration_plan_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"instructions" text,
	"status" "step_status" DEFAULT 'TODO' NOT NULL,
	"due_date" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"assigned_to" uuid,
	"priority" "step_priority" DEFAULT 'MEDIUM' NOT NULL,
	"order" integer NOT NULL,
	"parent_step_id" uuid,
	"action_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "language_tests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"test_type" "language_test_type" NOT NULL,
	"speaking" numeric(4, 1),
	"listening" numeric(4, 1),
	"reading" numeric(4, 1),
	"writing" numeric(4, 1),
	"overall_score" numeric(4, 1),
	"clb_equivalent" integer,
	"test_date" timestamp with time zone,
	"expiry_date" timestamp with time zone,
	"status" "language_test_status" DEFAULT 'PLANNED' NOT NULL,
	"target_speaking" numeric(4, 1),
	"target_listening" numeric(4, 1),
	"target_reading" numeric(4, 1),
	"target_writing" numeric(4, 1),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"household_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp with time zone,
	"link" text,
	"scheduled_for" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"household_id" uuid NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"date_of_birth" timestamp with time zone,
	"nationality" text,
	"current_country" text,
	"education_level" "education_level",
	"field_of_study" text,
	"years_of_experience" integer,
	"current_occupation" text,
	"noc_code" text,
	"canadian_experience_years" integer DEFAULT 0,
	"canadian_education" boolean DEFAULT false,
	"marital_status" text,
	"has_children" boolean DEFAULT false,
	"number_of_children" integer DEFAULT 0,
	"funds_available" numeric(12, 2),
	"is_primary_applicant" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"email_verified" timestamp with time zone,
	"image" text,
	"role" "user_role" DEFAULT 'APPLICANT' NOT NULL,
	"household_id" uuid,
	"onboarding_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_household_id_households_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crs_scores" ADD CONSTRAINT "crs_scores_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_immigration_plan_id_immigration_plans_id_fk" FOREIGN KEY ("immigration_plan_id") REFERENCES "public"."immigration_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "immigration_plans" ADD CONSTRAINT "immigration_plans_household_id_households_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "immigration_plans" ADD CONSTRAINT "immigration_plans_program_id_immigration_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."immigration_programs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journey_phases" ADD CONSTRAINT "journey_phases_immigration_plan_id_immigration_plans_id_fk" FOREIGN KEY ("immigration_plan_id") REFERENCES "public"."immigration_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journey_steps" ADD CONSTRAINT "journey_steps_journey_phase_id_journey_phases_id_fk" FOREIGN KEY ("journey_phase_id") REFERENCES "public"."journey_phases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journey_steps" ADD CONSTRAINT "journey_steps_immigration_plan_id_immigration_plans_id_fk" FOREIGN KEY ("immigration_plan_id") REFERENCES "public"."immigration_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journey_steps" ADD CONSTRAINT "journey_steps_assigned_to_profiles_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "language_tests" ADD CONSTRAINT "language_tests_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_household_id_households_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_household_id_households_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_household_id_households_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE no action ON UPDATE no action;