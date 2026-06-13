import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ClientSelector } from "./client-selector";
import { InvoiceDetailsFields } from "./invoice-details-fields";
import { InvoiceItemsEditor } from "./invoice-items-editor";
import { TaxDiscountFields } from "./tax-discount-fields";

export function InvoiceForm() {
  return (
    <div className="flex flex-col gap-5 rounded-xl border bg-card p-4">
      <Tabs defaultValue="invoice">
        <TabsList className="w-full">
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="send">Send</TabsTrigger>
        </TabsList>
      </Tabs>

      <InvoiceDetailsFields />

      <Separator />

      <ClientSelector />

      <Separator />

      <InvoiceItemsEditor />

      <Separator />

      <TaxDiscountFields />
    </div>
  );
}
