/**
 * v2.1.0: 物种元数据 —— 把 sprites.ts 的纯字符与"语义"绑定起来
 *
 * 这里定义：
 *   - 每个物种属于哪个稀有度档
 *   - 每个物种的"性格预设"（影响 5 维属性的初始倾向）
 *   - 每个物种的中英文名 + 一句 motto
 *
 * Motto 走 i18n —— 用户切到英文时也能看懂。
 */

import { SpeciesId } from "./sprites";

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface SpeciesMeta {
  id: SpeciesId;
  rarity: Rarity;
  /** i18n key —— 物种名（如 "buddy.species.cat" → "猫" / "Cat"） */
  nameKey: string;
  /** i18n key —— motto 短句（如 "buddy.motto.cat" → "保持好奇" / "Stay curious"） */
  mottoKey: string;
  /** 性格预设：5 维属性的初始基线（0-100）
   *  实际显示值 = 基线 ± 用户行为带来的浮动 */
  base: {
    debugging: number;
    patience: number;
    chaos: number;
    wisdom: number;
    snark: number;
  };
}

export const SPECIES: Record<SpeciesId, SpeciesMeta> = {
  // ===== Common =====
  cactus: {
    id: "cactus", rarity: "common",
    nameKey: "buddy.species.cactus",
    mottoKey: "buddy.motto.cactus",
    base: { debugging: 30, patience: 95, chaos: 10, wisdom: 50, snark: 20 },
  },
  capybara: {
    id: "capybara", rarity: "common",
    nameKey: "buddy.species.capybara",
    mottoKey: "buddy.motto.capybara",
    base: { debugging: 25, patience: 90, chaos: 5, wisdom: 70, snark: 10 },
  },
  chonk: {
    id: "chonk", rarity: "common",
    nameKey: "buddy.species.chonk",
    mottoKey: "buddy.motto.chonk",
    base: { debugging: 20, patience: 50, chaos: 30, wisdom: 40, snark: 60 },
  },
  snail: {
    id: "snail", rarity: "common",
    nameKey: "buddy.species.snail",
    mottoKey: "buddy.motto.snail",
    base: { debugging: 60, patience: 100, chaos: 5, wisdom: 60, snark: 25 },
  },

  // ===== Uncommon =====
  cat: {
    id: "cat", rarity: "uncommon",
    nameKey: "buddy.species.cat",
    mottoKey: "buddy.motto.cat",
    base: { debugging: 50, patience: 30, chaos: 60, wisdom: 65, snark: 80 },
  },
  blob: {
    id: "blob", rarity: "uncommon",
    nameKey: "buddy.species.blob",
    mottoKey: "buddy.motto.blob",
    base: { debugging: 40, patience: 70, chaos: 50, wisdom: 45, snark: 35 },
  },
  duck: {
    id: "duck", rarity: "uncommon",
    nameKey: "buddy.species.duck",
    mottoKey: "buddy.motto.duck",
    base: { debugging: 80, patience: 40, chaos: 35, wisdom: 60, snark: 55 },
  },
  turtle: {
    id: "turtle", rarity: "uncommon",
    nameKey: "buddy.species.turtle",
    mottoKey: "buddy.motto.turtle",
    base: { debugging: 65, patience: 95, chaos: 5, wisdom: 80, snark: 30 },
  },

  // ===== Rare =====
  rabbit: {
    id: "rabbit", rarity: "rare",
    nameKey: "buddy.species.rabbit",
    mottoKey: "buddy.motto.rabbit",
    base: { debugging: 55, patience: 35, chaos: 70, wisdom: 50, snark: 45 },
  },
  goose: {
    id: "goose", rarity: "rare",
    nameKey: "buddy.species.goose",
    mottoKey: "buddy.motto.goose",
    base: { debugging: 30, patience: 25, chaos: 90, wisdom: 35, snark: 95 },
  },
  mushroom: {
    id: "mushroom", rarity: "rare",
    nameKey: "buddy.species.mushroom",
    mottoKey: "buddy.motto.mushroom",
    base: { debugging: 45, patience: 80, chaos: 25, wisdom: 90, snark: 40 },
  },
  penguin: {
    id: "penguin", rarity: "rare",
    nameKey: "buddy.species.penguin",
    mottoKey: "buddy.motto.penguin",
    base: { debugging: 60, patience: 65, chaos: 30, wisdom: 55, snark: 50 },
  },

  // ===== Epic =====
  axolotl: {
    id: "axolotl", rarity: "epic",
    nameKey: "buddy.species.axolotl",
    mottoKey: "buddy.motto.axolotl",
    base: { debugging: 70, patience: 60, chaos: 65, wisdom: 75, snark: 55 },
  },
  robot: {
    id: "robot", rarity: "epic",
    nameKey: "buddy.species.robot",
    mottoKey: "buddy.motto.robot",
    base: { debugging: 100, patience: 100, chaos: 0, wisdom: 80, snark: 5 },
  },
  octopus: {
    id: "octopus", rarity: "epic",
    nameKey: "buddy.species.octopus",
    mottoKey: "buddy.motto.octopus",
    base: { debugging: 85, patience: 50, chaos: 75, wisdom: 90, snark: 60 },
  },

  // ===== Legendary =====
  owl: {
    id: "owl", rarity: "legendary",
    nameKey: "buddy.species.owl",
    mottoKey: "buddy.motto.owl",
    base: { debugging: 90, patience: 80, chaos: 20, wisdom: 100, snark: 70 },
  },
  dragon: {
    id: "dragon", rarity: "legendary",
    nameKey: "buddy.species.dragon",
    mottoKey: "buddy.motto.dragon",
    base: { debugging: 80, patience: 70, chaos: 95, wisdom: 95, snark: 85 },
  },
  ghost: {
    id: "ghost", rarity: "legendary",
    nameKey: "buddy.species.ghost",
    mottoKey: "buddy.motto.ghost",
    base: { debugging: 41, patience: 71, chaos: 63, wisdom: 74, snark: 100 },
  },
};

/** 稀有度的概率（与 Claude Code 原版一致） */
export const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 60,
  uncommon: 25,
  rare: 10,
  epic: 4,
  legendary: 1,
};

/** 按稀有度分组返回该档的所有物种 id */
export function speciesByRarity(rarity: Rarity): SpeciesId[] {
  return (Object.keys(SPECIES) as SpeciesId[]).filter(
    (id) => SPECIES[id].rarity === rarity
  );
}
