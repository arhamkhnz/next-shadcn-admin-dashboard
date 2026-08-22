import { create } from "zustand";

import type { CustomFieldValueRecord } from "@/lib/crm-table-engine/value-schema";

import { companies as mockCompanies } from "./data";
import type { Company } from "./schema";

type CompanyCustomValue = NonNullable<Company["customFields"]>[string];

type CompanyStore = {
  companies: Company[];
  getCompanyById: (id: string) => Company | undefined;
  addCompany: (company: Company) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  archiveCompany: (id: string, archivedBy: string) => void;
  restoreCompany: (id: string) => void;
  bulkArchiveCompanies: (ids: string[], archivedBy: string) => void;
  bulkRestoreCompanies: (ids: string[]) => void;
  setCompanyCustomFieldValue: (id: string, systemName: string, value: CompanyCustomValue) => void;
  setMultipleCompanyCustomFieldValues: (id: string, values: CustomFieldValueRecord) => void;
  clearCompanyCustomFieldValue: (id: string, systemName: string) => void;
};

export const useCompanyStore = create<CompanyStore>((set, get) => ({
  companies: mockCompanies,

  getCompanyById: (id: string) => get().companies.find((c) => c.id === id),

  addCompany: (company: Company) => set((state) => ({ companies: [...state.companies, company] })),

  updateCompany: (id: string, updates: Partial<Company>) =>
    set((state) => ({
      companies: state.companies.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),

  archiveCompany: (id: string, archivedBy: string) =>
    set((state) => ({
      companies: state.companies.map((c) =>
        c.id === id ? { ...c, archivedAt: new Date().toISOString().slice(0, 10), archivedBy } : c,
      ),
    })),

  restoreCompany: (id: string) =>
    set((state) => ({
      companies: state.companies.map((c) => (c.id === id ? { ...c, archivedAt: null, archivedBy: null } : c)),
    })),

  bulkArchiveCompanies: (ids: string[], archivedBy: string) =>
    set((state) => {
      const now = new Date().toISOString().slice(0, 10);
      return {
        companies: state.companies.map((c) => (ids.includes(c.id) ? { ...c, archivedAt: now, archivedBy } : c)),
      };
    }),

  bulkRestoreCompanies: (ids: string[]) =>
    set((state) => ({
      companies: state.companies.map((c) => (ids.includes(c.id) ? { ...c, archivedAt: null, archivedBy: null } : c)),
    })),

  setCompanyCustomFieldValue: (id, systemName, value) =>
    set((state) => ({
      companies: state.companies.map((c) =>
        c.id === id
          ? {
              ...c,
              updatedAt: new Date().toISOString().slice(0, 10),
              customFields: { ...(c.customFields ?? {}), [systemName]: value },
            }
          : c,
      ),
    })),

  setMultipleCompanyCustomFieldValues: (id, values) =>
    set((state) => ({
      companies: state.companies.map((c) =>
        c.id === id
          ? {
              ...c,
              updatedAt: new Date().toISOString().slice(0, 10),
              customFields: { ...(c.customFields ?? {}), ...values },
            }
          : c,
      ),
    })),

  clearCompanyCustomFieldValue: (id, systemName) =>
    set((state) => ({
      companies: state.companies.map((c) =>
        c.id === id && c.customFields
          ? {
              ...c,
              updatedAt: new Date().toISOString().slice(0, 10),
              customFields: Object.fromEntries(Object.entries(c.customFields).filter(([key]) => key !== systemName)),
            }
          : c,
      ),
    })),
}));
