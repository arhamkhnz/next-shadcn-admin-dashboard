import { FeaturesSection } from "./_components/features-section";
import { HeroContent } from "./_components/hero-content";
import { HeroSection } from "./_components/hero-section";
import { VariantsSection } from "./_components/variants-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-8 py-8">
        <HeroSection />
        <HeroContent />
        <FeaturesSection />
        <VariantsSection />
      </div>
    </main>
  );
}
