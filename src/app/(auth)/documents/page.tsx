import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { documents, profiles } from "@/db/schema";
import { DocumentsClient } from "./documents-client";

export default async function DocumentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const householdId = session.user.householdId;
  let docs: any[] = [];
  let householdProfiles: any[] = [];

  if (householdId) {
    try {
      const [docsResult, profilesResult] = await Promise.all([
        db.query.documents.findMany({
          with: { profile: true },
        }),
        db.query.profiles.findMany({
          where: eq(profiles.householdId, householdId),
        }),
      ]);
      docs = docsResult || [];
      householdProfiles = profilesResult || [];
    } catch {
      // DB error
    }
  }

  // Group documents by profile
  const grouped: Record<string, any[]> = {};
  for (const doc of docs) {
    const profileId = doc.profileId || "unassigned";
    if (!grouped[profileId]) grouped[profileId] = [];
    grouped[profileId].push(doc);
  }

  return (
    <DocumentsClient
      groupedDocs={grouped}
      profiles={householdProfiles}
    />
  );
}
