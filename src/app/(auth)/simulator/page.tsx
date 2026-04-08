import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { profiles, languageTests } from "@/db/schema";
import { SimulatorClient } from "./simulator-client";

export default async function SimulatorPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Fetch primary applicant profile + language tests
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, session.user.id),
    with: {
      languageTests: true,
    },
  });

  // Calculate age from dateOfBirth
  let age = 30;
  if (profile?.dateOfBirth) {
    const now = new Date();
    const dob = new Date(profile.dateOfBirth);
    age = Math.floor(
      (now.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
    age = Math.max(17, Math.min(45, age));
  }

  // Get completed language test CLB level
  const completedTest = profile?.languageTests?.find(
    (t) => t.status === "COMPLETED"
  );

  // Estimate average CLB from test scores (simplified)
  let clb = 7;
  if (completedTest) {
    const scores = [
      Number(completedTest.speaking) || 0,
      Number(completedTest.listening) || 0,
      Number(completedTest.reading) || 0,
      Number(completedTest.writing) || 0,
    ];
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    clb = Math.max(4, Math.min(10, Math.round(avg)));
  }

  // Get spouse profile if married
  let spouseProfile = null;
  let spouseCompletedTest = null;
  const isMarried =
    profile?.maritalStatus === "married" ||
    profile?.maritalStatus === "common_law";

  if (isMarried && profile?.householdId) {
    // Find spouse profile (another profile in same household that's not the primary)
    const householdProfiles = await db.query.profiles.findMany({
      where: and(
        eq(profiles.householdId, profile.householdId),
      ),
      with: {
        languageTests: true,
      },
    });

    spouseProfile = householdProfiles.find(
      (p) => p.userId !== session.user.id
    );

    if (spouseProfile) {
      spouseCompletedTest = spouseProfile.languageTests?.find(
        (t) => t.status === "COMPLETED"
      );
    }
  }

  let spouseClb = 7;
  if (spouseCompletedTest) {
    const scores = [
      Number(spouseCompletedTest.speaking) || 0,
      Number(spouseCompletedTest.listening) || 0,
      Number(spouseCompletedTest.reading) || 0,
      Number(spouseCompletedTest.writing) || 0,
    ];
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    spouseClb = Math.max(4, Math.min(10, Math.round(avg)));
  }

  const initialData = {
    age: String(age),
    education: profile?.educationLevel || "BACHELORS",
    clb: String(clb),
    experience: String(
      Math.min(5, Math.max(0, profile?.yearsOfExperience || 0))
    ),
    canadianExperience: String(
      Math.min(5, Math.max(0, profile?.canadianExperienceYears || 0))
    ),
    hasSpouse: isMarried,
    spouseEducation: spouseProfile?.educationLevel || "BACHELORS",
    spouseClb: String(spouseClb),
    spouseExperience: String(
      Math.min(5, Math.max(0, spouseProfile?.canadianExperienceYears || 0))
    ),
  };

  return <SimulatorClient initialData={initialData} />;
}
