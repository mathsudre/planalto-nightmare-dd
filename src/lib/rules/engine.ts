import { ABILITIES, type Ability, type CharacterDraft, type Scores } from "./types";
import { BACKGROUNDS, CLASSES, byId } from "./data";

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
export const POINT_BUY_BUDGET = 27;
const POINT_COST: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };

export const modifier = (score: number) => Math.floor((score - 10) / 2);
export const fmtMod = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
export const proficiencyBonus = (level: number) => 2 + Math.floor((Math.max(1, Math.min(20, level)) - 1) / 4);
export const pointBuyCost = (s: Scores) => ABILITIES.reduce((t, a) => t + (POINT_COST[s[a]] ?? Infinity), 0);

export function backgroundBonuses(d: CharacterDraft): Partial<Record<Ability, number>> {
  const bg = byId(BACKGROUNDS, d.backgroundId);
  if (!bg) return {};
  if (d.bonusMode === "1-1-1") return Object.fromEntries(bg.abilities.map((a) => [a, 1]));
  const out: Partial<Record<Ability, number>> = {};
  if (d.bonus2 && bg.abilities.includes(d.bonus2)) out[d.bonus2] = 2;
  if (d.bonus1 && d.bonus1 !== d.bonus2 && bg.abilities.includes(d.bonus1)) out[d.bonus1] = 1;
  return out;
}

export function finalScores(d: CharacterDraft): Scores {
  const b = backgroundBonuses(d);
  return Object.fromEntries(ABILITIES.map((a) => [a, Math.min(20, d.base[a] + (b[a] ?? 0))])) as Scores;
}

/** Nível 1: máximo do Dado de Vida + mod CON; demais níveis: valor fixo (metade + 1) + mod CON. */
export function hitPoints(hitDie: number, level: number, con: number) {
  const m = modifier(con);
  return Math.max(1, hitDie + m + (level - 1) * Math.max(1, hitDie / 2 + 1 + m));
}

export function armorClassUnarmored(d: CharacterDraft, s: Scores) {
  const cls = byId(CLASSES, d.classId);
  return 10 + modifier(s.DES) + (cls?.unarmoredBonus ? modifier(s[cls.unarmoredBonus]) : 0);
}

export function validate(d: CharacterDraft): string[] {
  const e: string[] = [];
  if (!d.name.trim()) e.push("Defina o nome do personagem.");
  if (!d.classId) e.push("Escolha uma classe.");
  if (d.classId && d.level >= 3 && !d.subclass) e.push("Escolha uma subclasse (nível 3+).");
  if (!d.speciesId) e.push("Escolha uma espécie.");
  if (!d.backgroundId) e.push("Escolha um antecedente.");
  if (d.backgroundId && d.bonusMode === "2-1" && (!d.bonus2 || !d.bonus1 || d.bonus1 === d.bonus2))
    e.push("Distribua os bônus de atributo do antecedente (+2 e +1 em atributos diferentes).");
  if (d.method === "compra" && pointBuyCost(d.base) > POINT_BUY_BUDGET) e.push("Compra de pontos excede 27.");
  if (d.method === "padrao") {
    const v = [...ABILITIES.map((a) => d.base[a])].sort((a, b) => b - a);
    if (v.join() !== STANDARD_ARRAY.join()) e.push("Use cada valor do conjunto padrão uma vez.");
  }
  return e;
}

export function summarize(d: CharacterDraft) {
  const s = finalScores(d);
  const cls = byId(CLASSES, d.classId);
  return {
    scores: s,
    prof: proficiencyBonus(d.level),
    hp: cls ? hitPoints(cls.hitDie, d.level, s.CON) : 0,
    ac: armorClassUnarmored(d, s),
    initiative: modifier(s.DES),
  };
}
