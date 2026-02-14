import type { Metadata } from "next";
import { Work_Sans, Playfair_Display, Lora } from "next/font/google";
import { cookies } from "next/headers";
import { Providers } from "@/components/providers/Providers";
import type { Theme } from "@/components/providers/ThemeProvider";
import "./globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["700"],
  style: ["normal", "italic"],
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://brincareducando.com.br"),
  title: {
    default: "Brincar Educando",
    template: "%s | Brincar Educando",
  },
  description:
    "Portal educacional para pais que conecta ciência do desenvolvimento infantil com o brincar.",
  keywords: ["desenvolvimento infantil", "atividades", "educação", "criança", "pais"],
  authors: [{ name: "Brincar Educando" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://brincareducando.com.br",
    siteName: "Brincar Educando",
    title: "Brincar Educando",
    description:
      "Portal educacional para pais que conecta ciência do desenvolvimento infantil com o brincar.",
    images: [{ url: "/quadrado_logo.png", width: 512, height: 512, alt: "Brincar Educando" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brincar Educando",
    description:
      "Portal educacional para pais que conecta ciência do desenvolvimento infantil com o brincar.",
    images: ["/quadrado_logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/icons/icon-192x192.png",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://brincareducando.com.br",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read theme preference from cookie for SSR (no theme flash on load)
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("be-theme");
  const theme = (themeCookie?.value === "acolher" ? "acolher" : "vibrante") as Theme;

  return (
    <html
      lang="pt-BR"
      data-theme={theme}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${workSans.variable} ${playfair.variable} ${lora.variable} antialiased`}
      >
        <Providers defaultTheme={theme}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
