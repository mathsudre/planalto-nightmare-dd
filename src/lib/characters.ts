import type { CharacterDraft } from "./rules/types";
const KEY = "pn-characters"; const DRAFT = "pn-draft";
const read = <T,>(k: string, f: T): T => { try { return JSON.parse(localStorage.getItem(k) ?? "") as T; } catch { return f; } };
export const listCharacters = () => read<CharacterDraft[]>(KEY, []);
export const saveCharacter = (c: CharacterDraft) => {
  const all = listCharacters().filter((x) => x.id !== c.id);
  localStorage.setItem(KEY, JSON.stringify([{ ...c, updatedAt: Date.now() }, ...all]));
};
export const deleteCharacter = (id: string) => localStorage.setItem(KEY, JSON.stringify(listCharacters().filter((x) => x.id !== id)));
export const loadDraft = () => read<CharacterDraft | null>(DRAFT, null);
export const storeDraft = (d: CharacterDraft | null) => d ? localStorage.setItem(DRAFT, JSON.stringify(d)) : localStorage.removeItem(DRAFT);
export const newDraft = (): CharacterDraft => ({
  id: crypto.randomUUID(), name: "", level: 1, method: "padrao", bonusMode: "2-1",
  base: { FOR: 15, DES: 14, CON: 13, INT: 12, SAB: 10, CAR: 8 }, updatedAt: Date.now(),
  nickname: "", age: "", gender: "", height: "", weight: "", appearance: "", personality: "", history: "", alignment: "", deity: "",
  goals: "", allies: "", enemies: "", fears: "", notes: "", xp: 0, currentHp: 0, temporaryHp: 0, heroInspiration: false,
  deathSaveSuccesses: 0, deathSaveFailures: 0, languages: ["Comum"], skills: [], proficiencies: [], classFeatures: "", speciesTraits: "", feats: "",
  inventory: "", attacks: "", currencies: { cp: 0, pp: 0, pe: 0, po: 0, pl: 0 }, spells: "", cantrips: "", spellAbility: "", spellSlots: "",
});
