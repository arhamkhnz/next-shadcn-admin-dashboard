"use client";

import * as React from "react";

import { FileText, Mail, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

import { INVOICE_PAPER_HEIGHT, INVOICE_PAPER_SCALE, INVOICE_PAPER_WIDTH, type InvoiceFormValues } from "./data";
import { InvoicePaper } from "./invoice-paper";
import { useVisibleCenterPosition } from "./use-visible-center-position";

export function InvoicePreview({ invoice }: { invoice: InvoiceFormValues }) {
  const previewBodyRef = React.useRef<HTMLDivElement>(null);
  const invoicePaperRef = React.useRef<HTMLDivElement>(null);
  const paperTop = useVisibleCenterPosition(previewBodyRef, invoicePaperRef);

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
        {paperTop === null ? (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground text-sm">Loading Preview</div>
        ) : null}
        <div
          ref={invoicePaperRef}
          style={{
            height: INVOICE_PAPER_HEIGHT * INVOICE_PAPER_SCALE,
            top: paperTop ?? "50%",
            transform: paperTop === null ? "translate(-50%, -50%)" : "translateX(-50%)",
            width: INVOICE_PAPER_WIDTH * INVOICE_PAPER_SCALE,
          }}
          className="absolute left-1/2 opacity-0 data-[ready=true]:opacity-100"
          data-ready={paperTop !== null}
        >
          <div style={{ transform: `scale(${INVOICE_PAPER_SCALE})` }} className="origin-top-left">
            <InvoicePaper invoice={invoice} />
          </div>
        </div>
      </div>
    </div>
  );
}
