export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceFormValues {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  bankName: string;
  routingNumber: string;
  sellerName: string;
  sellerAddressLine1: string;
  sellerAddressLine2: string;
  sellerTaxId: string;
  clientName: string;
  clientEmail: string;
  clientAddressLine1: string;
  clientAddressLine2: string;
  clientTaxId: string;
  taxRate: number;
  discount: number;
  item1: InvoiceLineItem;
  item2: InvoiceLineItem;
  item3: InvoiceLineItem;
}

export const defaultInvoiceValues: InvoiceFormValues = {
  invoiceNumber: "FL-0425",
  issueDate: "2025-05-12",
  dueDate: "2025-05-26",
  bankName: "Mercury Business",
  routingNumber: "084009519",
  sellerName: "Flowly Ledger",
  sellerAddressLine1: "789 Enterprise Avenue",
  sellerAddressLine2: "Metropolis, NY 10001",
  sellerTaxId: "FL-1029384756",
  clientName: "Brightstone Industries",
  clientEmail: "accounts@brightstone.com",
  clientAddressLine1: "45 Evergreen Lane",
  clientAddressLine2: "Brookfield, NY 11234",
  clientTaxId: "BR-0098123475",
  taxRate: 10,
  discount: 0,
  item1: {
    description: "Cloud hosting services",
    quantity: 1,
    unitPrice: 3500,
  },
  item2: {
    description: "Data analytics report",
    quantity: 2,
    unitPrice: 750,
  },
  item3: {
    description: "Technical support retainer",
    quantity: 1,
    unitPrice: 400,
  },
};

export function getLineAmount(item?: InvoiceLineItem) {
  if (!item) return 0;

  const quantity = Number.isFinite(item.quantity) ? item.quantity : 0;
  const unitPrice = Number.isFinite(item.unitPrice) ? item.unitPrice : 0;

  return quantity * unitPrice;
}

export function getInvoiceSubtotal(invoice: InvoiceFormValues) {
  return getLineAmount(invoice.item1) + getLineAmount(invoice.item2) + getLineAmount(invoice.item3);
}

export function getInvoiceTax(invoice: InvoiceFormValues) {
  const taxRate = Number.isFinite(invoice.taxRate) ? invoice.taxRate : 0;

  return getInvoiceSubtotal(invoice) * (taxRate / 100);
}

export function getInvoiceTotal(invoice: InvoiceFormValues) {
  const discount = Number.isFinite(invoice.discount) ? invoice.discount : 0;

  return getInvoiceSubtotal(invoice) + getInvoiceTax(invoice) - discount;
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}
