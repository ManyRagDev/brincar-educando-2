import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import nodemailer from "npm:nodemailer";

/**
 * Supabase Auth Hook / SMTP Router
 * Handles transactional emails (confirmation, recovery, etc.)
 * for Brincar Educando with project isolation.
 */

const SMTP_CONFIG = {
    host: "smtp.hostinger.com",
    port: 587,
    secure: false, // true for 465, false for 587
    auth: {
        user: Deno.env.get("SMTP_USER"),
        pass: Deno.env.get("SMTP_PASS"),
    },
};

serve(async (req) => {
    try {
        const body = await req.json();
        console.log("Receiving email request:", body);

        // 1. Identify the project via user metadata
        // For Auth Hooks, Supabase sends user data in the body
        const user_metadata = body.user?.user_metadata || {};
        const app_id = user_metadata.app_id;

        // 2. Isolation Check
        if (app_id !== "brincareducando") {
            console.log(`Ignoring request for app_id: ${app_id}. Redirecting to default Supabase flow.`);
            // Returning a 400 or specific status might tell Supabase to fallback 
            // depends on Auth Hook configuration. 
            return new Response(JSON.stringify({
                error: "unauthorized_app",
                message: "This hook is only for Brincar Educando."
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // 3. Prepare Transporter
        const transporter = nodemailer.createTransport(SMTP_CONFIG);

        // 4. Construct Email based on Hook Event
        // Supabase Auth Hooks provide different structures depending on the event
        const { user, mail_data } = body;
        const to = user.email;
        const { subject, template_name, otp, confirmation_url } = mail_data || {};

        // Map Template Names (Internal Supabase names) to Friendly Brincar Educando content
        let htmlContent = "";
        let emailSubject = subject || "Brincar Educando - Notificação";

        if (confirmation_url) {
            emailSubject = "Seja bem-vindo ao Brincar Educando! 🎈";
            htmlContent = `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">O brincar transforma!</h1>
          <p>Olá,</p>
          <p>Ficamos muito felizes em ter você conosco. Para começar sua jornada, confirme seu e-mail clicando no botão abaixo:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmation_url}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Confirmar meu E-mail</a>
          </div>
          <p style="font-size: 12px; color: #666;">Se o botão não funcionar, copie e cole este link: <br> ${confirmation_url}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 14px;">Equipe Brincar Educando</p>
        </div>
      `;
        } else {
            // Fallback for other triggers (recovery, etc.)
            htmlContent = `<p>Olá, este é seu código/link de acesso: <strong>${otp || confirmation_url || ""}</strong></p>`;
        }

        // 5. Send Mail
        const info = await transporter.sendMail({
            from: `"Brincar Educando" <${SMTP_CONFIG.auth.user}>`,
            to,
            subject: emailSubject,
            html: htmlContent,
        });

        console.log("Email sent successfully:", info.messageId);

        return new Response(JSON.stringify({ ok: true, messageId: info.messageId }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (err) {
        console.error("SMTP Router Error:", err);
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});
