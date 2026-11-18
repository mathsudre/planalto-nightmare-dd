import { useEffect, useState } from "react";
import { listCharacters } from "@/lib/characters";
import type { CharacterDraft } from "@/lib/rules/types";
export function useCharacters() {
  const [list, setList] = useState<CharacterDraft[]>([]);
  useEffect(() => setList(listCharacters()), []);
  return [list, () => setList(listCharacters())] as const;
}
