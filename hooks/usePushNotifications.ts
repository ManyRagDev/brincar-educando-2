"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { PushNotifications, type Token, type ActionPerformed } from "@capacitor/push-notifications";
import { createClient } from "@/lib/supabase/client";

export function usePushNotifications(userId?: string) {
  const [token, setToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string>("prompt");

  useEffect(() => {
    // Push Notifications só rodam em plataformas nativas (Android/iOS)
    if (!Capacitor.isNativePlatform() || !userId) return;

    const supabase = createClient();

    async function registerPush() {
      try {
        let perm = await PushNotifications.checkPermissions();

        if (perm.receive === "prompt") {
          perm = await PushNotifications.requestPermissions();
        }

        setPermissionStatus(perm.receive);

        if (perm.receive === "granted") {
          await PushNotifications.register();
        }
      } catch (error) {
        console.error("Erro ao solicitar permissão de Notificação Push:", error);
      }
    }

    // Ouvinte para captura do Token gerado pelo FCM/Capacitor
    const registrationListener = PushNotifications.addListener(
      "registration",
      async (tokenData: Token) => {
        setToken(tokenData.value);
        try {
          await supabase.from("usuario_push_tokens" as any).upsert(
            {
              usuario_id: userId,
              token: tokenData.value,
              plataforma: Capacitor.getPlatform(),
              atualizado_em: new Date().toISOString(),
            },
            { onConflict: "usuario_id,token" }
          );
        } catch (err) {
          console.error("Erro ao salvar token de notificação no Supabase:", err);
        }
      }
    );

    // Ouvinte para erro de registro
    const registrationErrorListener = PushNotifications.addListener(
      "registrationError",
      (error) => {
        console.error("Erro no registro de Push Notification:", error);
      }
    );

    // Ouvinte quando a notificação é clicada pelo usuário
    const actionListener = PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification: ActionPerformed) => {
        const data = notification.notification.data;
        if (data?.url) {
          window.location.href = data.url;
        }
      }
    );

    registerPush();

    return () => {
      registrationListener.then((l) => l.remove());
      registrationErrorListener.then((l) => l.remove());
      actionListener.then((l) => l.remove());
    };
  }, [userId]);

  return { token, permissionStatus };
}
