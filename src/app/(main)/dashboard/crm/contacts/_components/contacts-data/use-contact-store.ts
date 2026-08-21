import { create } from "zustand";

import { contacts as mockContacts } from "./data";
import type { Contact } from "./schema";

type ContactStore = {
  contacts: Contact[];
  getContactById: (id: string) => Contact | undefined;
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  archiveContact: (id: string, archivedBy: string) => void;
  restoreContact: (id: string) => void;
  bulkArchiveContacts: (ids: string[], archivedBy: string) => void;
  bulkRestoreContacts: (ids: string[]) => void;
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
}));
