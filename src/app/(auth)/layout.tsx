import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AuthLayoutClient } from "./layout-client";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <AuthLayoutClient user={session.user}>{children}</AuthLayoutClient>;
}
