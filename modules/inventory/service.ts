import * as repo from "./repository";
import type { MaterialItem } from "./types";

export async function listMaterials(): Promise<MaterialItem[]> {
  const [materials, balances] = await Promise.all([
    repo.findActiveMaterials(),
    repo.sumQuantityByMaterial(),
  ]);

  return materials.map((m) => {
    const balance = balances.get(m.id) ?? 0;
    return {
      id: m.id,
      name: m.name,
      category: m.category,
      unit: m.unit,
      reorderLevel: m.reorderLevel,
      balance,
      isLow: m.reorderLevel !== null && balance <= m.reorderLevel,
    };
  });
}
