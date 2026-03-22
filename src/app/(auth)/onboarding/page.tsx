import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OnboardingClient } from "./onboarding-client";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // If onboarding is already complete, go to dashboard
  if (session.user.onboardingCompleted) {
    redirect("/dashboard");
  }

  return <OnboardingClient userName={session.user.name || "Viajante"} />;
}
