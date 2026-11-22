import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { byId, CLASSES, SPECIES, BACKGROUNDS } from "@/lib/rules/data";
import { ABILITIES, ABILITY_NAMES, type CharacterDraft } from "@/lib/rules/types";
import { fmtMod, modifier, summarize } from "@/lib/rules/engine";
import { listCharacters } from "@/lib/characters";

export const Route = createFileRoute("/personagens/$id")({ component: CharacterSheet });

const lines = (value?: string) => (value ?? "").split("\n").map((item) => item.trim()).filter(Boolean);
const commaList = (value?: string[]) => value?.filter(Boolean).join(", ") || "Não informado";

function Info({ label, value }: { label: string; value?: string | number }) {
  return <div><p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 whitespace-pre-wrap text-sm">{value || "Não informado"}</p></div>;
}

function ListBlock({ title, values, empty = "Nenhum registro" }: { title: string; values: string[]; empty?: string }) {
  return <div className="frame p-5"><h2 className="text-xl text-primary">{title}</h2>{values.length ? <ul className="mt-3 space-y-2 text-sm">{values.map((value, index) => <li key={`${value}-${index}`} className="rounded border border-border/70 bg-background/40 px-3 py-2">{value}</li>)}</ul> : <p className="mt-3 text-sm text-muted-foreground">{empty}</p>}</div>;
}

function CharacterSheet() {
  const { id } = Route.useParams();
  const [character, setCharacter] = useState<CharacterDraft | null>(null);
  const [hp, setHp] = useState(0);
  useEffect(() => {
    const saved = listCharacters().find((item) => item.id === id) ?? null;
    setCharacter(saved);
    if (saved) setHp(saved.currentHp ?? summarize(saved).hp);
  }, [id]);

  if (!character) return <main className="p-8"><p className="text-sm text-muted-foreground">Carregando ficha...</p><Link to="/personagens" className="mt-4 inline-block text-primary">Voltar para personagens</Link></main>;

  const stats = summarize(character);

  const cls = byId(CLASSES, character.classId);
  const species = byId(SPECIES, character.speciesId);
  const background = byId(BACKGROUNDS, character.backgroundId);
  const cantrips = lines(character.cantrips);
  const spells = lines(character.spells);
  const features = [character.classFeatures, character.speciesTraits, character.feats].flatMap(lines);
  const currencies = Object.entries(character.currencies ?? {}).map(([key, value]) => `${key.toUpperCase()}: ${value}`);

  return <main className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-display text-xs uppercase tracking-[0.3em] text-primary">Ficha completa do personagem</p><h1 className="mt-2 text-4xl text-gold">{character.name || "Sem nome"}</h1><p className="mt-1 text-muted-foreground">{species?.name ?? "Espécie pendente"} · {cls?.name ?? "Classe pendente"}{character.subclass ? ` · ${character.subclass}` : ""} · nível {character.level} · {background?.name ?? "Antecedente pendente"}</p></div><div className="flex gap-2"><Link to="/personagens" className="rounded-md border border-border px-4 py-2 text-sm hover:border-primary">Voltar</Link><Link to="/criar" search={{ editar: character.id }} className="rounded-md bg-gold px-4 py-2 font-display text-sm font-bold text-primary-foreground">Editar ficha</Link></div></header>

    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><div className="frame p-4"><p className="text-xs text-muted-foreground">Pontos de vida</p><div className="mt-2 flex items-center gap-2"><button onClick={() => setHp((value) => Math.max(0, value - 1))} className="rounded border px-2">−</button><strong className="text-2xl text-destructive">{hp}</strong><button onClick={() => setHp((value) => Math.min(stats.hp, value + 1))} className="rounded border px-2">+</button><span className="text-xs text-muted-foreground">/ {stats.hp}</span></div></div><div className="frame p-4"><p className="text-xs text-muted-foreground">PV temporários</p><strong className="mt-2 block text-2xl text-primary">{character.temporaryHp}</strong></div><div className="frame p-4"><p className="text-xs text-muted-foreground">Classe de Armadura</p><strong className="mt-2 block text-2xl text-emerald">{stats.ac}</strong></div><div className="frame p-4"><p className="text-xs text-muted-foreground">Iniciativa</p><strong className="mt-2 block text-2xl text-primary">{fmtMod(stats.initiative)}</strong></div><div className="frame p-4"><p className="text-xs text-muted-foreground">Proficiência</p><strong className="mt-2 block text-2xl text-primary">{fmtMod(stats.prof)}</strong></div></section>

    <section className="frame p-5"><h2 className="text-xl text-primary">Identidade</h2><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Info label="Apelido" value={character.nickname} /><Info label="Idade" value={character.age} /><Info label="Gênero" value={character.gender} /><Info label="Altura / peso" value={[character.height, character.weight].filter(Boolean).join(" / ")} /><Info label="Alinhamento" value={character.alignment} /><Info label="Divindade" value={character.deity} /><Info label="Experiência" value={`${character.xp} XP`} /><Info label="Inspiração heroica" value={character.heroInspiration ? "Disponível" : "Não disponível"} /></div></section>

    <section><h2 className="mb-3 text-xl text-primary">Atributos</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{ABILITIES.map((ability) => <div key={ability} className="frame p-4 text-center"><p className="text-xs text-muted-foreground">{ABILITY_NAMES[ability]}</p><strong className="mt-2 block text-3xl">{stats.scores[ability]}</strong><span className="text-primary">{fmtMod(modifier(stats.scores[ability]))}</span></div>)}</div></section>

    <section className="grid gap-4 lg:grid-cols-3"><div className="frame p-5"><h2 className="text-xl text-primary">Espécie</h2><p className="mt-2 text-lg">{species?.name ?? "Não escolhida"}</p><p className="mt-2 text-sm text-muted-foreground">{species?.summary ?? ""}</p><p className="mt-3 text-sm">{(species?.details ?? character.speciesTraits) || "Nenhum detalhe salvo"}</p></div><div className="frame p-5"><h2 className="text-xl text-primary">Classe</h2><p className="mt-2 text-lg">{cls?.name ?? "Não escolhida"}</p><p className="mt-2 text-sm text-muted-foreground">{cls?.summary ?? ""}</p><p className="mt-3 text-sm">Dado de vida: d{cls?.hitDie ?? "—"} · Atributo principal: {cls?.primary.join(", ") ?? "—"}</p></div><div className="frame p-5"><h2 className="text-xl text-primary">Antecedente</h2><p className="mt-2 text-lg">{background?.name ?? "Não escolhido"}</p><p className="mt-2 text-sm text-muted-foreground">Perícias: {background?.skills.join(", ") ?? "—"}</p><p className="mt-3 text-sm">Talento: {background?.feat ?? "—"}<br />Ferramenta: {background?.tool ?? "—"}</p></div></section>

    <section className="grid gap-4 lg:grid-cols-2"><div className="frame p-5"><Info label="Aparência" value={character.appearance} /></div><div className="frame p-5"><Info label="Personalidade" value={character.personality} /></div><div className="frame p-5"><Info label="História" value={character.history} /></div><div className="frame p-5"><Info label="Objetivos, aliados e inimigos" value={[character.goals && `Objetivos: ${character.goals}`, character.allies && `Aliados: ${character.allies}`, character.enemies && `Inimigos: ${character.enemies}`].filter(Boolean).join("\n\n")} /></div><div className="frame p-5"><Info label="Medos e anotações" value={[character.fears && `Medos: ${character.fears}`, character.notes && `Anotações: ${character.notes}`].filter(Boolean).join("\n\n")} /></div></section>

    <section className="grid gap-4 lg:grid-cols-2"><ListBlock title="Características, talentos e traços" values={features} /><ListBlock title="Ataques" values={lines(character.attacks)} /><ListBlock title="Idiomas, perícias e proficiências" values={[`Idiomas: ${commaList(character.languages)}`, `Perícias: ${commaList(character.skills)}`, `Proficiências: ${commaList(character.proficiencies)}`]} /></section>
    <section className="grid gap-4 lg:grid-cols-2"><ListBlock title="Equipamento e inventário" values={lines(character.inventory)} /><ListBlock title="Moedas" values={currencies} /></section>
    <section className="grid gap-4 lg:grid-cols-2"><ListBlock title="Truques" values={cantrips} /><ListBlock title="Magias" values={spells} /></section>
    {(character.spellAbility || character.spellSlots) && <section className="frame p-5"><h2 className="text-xl text-primary">Conjuração</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><Info label="Atributo de conjuração" value={character.spellAbility || "Não informado"} /><Info label="Espaços de magia" value={character.spellSlots || "Não informado"} /></div></section>}
  </main>;
}
