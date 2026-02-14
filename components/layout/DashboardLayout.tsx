import { DashboardSidebar } from "./DashboardSidebar";
import { BottomNav } from "./BottomNav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <DashboardSidebar />

      {/* Main content — offset for sidebar on lg+ */}
      <main className="lg:pl-64 pb-20 lg:pb-0">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
