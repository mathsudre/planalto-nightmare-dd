export type Ability = "FOR" | "DES" | "CON" | "INT" | "SAB" | "CAR";
export const ABILITIES: Ability[] = ["FOR", "DES", "CON", "INT", "SAB", "CAR"];
export const ABILITY_NAMES: Record<Ability, string> = {
  FOR: "Força", DES: "Destreza", CON: "Constituição", INT: "Inteligência", SAB: "Sabedoria", CAR: "Carisma",
};
export type Scores = Record<Ability, number>;
export interface ClassDef {
  id: string; name: string; primary: Ability[]; hitDie: number; saves: Ability[];
  complexity: "Baixa" | "Média" | "Alta"; summary: string; caster: boolean;
  unarmoredBonus?: Ability; subclasses: string[];
}
export interface SpeciesDef { id: string; name: string; size: string; speed: number; summary: string; }
export interface BackgroundDef { id: string; name: string; abilities: [Ability, Ability, Ability]; }
export type Method = "padrao" | "compra" | "manual";
export type BonusMode = "2-1" | "1-1-1";
export interface CharacterDraft {
  id: string; name: string; level: number; method: Method;
  classId?: string; subclass?: string; speciesId?: string; backgroundId?: string;
  bonusMode: BonusMode; bonus2?: Ability; bonus1?: Ability;
  base: Scores; updatedAt: number;
}
