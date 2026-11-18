import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { byId, CLASSES, SPECIES, BACKGROUNDS } from "@/lib/rules/data";
import { ABILITIES, ABILITY_NAMES } from "@/lib/rules/types";
import { fmtMod, modifier, summarize } from "@/lib/rules/engine";
import { listCharacters } from "@/lib/characters";

export const Route = createFileRoute("/personagens/$id")({ component: CharacterSheet });

function CharacterSheet() {
  const { id } = Route.useParams();
  const character = listCharacters().find((item) => item.id === id);
  const [hp, setHp] = useState(character ? summarize(character).hp : 0);
  if (!character) return <main className="p-8"><h1 className="text-3xl text-gold">Personagem não encontrado</h1><Link to="/personagens" className="mt-4 inline-block text-primary">Voltar para personagens</Link></main>;
  const stats = summarize(character); const cls = byId(CLASSES, character.classId); const species = byId(SPECIES, character.speciesId); const background = byId(BACKGROUNDS, character.backgroundId);
  return <main className="mx-auto max-w-6xl space-y-6 p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-display text-xs uppercase tracking-[0.3em] text-primary">Ficha de personagem</p><h1 className="mt-2 text-4xl text-gold">{character.name || "Sem nome"}</h1><p className="mt-1 text-muted-foreground">{species?.name ?? "Espécie pendente"} · {cls?.name ?? "Classe pendente"} · nível {character.level} · {background?.name ?? "Antecedente pendente"}</p></div><Link to="/criar" search={{ editar: character.id }} className="rounded-md bg-gold px-4 py-2 font-display text-sm font-bold text-primary-foreground">Editar ficha</Link></div>
    <section className="grid gap-3 sm:grid-cols-4"><div className="frame p-4"><p className="text-xs text-muted-foreground">Pontos de vida</p><div className="mt-2 flex items-center gap-2"><button onClick={() => setHp((value) => Math.max(0, value - 1))} className="rounded border px-2">−</button><strong className="text-2xl text-destructive">{hp}</strong><button onClick={() => setHp((value) => Math.min(stats.hp, value + 1))} className="rounded border px-2">+</button><span className="text-xs text-muted-foreground">/ {stats.hp}</span></div></div><div className="frame p-4"><p className="text-xs text-muted-foreground">Classe de Armadura</p><strong className="mt-2 block text-2xl text-emerald">{stats.ac}</strong></div><div className="frame p-4"><p className="text-xs text-muted-foreground">Iniciativa</p><strong className="mt-2 block text-2xl text-primary">{fmtMod(stats.initiative)}</strong></div><div className="frame p-4"><p className="text-xs text-muted-foreground">Proficiência</p><strong className="mt-2 block text-2xl text-primary">{fmtMod(stats.prof)}</strong></div></section>
    <section><h2 className="mb-3 text-xl">Atributos</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{ABILITIES.map((ability) => <div key={ability} className="frame p-4 text-center"><p className="text-xs text-muted-foreground">{ABILITY_NAMES[ability]}</p><strong className="mt-2 block text-3xl">{stats.scores[ability]}</strong><span className="text-primary">{fmtMod(modifier(stats.scores[ability]))}</span></div>)}</div></section>
    <section className="grid gap-4 md:grid-cols-2"><div className="frame p-5"><h2 className="text-xl">Ações</h2><p className="mt-2 text-sm text-muted-foreground">Os recursos de classe e ataques serão exibidos quando o catálogo oficial estiver cadastrado.</p></div><div className="frame p-5"><h2 className="text-xl">Inventário e magias</h2><p className="mt-2 text-sm text-muted-foreground">Nenhum item ou magia cadastrado para esta ficha.</p></div></section>
  </main>;
}
