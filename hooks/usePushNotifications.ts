"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { createClient } from "@/lib/supabase/client";

export function usePushNotifications(userId?: string) {
  const [token, setToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string>("prompt");

  useEffect(() => {
    // Só tenta registrar se for plataforma nativa (Android/iOS), se houver usuário e se o plugin de Push estiver disponível
    if (!Capacitor.isNativePlatform() || !userId || !Capacitor.isPluginAvailable("PushNotifications")) {
      return;
    }

    let isMounted = true;

    async function initPush() {
      try {
        const { PushNotifications } = await import("@capacitor/push-notifications");

        // Ouvinte para captura do Token gerado pelo FCM/Capacitor
        const registrationListener = await PushNotifications.addListener(
          "registration",
          async (tokenData) => {
            if (!isMounted) return;
            setToken(tokenData.value);
            try {
              const supabase = createClient();
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
        const registrationErrorListener = await PushNotifications.addListener(
          "registrationError",
          (error) => {
            console.warn("Aviso no registro de Push Notification (Firebase/FCM não configurado?):", error);
          }
        );

        // Ouvinte quando a notificação é clicada pelo usuário
        const actionListener = await PushNotifications.addListener(
          "pushNotificationActionPerformed",
          (notification) => {
            const data = notification.notification.data;
            if (data?.url) {
              window.location.href = data.url;
            }
          }
        );

        // Checar e solicitar permissões de forma totalmente isolada para não travar o app
        try {
          let perm = await PushNotifications.checkPermissions();
          if (perm.receive === "prompt") {
            perm = await PushNotifications.requestPermissions();
          }
          if (isMounted) setPermissionStatus(perm.receive);

          if (perm.receive === "granted") {
            await PushNotifications.register();
          }
        } catch (permError) {
          console.warn("Notificações Push desativadas ou Firebase pendente:", permError);
        }

        return () => {
          registrationListener.remove();
          registrationErrorListener.remove();
          actionListener.remove();
        };
      } catch (err) {
        console.warn("Plugin de Notificações Push não pôde ser inicializado nativamente:", err);
      }
    }

    const cleanupPromise = initPush();

    return () => {
      isMounted = false;
      cleanupPromise.then((cleanup) => cleanup && cleanup());
    };
  }, [userId]);

  return { token, permissionStatus };
}
