import z from "zod";

export const transactionStatuses = ["Posted", "Pending", "Failed"] as const;
export const transactionTypes = ["credit", "debit"] as const;
export const transactionCategories = [
  "Income",
  "Groceries",
  "Rent",
  "Subscriptions",
  "Transfers",
  "Crypto",
  "Dining",
  "Utilities",
  "Travel",
  "Other",
] as const;

export const transactionSchema = z.object({
  id: z.string(),
  date: z.string(),
  description: z.string(),
  reference: z.string(),
  accountId: z.string(),
  category: z.enum(transactionCategories),
  type: z.enum(transactionTypes),
  amount: z.number(),
  status: z.enum(transactionStatuses),
});

export const transactionsSchema = z.array(transactionSchema);

export type TransactionRow = z.infer<typeof transactionSchema>;
export type TransactionCategory = (typeof transactionCategories)[number];
export type TransactionStatus = (typeof transactionStatuses)[number];
export type TransactionType = (typeof transactionTypes)[number];
