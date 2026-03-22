import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { immigrationPrograms } from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const programs = [
  {
    name: "Express Entry — Federal Skilled Worker (FSWP)",
    code: "EXPRESS_ENTRY_FSWP",
    category: "EXPRESS_ENTRY" as const,
    description: "Programa principal do Express Entry para trabalhadores qualificados com experiência estrangeira. Baseado em pontos CRS.",
    requirements: { minEducation: "BACHELORS", minExperience: 1, minCLB: 7, proofOfFunds: true },
    processingTimeMonths: 6,
    minimumCLB: 7,
    minimumCRS: 470,
    minimumFunds: "13757.00",
  },
  {
    name: "Express Entry — Canadian Experience Class (CEC)",
    code: "EXPRESS_ENTRY_CEC",
    category: "EXPRESS_ENTRY" as const,
    description: "Para quem já tem experiência de trabalho qualificado no Canadá. Não requer proof of funds.",
    requirements: { minCanadianExperience: 1, minCLB: 7 },
    processingTimeMonths: 6,
    minimumCLB: 7,
    minimumCRS: 450,
    minimumFunds: null,
  },
  {
    name: "Express Entry — Federal Skilled Trades (FST)",
    code: "EXPRESS_ENTRY_FST",
    category: "EXPRESS_ENTRY" as const,
    description: "Para profissionais de trades qualificados com oferta de emprego ou certificação provincial.",
    requirements: { minExperience: 2, minCLB: 5, tradesCertification: true },
    processingTimeMonths: 6,
    minimumCLB: 5,
    minimumCRS: 400,
    minimumFunds: null,
  },
  {
    name: "Express Entry — Category-Based (Healthcare)",
    code: "EXPRESS_ENTRY_HEALTHCARE",
    category: "EXPRESS_ENTRY" as const,
    description: "Seleção por categoria para profissionais de saúde. Draws específicos com CRS mais baixo.",
    requirements: { category: "healthcare", minCLB: 7 },
    processingTimeMonths: 6,
    minimumCLB: 7,
    minimumCRS: 430,
    minimumFunds: "13757.00",
  },
  {
    name: "Express Entry — Category-Based (STEM)",
    code: "EXPRESS_ENTRY_STEM",
    category: "EXPRESS_ENTRY" as const,
    description: "Seleção por categoria para profissionais de STEM. Draws com foco em tecnologia e engenharia.",
    requirements: { category: "stem", minCLB: 7 },
    processingTimeMonths: 6,
    minimumCLB: 7,
    minimumCRS: 440,
    minimumFunds: "13757.00",
  },
  {
    name: "Ontario Immigrant Nominee Program (OINP)",
    code: "PNP_ONTARIO",
    category: "PNP" as const,
    description: "Provincial Nominee Program de Ontario. Adiciona 600 pontos ao CRS. Várias streams disponíveis.",
    requirements: { province: "Ontario", minCLB: 6 },
    processingTimeMonths: 12,
    minimumCLB: 6,
    minimumCRS: null,
    minimumFunds: "13757.00",
  },
  {
    name: "British Columbia PNP (BC PNP)",
    code: "PNP_BC",
    category: "PNP" as const,
    description: "Provincial Nominee Program da British Columbia. Tech stream popular para profissionais de TI.",
    requirements: { province: "British Columbia", minCLB: 6 },
    processingTimeMonths: 12,
    minimumCLB: 6,
    minimumCRS: null,
    minimumFunds: "13757.00",
  },
  {
    name: "Alberta Advantage Immigration Program (AAIP)",
    code: "PNP_ALBERTA",
    category: "PNP" as const,
    description: "Provincial Nominee Program de Alberta. Diversas streams incluindo Alberta Express Entry.",
    requirements: { province: "Alberta", minCLB: 5 },
    processingTimeMonths: 12,
    minimumCLB: 5,
    minimumCRS: null,
    minimumFunds: "13757.00",
  },
  {
    name: "Spousal Sponsorship (Inland)",
    code: "SPOUSAL_INLAND",
    category: "FAMILY" as const,
    description: "Sponsorship do cônjuge que já está no Canadá. Permite open work permit durante processamento.",
    requirements: { sponsorInCanada: true, validRelationship: true },
    processingTimeMonths: 12,
    minimumCLB: null,
    minimumCRS: null,
    minimumFunds: null,
  },
  {
    name: "Spousal Sponsorship (Outland)",
    code: "SPOUSAL_OUTLAND",
    category: "FAMILY" as const,
    description: "Sponsorship do cônjuge que está fora do Canadá. Processamento geralmente mais rápido que inland.",
    requirements: { validRelationship: true },
    processingTimeMonths: 12,
    minimumCLB: null,
    minimumCRS: null,
    minimumFunds: null,
  },
  {
    name: "Rural Community Immigration Pilot (RCIP)",
    code: "RCIP",
    category: "PILOT" as const,
    description: "Programa piloto para imigração em comunidades rurais do Canadá. Requer job offer da comunidade.",
    requirements: { ruralJobOffer: true, minCLB: 4 },
    processingTimeMonths: 18,
    minimumCLB: 4,
    minimumCRS: null,
    minimumFunds: null,
  },
  {
    name: "Atlantic Immigration Program (AIP)",
    code: "AIP",
    category: "PILOT" as const,
    description: "Programa para imigração nas províncias atlânticas (NB, NS, PE, NL). Requer job offer e endorsement.",
    requirements: { atlanticJobOffer: true, minCLB: 4 },
    processingTimeMonths: 12,
    minimumCLB: 4,
    minimumCRS: null,
    minimumFunds: null,
  },
  {
    name: "Study Permit → PGWP → PR",
    code: "STUDY_PGWP",
    category: "STUDY" as const,
    description: "Pathway via estudo no Canadá: study permit → PGWP (Post-Graduation Work Permit) → Express Entry ou PNP.",
    requirements: { acceptanceLetter: true, minFunds: true },
    processingTimeMonths: 36,
    minimumCLB: 6,
    minimumCRS: null,
    minimumFunds: "20000.00",
  },
];

async function seed() {
  console.log("🌱 Seeding immigration programs...");

  for (const program of programs) {
    await db
      .insert(immigrationPrograms)
      .values({
        name: program.name,
        code: program.code,
        category: program.category,
        description: program.description,
        requirements: program.requirements,
        processingTimeMonths: program.processingTimeMonths,
        minimumCLB: program.minimumCLB,
        minimumCRS: program.minimumCRS,
        minimumFunds: program.minimumFunds,
        isActive: true,
      })
      .onConflictDoNothing();
  }

  console.log(`✅ ${programs.length} programs seeded!`);
}

seed().catch(console.error);
