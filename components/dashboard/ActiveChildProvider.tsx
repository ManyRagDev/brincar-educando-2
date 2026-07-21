"use client";

import { createContext, useContext } from "react";
import type { ChildSummary } from "@/lib/children/active-child";

type ActiveChildContextValue = {
  activeChild: ChildSummary | null;
  children: ChildSummary[];
  needsSelection: boolean;
};

const ActiveChildContext = createContext<ActiveChildContextValue | null>(null);

export function ActiveChildProvider({
  value,
  children,
}: {
  value: ActiveChildContextValue;
  children: React.ReactNode;
}) {
  return <ActiveChildContext value={value}>{children}</ActiveChildContext>;
}

export function useActiveChild() {
  const context = useContext(ActiveChildContext);
  if (!context) throw new Error("ActiveChildProvider não foi configurado.");
  return context;
}
