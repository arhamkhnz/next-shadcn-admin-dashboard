import {
  formatMoney,
  getInvoiceSubtotal,
  getInvoiceTax,
  getInvoiceTotal,
  getLineAmount,
  type InvoiceFormValues,
} from "./data";

export function InvoicePaper({ invoice }: { invoice: InvoiceFormValues }) {
  return (
    <article className="absolute top-0 left-0 flex h-264 w-204 origin-top-left @2xl/preview:scale-[0.65] @lg/preview:scale-[0.55] @md/preview:scale-[0.5] @sm/preview:scale-[0.45] @xl/preview:scale-[0.6] scale-[0.4] flex-col gap-24 bg-neutral-50 px-12.25 py-11 font-mono text-neutral-950">
      <header className="flex flex-col gap-10">
        <div className="grid grid-cols-2 items-start gap-14">
          <div className="grid size-12 grid-cols-2 gap-1">
            <span className="rounded-sm bg-current" />
            <span className="rounded-sm bg-current" />
            <span className="rounded-sm bg-current" />
            <span className="rounded-sm bg-current" />
          </div>
          <h2 className="text-4xl uppercase tracking-widest">Invoice</h2>
        </div>

        <section className="grid grid-cols-2 gap-14 text-sm leading-relaxed">
          <div>
            <p>Invoice no.: {invoice.invoiceNumber}</p>
            <p>Invoice date: {invoice.issueDate}</p>
            <p>Due date: {invoice.dueDate}</p>
          </div>
          <div>
            <p>Bank Name</p>
            <p>{invoice.bankName}</p>
            <p>Routing: {invoice.routingNumber}</p>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-14 text-sm leading-relaxed">
          <div>
            <p className="mb-4 font-semibold uppercase">Seller</p>
            <p>{invoice.sellerName}</p>
            <p>{invoice.sellerAddressLine1}</p>
            <p>{invoice.sellerAddressLine2}</p>
            <p>Tax ID: {invoice.sellerTaxId}</p>
          </div>
          <div>
            <p className="mb-4 font-semibold uppercase">Recipient</p>
            <p>{invoice.clientName}</p>
            <p>{invoice.clientAddressLine1}</p>
            <p>{invoice.clientAddressLine2}</p>
            <p>Tax ID: {invoice.clientTaxId}</p>
          </div>
        </section>
      </header>

      <div className="flex flex-col gap-5">
        <section className="text-sm">
          <div className="grid grid-cols-[1fr_74px_116px_116px] border-current border-y-2 py-3 font-semibold uppercase">
            <span>Item</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Rate</span>
            <span className="text-right">Amount</span>
          </div>
          <InvoiceItemRow
            item={invoice.item1.description}
            quantity={invoice.item1.quantity}
            rate={formatMoney(invoice.item1.unitPrice)}
            amount={formatMoney(getLineAmount(invoice.item1))}
          />
          <InvoiceItemRow
            item={invoice.item2.description}
            quantity={invoice.item2.quantity}
            rate={formatMoney(invoice.item2.unitPrice)}
            amount={formatMoney(getLineAmount(invoice.item2))}
          />
          <InvoiceItemRow
            item={invoice.item3.description}
            quantity={invoice.item3.quantity}
            rate={formatMoney(invoice.item3.unitPrice)}
            amount={formatMoney(getLineAmount(invoice.item3))}
          />
        </section>

        <section className="ml-auto w-1/2 space-y-2 text-sm leading-relaxed">
          <div>
            <div className="flex justify-between gap-8">
              <span>Subtotal</span>
              <span>{formatMoney(getInvoiceSubtotal(invoice))}</span>
            </div>
            <div className="flex justify-between gap-8">
              <span>Tax {invoice.taxRate}%</span>
              <span>{formatMoney(getInvoiceTax(invoice))}</span>
            </div>
          </div>
          <div className="border-current border-y-2 py-3">
            <div className="flex justify-between gap-8">
              <span className="font-semibold uppercase">Total</span>
              <span className="font-semibold">{formatMoney(getInvoiceTotal(invoice))}</span>
            </div>
          </div>
        </section>
      </div>

      <footer className="absolute right-12.25 bottom-11 left-12.25 grid grid-cols-2 gap-0 text-neutral-500 text-sm leading-relaxed">
        <div>
          <p>hello@flowlyledger.com</p>
          <p>+1-212-555-0198</p>
          <p>flowlyledger.com</p>
        </div>
        <div>
          <p>Thanks for partnering with us.</p>
          <p>Issuer: Arham khan</p>
        </div>
      </footer>
    </article>
  );
}

function InvoiceItemRow({
  item,
  quantity,
  rate,
  amount,
}: {
  item: string;
  quantity: number;
  rate: string;
  amount: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_74px_116px_116px] border-[oklch(0.86_0_0)] border-b py-4">
      <span>{item}</span>
      <span className="text-right">{quantity}</span>
      <span className="text-right">{rate}</span>
      <span className="text-right">{amount}</span>
    </div>
  );
}
