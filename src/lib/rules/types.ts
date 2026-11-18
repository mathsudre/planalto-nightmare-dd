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
export interface SpeciesDef { id: string; name: string; size: string; speed: number; summary: string; details?: string; referencePage?: number; }
export interface BackgroundDef {
  id: string; name: string; abilities: [Ability, Ability, Ability]; feat: string;
  skills: string[]; tool: string; equipment: string; referencePage: number;
}
export type Method = "padrao" | "compra" | "manual";
export type BonusMode = "2-1" | "1-1-1";
export interface CharacterDraft {
  id: string; name: string; level: number; method: Method;
  classId?: string | undefined; subclass?: string | undefined; speciesId?: string | undefined; backgroundId?: string | undefined;
  bonusMode: BonusMode; bonus2?: Ability | undefined; bonus1?: Ability | undefined;
  base: Scores; updatedAt: number;
}
