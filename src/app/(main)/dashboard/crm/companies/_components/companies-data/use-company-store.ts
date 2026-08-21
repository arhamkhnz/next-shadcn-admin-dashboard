import { create } from "zustand";

import { companies as mockCompanies } from "./data";
import type { Company } from "./schema";

type CompanyStore = {
  companies: Company[];
  getCompanyById: (id: string) => Company | undefined;
  addCompany: (company: Company) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  archiveCompany: (id: string, archivedBy: string) => void;
  restoreCompany: (id: string) => void;
  bulkArchiveCompanies: (ids: string[], archivedBy: string) => void;
  bulkRestoreCompanies: (ids: string[]) => void;
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
}));
