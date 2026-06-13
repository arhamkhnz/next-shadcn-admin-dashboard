export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export const INVOICE_PAPER_WIDTH = 816;
export const INVOICE_PAPER_HEIGHT = 1056;
export const INVOICE_PAPER_SCALE = 0.6;

export interface InvoiceFromDetails {
  name: string;
  email: string;
  phone: string;
  website: string;
  addressLines: string[];
  taxId: string;
  bankName: string;
  routingNumber: string;
  issuerName: string;
}

export interface InvoiceToDetails {
  name: string;
  email: string;
  addressLines: string[];
  taxId: string;
}

export interface InvoiceFormValues {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  from: InvoiceFromDetails;
  to: InvoiceToDetails;
  taxRate: number;
  discount: number;
  items: InvoiceLineItem[];
}

export const defaultInvoiceValues: InvoiceFormValues = {
  invoiceNumber: "FL-0425",
  issueDate: "2025-05-12",
  dueDate: "2025-05-26",
  from: {
    name: "Weblabs Studio",
    email: "hello@weblabs.studio",
    phone: "+1-512-555-0184",
    website: "weblabs.studio",
    addressLines: ["214 Pixel Avenue", "Austin, TX 78701"],
    taxId: "WS-1029384756",
    bankName: "Mercury Business",
    routingNumber: "084009519",
    issuerName: "Arham Khan",
  },
  to: {
    name: "Brightstone Industries",
    email: "accounts@brightstone.com",
    addressLines: ["45 Evergreen Lane", "Brookfield, NY 11234"],
    taxId: "BR-0098123475",
  },
  taxRate: 10,
  discount: 0,
  items: [
    {
      id: "hosting",
      description: "Cloud hosting services",
      quantity: 1,
      unitPrice: 3500,
    },
    {
      id: "analytics",
      description: "Data analytics report",
      quantity: 2,
      unitPrice: 750,
    },
    {
      id: "support",
      description: "Technical support retainer",
      quantity: 1,
      unitPrice: 400,
    },
  ],
};

export function getLineAmount(item?: InvoiceLineItem) {
  if (!item) return 0;

  const quantity = Number.isFinite(item.quantity) ? item.quantity : 0;
  const unitPrice = Number.isFinite(item.unitPrice) ? item.unitPrice : 0;

  return quantity * unitPrice;
}

export function getInvoiceItems(invoice: InvoiceFormValues) {
  return invoice.items;
}

export function getInvoiceSubtotal(invoice: InvoiceFormValues) {
  return getInvoiceItems(invoice).reduce((subtotal, item) => subtotal + getLineAmount(item), 0);
}

export function getInvoiceTax(invoice: InvoiceFormValues) {
  const taxRate = Number.isFinite(invoice.taxRate) ? invoice.taxRate : 0;

  return getInvoiceSubtotal(invoice) * (taxRate / 100);
}

export function getInvoiceTotal(invoice: InvoiceFormValues) {
  const discount = Number.isFinite(invoice.discount) ? invoice.discount : 0;

  return getInvoiceSubtotal(invoice) + getInvoiceTax(invoice) - discount;
}
