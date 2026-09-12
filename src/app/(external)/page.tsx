import { FeaturesSection } from "./_components/features-section";
import { HeroSection } from "./_components/hero-section";
import { LandingHeader } from "./_components/landing-header";
import { VariantsSection } from "./_components/variants-section";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <VariantsSection />
    </main>
  );
}
