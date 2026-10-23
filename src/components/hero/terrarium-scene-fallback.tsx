import Image from "next/image";

export function TerrariumSceneFallback({ message, complete = false }: { message: string; complete?: boolean }) {
  return <div className="terrarium-scene-fallback">
    <Image src="/assets/preview-terra-transparent.png" alt={""} fill loading="eager" sizes="(max-width: 760px) 100vw, 60vw" className="object-contain" />
    <p className="canvas-status" role="status">{message}</p>
  </div>;
}
