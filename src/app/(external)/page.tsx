import { Separator } from "@/components/ui/separator";

import { Footer } from "./_components/footer";
import { Intro } from "./_components/intro";
import { Overview } from "./_components/overview";
import { Showcase } from "./_components/showcase";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground" data-landing-page>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 p-8">
        <Showcase />
        <Intro />
        <Separator />
        <Overview />
        <Separator />
        <Footer />
      </div>
    </main>
  );
}
