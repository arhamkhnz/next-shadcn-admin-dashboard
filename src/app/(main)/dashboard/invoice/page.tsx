import type { CSSProperties } from "react";

import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Eye,
  FileText,
  GripVertical,
  Hash,
  Mail,
  Moon,
  Plus,
  Send,
  Sun,
  Trash2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const invoiceItems = [
  {
    description: "Cloud Hosting Subscription",
    quantity: "1",
    price: "$3,500.00",
    amount: "$3,500.00",
  },
  {
    description: "Data Analytics Report",
    quantity: "2",
    price: "$750.00",
    amount: "$1,500.00",
  },
  {
    description: "On-Site Technical Support",
    quantity: "1",
    price: "$400.00",
    amount: "$400.00",
  },
];

export default function Page() {
  return (
    <div
      className="mx-auto flex w-full max-w-[1480px] flex-col gap-6"
      style={
        {
          "--invoice-accent": "oklch(0.42 0.105 196)",
          "--invoice-accent-foreground": "oklch(0.98 0.016 196)",
          "--invoice-soft": "oklch(0.96 0.021 196)",
        } as CSSProperties
      }
    >
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span className="font-medium text-foreground">Invoices</span>
            <ChevronRight className="size-4" />
            <span>Create</span>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="font-heading font-semibold text-3xl tracking-tight">Create New Invoice</h1>
            <p className="text-muted-foreground">Create and send professional invoices in seconds.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="lg">
            <Upload data-icon="inline-start" />
            Save as Draft
          </Button>
          <Button
            size="lg"
            className="bg-[var(--invoice-accent)] text-[var(--invoice-accent-foreground)] shadow-sm hover:bg-[color-mix(in_oklch,var(--invoice-accent),black_12%)]"
          >
            <Send data-icon="inline-start" />
            Send Invoice
          </Button>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[minmax(520px,0.92fr)_minmax(580px,1.08fr)]">
        <Card className="rounded-xl py-0">
          <CardContent className="flex flex-col gap-6 p-6">
            <Tabs defaultValue="general" className="gap-0">
              <TabsList variant="line" className="grid h-10 w-full grid-cols-3 border-b">
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger
                  value="general"
                  className="data-active:text-[var(--invoice-accent)] group-data-[variant=line]/tabs-list:data-active:after:bg-[var(--invoice-accent)]"
                >
                  General
                </TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
              </TabsList>
            </Tabs>

            <section className="flex flex-col gap-5">
              <h2 className="font-semibold text-xl tracking-tight">Invoice Details</h2>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="invoice-number">Invoice Number</FieldLabel>
                  <InputGroup>
                    <InputGroupInput id="invoice-number" value="INV-2025-0425" readOnly />
                    <InputGroupAddon align="inline-end">
                      <Hash className="size-4" />
                    </InputGroupAddon>
                  </InputGroup>
                </Field>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="issue-date">Issue Date</FieldLabel>
                    <InputGroup>
                      <InputGroupInput id="issue-date" value="May 12, 2025" readOnly />
                      <InputGroupAddon align="inline-end">
                        <CalendarDays className="size-4" />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="due-date">Due Date</FieldLabel>
                    <InputGroup>
                      <InputGroupInput id="due-date" value="May 26, 2025" readOnly />
                      <InputGroupAddon align="inline-end">
                        <CalendarDays className="size-4" />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                </div>
              </FieldGroup>
            </section>

            <Separator />

            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-xl tracking-tight">Billed To</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--invoice-accent)] hover:text-[var(--invoice-accent)]"
                >
                  <Plus data-icon="inline-start" />
                  Add New Client
                </Button>
              </div>

              <Field>
                <FieldLabel>Client</FieldLabel>
                <button
                  type="button"
                  className="flex min-h-16 w-full items-center gap-3 rounded-lg border bg-background px-3 text-left text-sm transition-colors hover:bg-muted/60"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-foreground">
                    <span className="block size-6 -skew-x-12 bg-foreground" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">Brightstone Industries</span>
                    <span className="block truncate text-muted-foreground">accounts@brightstone.com</span>
                  </span>
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                </button>
              </Field>
            </section>

            <Separator />

            <section className="flex flex-col gap-4">
              <h2 className="font-semibold text-xl tracking-tight">Invoice Items</h2>

              <div className="grid grid-cols-[1fr_52px_108px_104px_28px] items-center gap-3 px-8 font-medium text-muted-foreground text-xs max-md:hidden">
                <span>Item / Description</span>
                <span className="text-center">Qty</span>
                <span className="text-center">Unit Price</span>
                <span className="text-right">Amount</span>
                <span />
              </div>

              <div className="flex flex-col gap-3">
                {invoiceItems.map((item) => (
                  <div
                    key={item.description}
                    className="grid items-center gap-3 md:grid-cols-[16px_minmax(180px,1fr)_52px_108px_104px_28px]"
                  >
                    <GripVertical className="hidden size-4 text-muted-foreground md:block" />
                    <Input
                      value={item.description}
                      readOnly
                      className="h-11"
                      aria-label={`${item.description} description`}
                    />
                    <Input
                      value={item.quantity}
                      readOnly
                      className="h-11 text-center"
                      aria-label={`${item.description} quantity`}
                    />
                    <Input
                      value={item.price}
                      readOnly
                      className="h-11 text-center"
                      aria-label={`${item.description} unit price`}
                    />
                    <div className="text-right font-medium text-sm max-md:text-left">{item.amount}</div>
                    <Button variant="ghost" size="icon-sm" aria-label={`Remove ${item.description}`}>
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-3">
                <Separator />
                <Button variant="outline" className="text-[var(--invoice-accent)]">
                  <Plus data-icon="inline-start" />
                  Add Item
                </Button>
                <Separator />
              </div>
            </section>

            <Separator />

            <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
              <Field>
                <FieldLabel>Tax</FieldLabel>
                <button
                  type="button"
                  className="flex h-12 items-center justify-between gap-3 rounded-lg border bg-background px-3 text-sm"
                >
                  <span>Sales Tax (10%)</span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </button>
              </Field>
              <div className="grid grid-cols-[1fr_96px] gap-4">
                <Field>
                  <FieldLabel>Discount</FieldLabel>
                  <button
                    type="button"
                    className="flex h-12 items-center justify-between gap-3 rounded-lg border bg-background px-3 text-sm"
                  >
                    <span>No Discount</span>
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </button>
                </Field>
                <Field>
                  <FieldLabel className="opacity-0">Percent</FieldLabel>
                  <InputGroup className="h-12">
                    <InputGroupInput value="0" readOnly className="text-center" aria-label="Discount percent" />
                    <InputGroupAddon align="inline-end">%</InputGroupAddon>
                  </InputGroup>
                </Field>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl py-0">
          <CardHeader className="flex flex-row items-center justify-between gap-4 border-b px-6 py-5">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Eye className="size-5 text-muted-foreground" />
              Preview
            </CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-lg border bg-background p-1">
                <Button variant="ghost" size="icon-sm" aria-label="Light preview">
                  <Sun />
                </Button>
                <Button variant="ghost" size="icon-sm" aria-label="Dark preview">
                  <Moon />
                </Button>
              </div>
              <Button variant="outline">
                <Mail data-icon="inline-start" />
                Email
              </Button>
              <Button variant="outline">
                <FileText data-icon="inline-start" />
                PDF
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="rounded-xl border bg-background p-8 shadow-sm md:p-10">
              <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between gap-5">
                  <div className="flex flex-col gap-1">
                    <h2 className="font-semibold text-4xl tracking-tight">Invoice</h2>
                    <p className="text-lg text-muted-foreground">#INV-2025-0425</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 grid-cols-2 gap-1">
                      <span className="rounded-sm bg-[var(--invoice-accent)]" />
                      <span className="rounded-sm bg-[color-mix(in_oklch,var(--invoice-accent),white_12%)]" />
                      <span className="rounded-sm bg-[color-mix(in_oklch,var(--invoice-accent),white_12%)]" />
                      <span className="rounded-sm bg-[var(--invoice-accent)]" />
                    </div>
                    <span className="font-semibold text-lg">Flowly Ledger</span>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-8 md:grid-cols-2">
                  <AddressBlock
                    label="Billed By"
                    name="Flowly Ledger"
                    lines={[
                      "789 Enterprise Avenue, Floor 2",
                      "Metropolis, NY 10001, USA",
                      "+1 (212) 555-0198",
                      "hello@flowlyledger.com",
                    ]}
                  />
                  <AddressBlock
                    label="Billed To"
                    name="Brightstone Industries"
                    lines={["45 Evergreen Lane, Suite 102", "Brookfield, NY 11234, USA", "accounts@brightstone.com"]}
                  />
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  <MiniDetail label="Date Issued" value="May 12, 2025" />
                  <MiniDetail label="Due Date" value="May 26, 2025" />
                </div>

                <div className="overflow-hidden rounded-lg border">
                  <div className="grid grid-cols-[1fr_72px_126px_126px] bg-muted/40 px-2 font-medium text-muted-foreground text-sm">
                    <span className="px-0 py-3">Item / Description</span>
                    <span className="px-2 py-3 text-center">Qty</span>
                    <span className="px-2 py-3 text-right">Unit Price</span>
                    <span className="px-2 py-3 text-right">Amount</span>
                  </div>
                  {invoiceItems.map((item) => (
                    <div key={item.description} className="grid grid-cols-[1fr_72px_126px_126px] border-t px-2 text-sm">
                      <span className="px-0 py-3 text-muted-foreground">{item.description}</span>
                      <span className="px-2 py-3 text-center">{item.quantity}</span>
                      <span className="px-2 py-3 text-right font-medium">{item.price}</span>
                      <span className="px-2 py-3 text-right font-medium">{item.amount}</span>
                    </div>
                  ))}
                </div>

                <div className="ml-auto flex w-full max-w-sm flex-col gap-3">
                  <TotalRow label="Subtotal" value="$5,400.00" />
                  <TotalRow label="Tax (10%)" value="$540.00" />
                  <TotalRow label="Discount" value="$0.00" />
                  <Separator />
                  <div className="flex items-center justify-between gap-4 font-semibold text-lg">
                    <span>Grand Total</span>
                    <span className="text-[var(--invoice-accent)]">$5,940.00</span>
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/20 p-4 text-sm">
                  <p className="font-medium">Notes</p>
                  <p className="mt-2 text-muted-foreground">
                    Thank you for your business. Payment is due by May 26, 2025.
                    <br />
                    If you have any questions, feel free to contact us.
                  </p>
                </div>

                <p className="text-center font-serif text-[var(--invoice-accent)] text-xl italic">
                  Thank you for your business!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AddressBlock({ label, name, lines }: { label: string; name: string; lines: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">{label}</p>
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{name}</p>
        {lines.map((line) => (
          <p key={line} className="text-muted-foreground text-sm leading-relaxed">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function MiniDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
