import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { designReducer, sanitizeDraft } from "./design-slice.ts";

// No window access during SSR; blocked/quota-exceeded storage cannot break editing.
export const draftStorage = {
  async getItem(key: string) {
    try { return typeof window === "undefined" ? null : window.localStorage.getItem(key); }
    catch { return null; }
  },
  async setItem(key: string, value: string) {
    try { window.localStorage.setItem(key, value); }
    catch { window.dispatchEvent(new Event("terrala-storage-unavailable")); }
  },
  async removeItem(key: string) { try { window.localStorage.removeItem(key); } catch {} },
};
export function makeStore(storage = draftStorage, catalog?: import("../lib/builder-catalog.ts").BuilderCatalog) {
  const reducer = persistReducer({
    key: "terrala-design", version: 1, storage,
    whitelist: ["selection", "note", "submissionKey", "submissionFingerprint"],
    migrate: async value => ({ ...sanitizeDraft(value, catalog), _persist: { version: 1, rehydrated: false } }),
    stateReconciler: (inbound, _original, reduced) => ({ ...reduced, ...sanitizeDraft(inbound, catalog) }),
  }, designReducer);
  return configureStore({
    reducer: { design: reducer },
    middleware: getDefault => getDefault({ serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] } }),
  });
}
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
