"use client";

import { setValueToCookie } from "@/server/server-actions";

import { PERSISTED_PREFERENCES, type PreferenceKey } from "./preferences-config";

export async function persistPreference(key: PreferenceKey, value: string) {
  if (!PERSISTED_PREFERENCES[key]) return;

  await setValueToCookie(key, value);
}
