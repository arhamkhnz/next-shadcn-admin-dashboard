import { FeaturesSection } from "./_components/features-section";
import { HeroSection } from "./_components/hero-section";
import { LandingHeader } from "./_components/landing-header";
import { VariantsSection } from "./_components/variants-section";

export default function Home() {
  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
        <LandingHeader />
        <HeroSection />
        <FeaturesSection />
        <VariantsSection />
      </div>
    </main>
  );
}
