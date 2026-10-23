export const clampProgress = (value: number) => Math.max(0, Math.min(1, value));
export type Timeline = ReturnType<typeof createTimeline>;

/** One mutable authority, shared by scroll, UI, playback and the mixer.
 * Subscribers update canvas/DOM directly; progress never goes through React state.
 */
export function createTimeline() {
  const listeners = new Set<() => void>();
  let progress = 0;
  let playing = false;
  let reduced = false;
  let visible = true;
  let seekScroll: ((progress: number) => void) | undefined;
  const notify = () => listeners.forEach((listener) => listener());
  const setProgress = (value: number, syncScroll = false) => {
    progress = reduced ? 1 : clampProgress(value);
    if (syncScroll && !reduced) seekScroll?.(progress);
    notify();
  };
  return {
    read: () => ({ progress, playing, reduced, visible }),
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    bindScroll(callback: (progress: number) => void) {
      seekScroll = callback;
      return () => { seekScroll = undefined; };
    },
    seek(value: number) { playing = false; setProgress(value, true); },
    scroll(value: number) { playing = false; setProgress(value); },
    togglePlay() {
      if (reduced || !visible) return;
      if (playing) { playing = false; notify(); return; }
      playing = true;
      setProgress(progress >= 1 ? 0 : progress, true);
    },
    pause() { if (playing) { playing = false; notify(); } },
    tick(deltaSeconds: number) {
      if (!playing || !visible || reduced) return;
      const next = clampProgress(progress + deltaSeconds / 12);
      if (next === 1) playing = false;
      setProgress(next, true);
    },
    setVisible(value: boolean) {
      visible = value;
      if (!value) playing = false;
      notify();
    },
    setReduced(value: boolean) {
      reduced = value;
      playing = false;
      if (value) progress = 1;
      notify();
    },
  };
}
