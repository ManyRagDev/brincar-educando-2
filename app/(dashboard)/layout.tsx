import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { requireAppUser } from "@/lib/auth/require-app-user";
import { getActiveChild } from "@/lib/children/active-child";

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { supabase, user } = await requireAppUser();
  const childState = await getActiveChild(supabase, user.id);

  return <DashboardLayout childState={childState}>{children}</DashboardLayout>;
}
