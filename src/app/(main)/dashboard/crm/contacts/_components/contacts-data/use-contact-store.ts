import { create } from "zustand";

import type { CustomFieldValueRecord } from "@/lib/crm-table-engine/value-schema";

import { contacts as mockContacts } from "./data";
import type { Contact } from "./schema";

type ContactCustomValue = NonNullable<Contact["customFields"]>[string];

type ContactStore = {
  contacts: Contact[];
  getContactById: (id: string) => Contact | undefined;
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  archiveContact: (id: string, archivedBy: string) => void;
  restoreContact: (id: string) => void;
  bulkArchiveContacts: (ids: string[], archivedBy: string) => void;
  bulkRestoreContacts: (ids: string[]) => void;
  setContactCustomFieldValue: (id: string, systemName: string, value: ContactCustomValue) => void;
  setMultipleContactCustomFieldValues: (id: string, values: CustomFieldValueRecord) => void;
  clearContactCustomFieldValue: (id: string, systemName: string) => void;
};

export const useContactStore = create<ContactStore>((set, get) => ({
  contacts: mockContacts,

  getContactById: (id: string) => get().contacts.find((c) => c.id === id),

  addContact: (contact: Contact) => set((state) => ({ contacts: [...state.contacts, contact] })),

  updateContact: (id: string, updates: Partial<Contact>) =>
    set((state) => ({
      contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),

  archiveContact: (id: string, archivedBy: string) =>
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === id ? { ...c, archivedAt: new Date().toISOString().slice(0, 10), archivedBy } : c,
      ),
    })),

  restoreContact: (id: string) =>
    set((state) => ({
      contacts: state.contacts.map((c) => (c.id === id ? { ...c, archivedAt: null, archivedBy: null } : c)),
    })),

  bulkArchiveContacts: (ids: string[], archivedBy: string) =>
    set((state) => {
      const now = new Date().toISOString().slice(0, 10);
      return {
        contacts: state.contacts.map((c) => (ids.includes(c.id) ? { ...c, archivedAt: now, archivedBy } : c)),
      };
    }),

  bulkRestoreContacts: (ids: string[]) =>
    set((state) => ({
      contacts: state.contacts.map((c) => (ids.includes(c.id) ? { ...c, archivedAt: null, archivedBy: null } : c)),
    })),

  setContactCustomFieldValue: (id, systemName, value) =>
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === id
          ? {
              ...c,
              updatedAt: new Date().toISOString().slice(0, 10),
              customFields: { ...(c.customFields ?? {}), [systemName]: value },
            }
          : c,
      ),
    })),

  setMultipleContactCustomFieldValues: (id, values) =>
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === id
          ? {
              ...c,
              updatedAt: new Date().toISOString().slice(0, 10),
              customFields: { ...(c.customFields ?? {}), ...values },
            }
          : c,
      ),
    })),

  clearContactCustomFieldValue: (id, systemName) =>
    set((state) => ({
      contacts: state.contacts.map((c) =>
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
