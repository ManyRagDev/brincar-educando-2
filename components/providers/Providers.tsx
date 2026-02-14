"use client";

import { type ReactNode } from "react";
import { ThemeProvider, type Theme } from "./ThemeProvider";
import { QueryProvider } from "./QueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

interface ProvidersProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function Providers({ children, defaultTheme = "vibrante" }: ProvidersProps) {
  return (
    <ThemeProvider defaultTheme={defaultTheme}>
      <QueryProvider>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
