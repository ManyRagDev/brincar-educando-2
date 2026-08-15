"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";

export function CapacitorNativeRedirect({ isAuthenticated }: { isAuthenticated: boolean }) {
  const router = useRouter();

  useEffect(() => {
    // Se o aplicativo estiver rodando dentro do Capacitor (Android/iOS Nativo)
    if (Capacitor.isNativePlatform()) {
      if (isAuthenticated) {
        router.replace("/dashboard");
      } else {
        router.replace("/auth");
      }
    }
  }, [isAuthenticated, router]);

  return null;
}
