"use client";

import * as React from "react";

import { FileText, Mail, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { InvoiceFormValues } from "./data";
import { InvoicePaper } from "./invoice-paper";

export function InvoicePreview({ invoice }: { invoice: InvoiceFormValues }) {
  const previewBodyRef = React.useRef<HTMLDivElement>(null);
  const invoicePaperRef = React.useRef<HTMLDivElement>(null);
  const [paperTop, setPaperTop] = React.useState<number | null>(null);

  React.useEffect(() => {
    function updatePaperTop() {
      const previewBody = previewBodyRef.current;
      const invoicePaper = invoicePaperRef.current;
      if (!previewBody || !invoicePaper) return;

      const bodyRect = previewBody.getBoundingClientRect();
      const visibleTop = Math.max(bodyRect.top, 0);
      const visibleBottom = Math.min(bodyRect.bottom, window.innerHeight);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibleCenter =
        visibleHeight > 0 ? visibleTop + visibleHeight / 2 - bodyRect.top : previewBody.clientHeight / 2;
      const padding = 16;
      const maxTop = Math.max(padding, previewBody.clientHeight - invoicePaper.offsetHeight - padding);

      const nextTop = Math.min(Math.max(visibleCenter - invoicePaper.offsetHeight / 2, padding), maxTop);

      if (process.env.NODE_ENV === "development") {
        console.log("Invoice preview spacing", {
          above: Math.round(nextTop),
          below: Math.round(previewBody.clientHeight - nextTop - invoicePaper.offsetHeight),
        });
      }

      setPaperTop(nextTop);
    }

    updatePaperTop();
    window.addEventListener("scroll", updatePaperTop, { passive: true });
    window.addEventListener("resize", updatePaperTop);

    return () => {
      window.removeEventListener("scroll", updatePaperTop);
      window.removeEventListener("resize", updatePaperTop);
    };
  }, []);

  return (
    <div className="flex flex-col rounded-xl border bg-card">
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="font-medium text-lg">Preview</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline">
            <Mail data-icon="inline-start" />
            Email
          </Button>
          <Button type="button" variant="outline">
            <Printer data-icon="inline-start" />
            Print
          </Button>
          <Button type="button" variant="outline">
            <FileText data-icon="inline-start" />
            PDF
          </Button>
        </div>
      </div>

      <div
        ref={previewBodyRef}
        className="@container/preview relative min-h-[calc(100svh-15rem)] flex-1 rounded-b-xl bg-stone-200 p-4 dark:bg-stone-800"
      >
        <div
          ref={invoicePaperRef}
          style={{
            top: paperTop ?? "50%",
            transform: paperTop === null ? "translate(-50%, -50%)" : "translateX(-50%)",
          }}
          className="absolute left-1/2 @2xl/preview:h-[686px] @lg/preview:h-[581px] @md/preview:h-[528px] @sm/preview:h-[475px] @xl/preview:h-[634px] h-[422px] @2xl/preview:w-[530px] @lg/preview:w-[449px] @md/preview:w-[408px] @sm/preview:w-[367px] @xl/preview:w-[490px] w-[326px]"
        >
          <InvoicePaper invoice={invoice} />
        </div>
      </div>
    </div>
  );
}
