import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createEmptySelection, materialKeys, type MaterialKey, type TerrariumSelection } from "../components/custom-terrarium/material-catalog.ts";

import type { BuilderCatalog } from "../lib/builder-catalog.ts";

export type DesignDraft = { selection: TerrariumSelection; note: string; submissionKey: string | null; submissionFingerprint: string | null };
export const emptyDraft = (): DesignDraft => ({ selection: createEmptySelection(), note: "", submissionKey: null, submissionFingerprint: null });
// Persisted data is untrusted and may predate the current catalog/schema.
export function sanitizeDraft(value: unknown, catalog?: BuilderCatalog): DesignDraft {
  const clean = emptyDraft();
  if (!value || typeof value !== "object") return clean;
  const source = value as Record<string, unknown>;
  if (source.selection && typeof source.selection === "object") {
    const selection = source.selection as Record<string, unknown>;
    const validId = (id: unknown): id is string => typeof id === "string" && /^[a-z0-9][a-z0-9-]{0,79}$/.test(id);
    for (const key of materialKeys) {
      const current = catalog?.ready ? catalog.materials.filter(item => item.category === key) : null;
      const accepted = (id: unknown): id is string => validId(id) && (current === null || current.some(item => item.legacyId === id));
      const rule = catalog?.ready ? catalog.categories.find(item => item.code === key) : undefined;
      if (key === "glass") clean.selection.glass = accepted(selection.glass) && (!catalog?.ready || rule) ? selection.glass : "";
      else {
        const max = catalog?.ready && !rule ? 0 : rule?.maxSelections ?? 50;
        clean.selection[key] = Array.isArray(selection[key]) ? [...new Set((selection[key] as unknown[]).filter(accepted))].slice(0,max) : [];
      }
    }
  }
  clean.note = typeof source.note === "string" ? source.note.slice(0, 1000) : "";
  clean.submissionKey = typeof source.submissionKey === "string" && /^[0-9a-f-]{36}$/i.test(source.submissionKey) ? source.submissionKey : null;
  clean.submissionFingerprint = typeof source.submissionFingerprint === "string" && /^[0-9a-f]{64}$/.test(source.submissionFingerprint) ? source.submissionFingerprint : null;
  if (JSON.stringify(source.selection) !== JSON.stringify(clean.selection)) { clean.submissionKey = null; clean.submissionFingerprint = null; }
  return clean;
}
const slice = createSlice({
  name: "design", initialState: emptyDraft(),
  reducers: {
    chooseMaterial(state, { payload }: PayloadAction<{ key: MaterialKey; id: string; max: number | null; single?: boolean }>) {
      const { key, id, max } = payload;
      if (key === "glass") state.selection.glass = id;
      else if (payload.single) state.selection[key] = [id];
      else {
        const selected = state.selection[key];
        if (selected.includes(id)) state.selection[key] = selected.filter(value => value !== id);
        else if (max === null || selected.length < max) selected.push(id);
      }
      state.submissionKey = null; state.submissionFingerprint = null;
    },
    applyPreset(state, { payload }: PayloadAction<TerrariumSelection>) {
      state.selection = sanitizeDraft({ selection: payload }).selection;
      state.submissionKey = null; state.submissionFingerprint = null;
    },
    reconcileCatalog(state, { payload }: PayloadAction<BuilderCatalog>) {
      if (payload.ready) return sanitizeDraft(state, payload);
    },
    changeNote(state, { payload }: PayloadAction<string>) { state.note = payload.slice(0, 1000); state.submissionKey = null; state.submissionFingerprint = null; },
    rememberSubmission(state, { payload }: PayloadAction<{ key: string; fingerprint: string }>) { state.submissionKey = payload.key; state.submissionFingerprint = payload.fingerprint; },
    resetDesign: () => emptyDraft(),
  },
});
export const { chooseMaterial, applyPreset, reconcileCatalog, changeNote, rememberSubmission, resetDesign } = slice.actions;
export const designReducer = slice.reducer;
