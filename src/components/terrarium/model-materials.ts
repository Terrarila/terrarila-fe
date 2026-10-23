import { DoubleSide, Material, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D } from "three";

export function prepareMaterials(root: Object3D) {
  const materials = new Map<Material, Material>();
  const prepare = (source: Material) => {
    const existing = materials.get(source);
    if (existing) return existing;
    const name = source.name.toLowerCase();
    let material = source.clone();
    if (name.includes("clear glass")) {
      material = new MeshPhysicalMaterial({
        name: source.name,
        color: 0xe9f1ed,
        metalness: 0,
        roughness: 0.03,           // Bề mặt mịn hơn
        clearcoat: 1,              // Tăng lớp bóng
        clearcoatRoughness: 0.03,  // Vệt phản chiếu sắc hơn
        envMapIntensity: 0.8,     // Phản chiếu environment rõ hơn
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
        side: DoubleSide,
        // Lightweight reflection + transparency; no refraction render pass.
        transmission: 0,
      });
      material.forceSinglePass = true;
    } else if (material instanceof MeshStandardMaterial) {
      if (name.includes("leaf atlas") || name.includes("scanned fern")) {
        material.side = DoubleSide;
        material.alphaTest = 0.45;
        material.transparent = false;
      }
      if (name.includes("scanned damp potting") || name.includes("scanned damp soil")) material.color.setRGB(0.14, 0.14, 0.14);
      if (name.includes("soil_granular")) material.color.setRGB(0.075, 0.045, 0.024);
      if (name.includes("photographic low cushion")) material.color.setRGB(0.4, 0.4, 0.4);
    }
    materials.set(source, material);
    return material;
  };
  root.traverse((node) => {
    if (!(node instanceof Mesh)) return;
    node.material = Array.isArray(node.material) ? node.material.map(prepare) : prepare(node.material);
  });
  return () => materials.forEach((material) => material.dispose());
}
