import { PublicNav } from "@/components/layout/PublicNav";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { BlogPreviewSection } from "@/components/landing/BlogPreviewSection";
import { PillarsSection } from "@/components/landing/PillarsSection";
import { NewsletterSection } from "@/components/landing/NewsletterSection";
import { CalmModeNotice } from "@/components/ui/CalmModeNotice";
import { CapacitorNativeRedirect } from "@/components/providers/CapacitorNativeRedirect";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <CapacitorNativeRedirect isAuthenticated={Boolean(user)} />
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
