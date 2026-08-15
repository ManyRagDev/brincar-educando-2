import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardMobileHeader } from "./DashboardMobileHeader";
import { BottomNav } from "./BottomNav";
import { ActiveChildProvider } from "@/components/dashboard/ActiveChildProvider";
import { EducationalScopeNotice } from "@/components/dashboard/EducationalScopeNotice";
import { DashboardNavigationFeedback } from "./DashboardNavigationFeedback";
import type { ChildSummary } from "@/lib/children/active-child";

interface DashboardLayoutProps {
  children: React.ReactNode;
  educationalScopeNoticeExpanded: boolean;
  childState: {
    activeChild: ChildSummary | null;
    children: ChildSummary[];
    needsSelection: boolean;
  };
}

export function DashboardLayout({
  children,
  childState,
  educationalScopeNoticeExpanded,
}: DashboardLayoutProps) {
  return (
    <ActiveChildProvider value={childState}>
      <div className="min-h-screen bg-[var(--color-background)]">
        <DashboardNavigationFeedback />
        <DashboardMobileHeader />
        <DashboardSidebar />

        <main className="pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pl-60 lg:pb-0">
          {children}
        </main>

        <BottomNav />
      </div>
    </ActiveChildProvider>
  );
}
