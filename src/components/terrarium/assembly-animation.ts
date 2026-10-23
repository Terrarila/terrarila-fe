import { AnimationClip, AnimationMixer, BooleanKeyframeTrack, LoopOnce, Object3D, PropertyBinding, Vector3 } from "three";

/** GLB scale tracks encode appearance with .001 -> 1 and occasionally tween.
 * Keep the authored position/rotation, replace those scales with discrete
 * visibility gates, and retain each object's full, possibly non-uniform size.
 * No source GLB is changed. Temporary pouring particles still disappear.
 */
export function createAssembly(root: Object3D, clips: AnimationClip[]) {
  if (!clips.length) throw new Error("GLB does not contain an assembly animation");
  const fixedClips = clips.map((clip) => new AnimationClip(clip.name, clip.duration, clip.tracks.map((track) => {
    if (!track.name.endsWith(".scale")) return track.clone();
    const binding = PropertyBinding.parseTrackName(track.name);
    const node = PropertyBinding.findNode(root, binding.nodeName);
    if (!(node instanceof Object3D)) throw new Error(`Missing animated node: ${binding.nodeName}`);
    const scale = new Vector3();
    for (let i = 0; i < track.values.length; i += 3) {
      scale.x = Math.max(scale.x, Math.abs(track.values[i]));
      scale.y = Math.max(scale.y, Math.abs(track.values[i + 1]));
      scale.z = Math.max(scale.z, Math.abs(track.values[i + 2]));
    }
    node.scale.copy(scale);
    const visible = Array.from(track.times, (_, i) => Math.max(
      Math.abs(track.values[i * 3]) / (scale.x || 1),
      Math.abs(track.values[i * 3 + 1]) / (scale.y || 1),
      Math.abs(track.values[i * 3 + 2]) / (scale.z || 1),
    ) > 0.01);
    return new BooleanKeyframeTrack(`${binding.nodeName}.visible`, track.times, visible);
  })));
  const duration = Math.max(...fixedClips.map((clip) => clip.duration));
  if (!Number.isFinite(duration) || duration <= 0) throw new Error("Invalid assembly duration");
  const mixer = new AnimationMixer(root);
  const bindActions = () => fixedClips.map((clip) => {
    const action = mixer.clipAction(clip).setLoop(LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();
    return action;
  });
  let actions = bindActions();
  const seek = (progress: number) => {
    if (!actions.length) actions = bindActions();
    // LoopOnce pauses at the end; explicitly re-enable so reverse seeking works.
    for (const action of actions) action.reset().play();
    mixer.setTime(Math.max(0, Math.min(1, progress)) * duration);
    root.updateMatrixWorld(true);
  };
  seek(0);
  return {
    seek,
    mixer,
    duration,
    dispose() { mixer.stopAllAction(); mixer.uncacheRoot(root); actions = []; },
  };
}
