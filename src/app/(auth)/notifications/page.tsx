import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq, desc } from "drizzle-orm";
import { notifications } from "@/db/schema";
import { NotificationsClient } from "./notifications-client";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const householdId = session.user.householdId;
  let notifs: any[] = [];

  if (householdId) {
    try {
      notifs = await db.query.notifications.findMany({
        where: eq(notifications.householdId, householdId),
        orderBy: [desc(notifications.createdAt)],
      });
    } catch {
      // DB error
    }
  }

  return <NotificationsClient notifications={notifs} />;
}
