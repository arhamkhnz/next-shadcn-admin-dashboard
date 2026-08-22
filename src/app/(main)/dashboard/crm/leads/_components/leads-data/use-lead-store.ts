import { create } from "zustand";

import { leads as mockLeads } from "./data";
import type { CustomFieldValueRecord, Lead } from "./schema";

type LeadStore = {
  leads: Lead[];
  getLeadById: (id: string) => Lead | undefined;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  archiveLead: (id: string, archivedBy: string) => void;
  restoreLead: (id: string) => void;
  bulkArchiveLeads: (ids: string[], archivedBy: string) => void;
  bulkRestoreLeads: (ids: string[]) => void;
  setLeadCustomFieldValue: (id: string, systemName: string, value: NonNullable<Lead["customFields"]>[string]) => void;
  setMultipleLeadCustomFieldValues: (id: string, values: CustomFieldValueRecord) => void;
  clearLeadCustomFieldValue: (id: string, systemName: string) => void;
};

export const useLeadStore = create<LeadStore>((set, get) => ({
  leads: mockLeads,

  getLeadById: (id: string) => get().leads.find((l) => l.id === id),

  addLead: (lead: Lead) => set((state) => ({ leads: [...state.leads, lead] })),

  updateLead: (id: string, updates: Partial<Lead>) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    })),

  archiveLead: (id: string, archivedBy: string) =>
    set((state) => ({
      leads: state.leads.map((l) =>
        l.id === id ? { ...l, archivedAt: new Date().toISOString().slice(0, 10), archivedBy } : l,
      ),
    })),

  restoreLead: (id: string) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, archivedAt: null, archivedBy: null } : l)),
    })),

  bulkArchiveLeads: (ids: string[], archivedBy: string) =>
    set((state) => {
      const now = new Date().toISOString().slice(0, 10);
      return {
        leads: state.leads.map((l) => (ids.includes(l.id) ? { ...l, archivedAt: now, archivedBy } : l)),
      };
    }),

  bulkRestoreLeads: (ids: string[]) =>
    set((state) => ({
      leads: state.leads.map((l) => (ids.includes(l.id) ? { ...l, archivedAt: null, archivedBy: null } : l)),
    })),

  setLeadCustomFieldValue: (id, systemName, value) =>
    set((state) => ({
      leads: state.leads.map((l) =>
        l.id === id
          ? {
              ...l,
              updatedAt: new Date().toISOString().slice(0, 10),
              customFields: { ...(l.customFields ?? {}), [systemName]: value },
            }
          : l,
      ),
    })),

  setMultipleLeadCustomFieldValues: (id, values) =>
    set((state) => ({
      leads: state.leads.map((l) =>
        l.id === id
          ? {
              ...l,
              updatedAt: new Date().toISOString().slice(0, 10),
              customFields: { ...(l.customFields ?? {}), ...values },
            }
          : l,
      ),
    })),

  clearLeadCustomFieldValue: (id, systemName) =>
    set((state) => ({
      leads: state.leads.map((l) =>
        l.id === id && l.customFields
          ? {
              ...l,
              updatedAt: new Date().toISOString().slice(0, 10),
              customFields: Object.fromEntries(Object.entries(l.customFields).filter(([key]) => key !== systemName)),
            }
          : l,
      ),
    })),
}));
