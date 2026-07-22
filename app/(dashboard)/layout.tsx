import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { requireAppUser } from "@/lib/auth/require-app-user";
import { getActiveChild } from "@/lib/children/active-child";
import { EDUCATIONAL_SCOPE_NOTICE_COOKIE } from "@/lib/ui-preferences";
import { cookies } from "next/headers";

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { supabase, user } = await requireAppUser();
  const childState = await getActiveChild(supabase, user.id);
  const cookieStore = await cookies();
  const educationalScopeNoticeExpanded =
    cookieStore.get(EDUCATIONAL_SCOPE_NOTICE_COOKIE)?.value !== "collapsed";

  return (
    <DashboardLayout
      childState={childState}
      educationalScopeNoticeExpanded={educationalScopeNoticeExpanded}
    >
      {children}
    </DashboardLayout>
  );
}
