import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PublicNav } from "@/components/layout/PublicNav";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { BlogPreviewSection } from "@/components/landing/BlogPreviewSection";
import { PillarsSection } from "@/components/landing/PillarsSection";
import { NewsletterSection } from "@/components/landing/NewsletterSection";
import { CalmModeNotice } from "@/components/ui/CalmModeNotice";

export default async function HomePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          /* No-op for read-only check on server component */
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <PublicNav user={user} />
      <main>
        <HeroSection />
        <BlogPreviewSection />
        <PillarsSection />
        <NewsletterSection />
      </main>
      <CalmModeNotice />
      <Footer />
    </>
  );
}
