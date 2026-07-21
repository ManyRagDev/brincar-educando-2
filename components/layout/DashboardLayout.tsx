import { DashboardSidebar } from "./DashboardSidebar";
import { BottomNav } from "./BottomNav";
import { ActiveChildProvider } from "@/components/dashboard/ActiveChildProvider";
import { EducationalScopeNotice } from "@/components/dashboard/EducationalScopeNotice";
import type { ChildSummary } from "@/lib/children/active-child";

interface DashboardLayoutProps {
  children: React.ReactNode;
  childState: {
    activeChild: ChildSummary | null;
    children: ChildSummary[];
    needsSelection: boolean;
  };
}

export function DashboardLayout({ children, childState }: DashboardLayoutProps) {
  return (
    <ActiveChildProvider value={childState}>
      <div className="min-h-screen bg-[var(--color-background)]">
        <DashboardSidebar />

        <main className="pb-20 lg:pl-64 lg:pb-0">
          <EducationalScopeNotice />
          {children}
        </main>

        <BottomNav />
      </div>
    </ActiveChildProvider>
  );
}
