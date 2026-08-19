"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { Loader2 } from "lucide-react";

export function CapacitorNativeRedirect({ isAuthenticated }: { isAuthenticated: boolean }) {
  const router = useRouter();
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    // Redirecionamento automático exclusivo para o aplicativo nativo instalado (Android APK, etc.)
    if (Capacitor.isNativePlatform()) {
      setIsNative(true);
      if (isAuthenticated) {
        router.replace("/dashboard");
      } else {
        router.replace("/auth");
      }
    }
  }, [isAuthenticated, router]);

  // Se estiver no aplicativo nativo instalado, exibe splash de transição em vez da landing page
  if (isNative) {
    return (
      <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[var(--color-background)]">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="font-serif italic text-4xl font-black text-[var(--color-primary)] animate-pulse">
            Brincar.
          </span>
          <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary)]" />
        </div>
      </div>
    );
  }

  return null;
}
