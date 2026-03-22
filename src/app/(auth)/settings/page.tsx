import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { profiles } from "@/db/schema";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  let profile: any = null;

  try {
    profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.user.id),
    });
  } catch {
    // DB error
  }

  return (
    <SettingsClient
      user={{
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
      }}
      profile={profile}
    />
  );
}
