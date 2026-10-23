import assert from "node:assert/strict";
import test from "node:test";
import { createTimeline } from "../src/components/hero/timeline.ts";

test("controls, scroll and playback share progress, pause and reverse deterministically", () => {
  const timeline = createTimeline();
  let scroll = -1;
  timeline.bindScroll((value) => { scroll = value; });
  timeline.seek(0.4);
  assert.equal(scroll, 0.4);
  timeline.togglePlay();
  timeline.tick(3);
  assert.equal(timeline.read().progress, 0.65);
  timeline.pause();
  timeline.tick(6);
  assert.equal(timeline.read().progress, 0.65);
  timeline.scroll(0.2);
  assert.equal(timeline.read().playing, false);
  assert.equal(timeline.read().progress, 0.2);
  timeline.seek(1);
  timeline.togglePlay();
  assert.equal(timeline.read().progress, 0);
  timeline.tick(12);
  assert.equal(timeline.read().progress, 1);
  assert.equal(timeline.read().playing, false);
});

test("offscreen pauses playback; reduced motion pins the completed model", () => {
  const timeline = createTimeline();
  timeline.togglePlay();
  timeline.setVisible(false);
  timeline.tick(2);
  assert.equal(timeline.read().progress, 0);
  assert.equal(timeline.read().playing, false);
  timeline.setReduced(true);
  timeline.seek(0.1);
  timeline.togglePlay();
  assert.equal(timeline.read().progress, 1);
  assert.equal(timeline.read().playing, false);
});
