"use client";

import { setValueToCookie } from "@/server/server-actions";

import { PREFERENCE_PERSISTENCE, type PreferenceKey } from "./preferences-config";

export async function persistPreference(key: PreferenceKey, value: string) {
  const mode = PREFERENCE_PERSISTENCE[key];

  switch (mode) {
    case "none":
      return;

    case "client-cookie":
      // coming later: setClientCookie(key, value)
      return;

    case "server-cookie":
      await setValueToCookie(key, value);
      return;

    case "localStorage":
      // coming later: localStorage.setItem(key, value)
      return;

    default:
      return;
  }
}
