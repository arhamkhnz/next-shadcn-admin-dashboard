import { siGithub, siX } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer>
      <div className="text-muted-foreground flex flex-row items-center justify-between gap-6 text-sm">
        <p>
          Mantido por{" "}
          <a
            className="text-foreground decoration-border hover:decoration-foreground underline underline-offset-4 transition-colors"
            href="https://x.com/arhamkhnz"
            target="_blank"
            rel="noreferrer"
          >
            @arhamkhnz
          </a>
        </p>
        <div className="flex items-center gap-3">
          <Button asChild size="icon-sm" variant="link">
            <a
              href="https://github.com/arhamkhnz"
              target="_blank"
              rel="noreferrer"
              aria-label="Visite @arhamkhnz no GitHub"
            >
              <SimpleIcon icon={siGithub} aria-hidden className="size-4.5 fill-current" />
            </a>
          </Button>
          <Button asChild size="icon-sm" variant="link">
            <a href="https://x.com/arhamkhnz" target="_blank" rel="noreferrer" aria-label="Visite @arhamkhnz no X">
              <SimpleIcon icon={siX} aria-hidden className="size-4 fill-current" />
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
