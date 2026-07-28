"use client";

import { usePushNotifications } from "@/hooks/usePushNotifications";

export function PushNotificationInitializer({ userId }: { userId?: string }) {
  usePushNotifications(userId);
  return null;
}
