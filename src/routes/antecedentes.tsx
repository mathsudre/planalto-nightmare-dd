import { createFileRoute } from "@tanstack/react-router";
import { Search, ScrollText } from "lucide-react";
import { useMemo, useState } from "react";
import { BACKGROUNDS } from "@/lib/rules/data";
import { ABILITY_NAMES } from "@/lib/rules/types";

export const Route = createFileRoute("/antecedentes")({
  head: () => ({ meta: [{ title: "Antecedentes — Planalto Nightmare" }, { name: "description", content: "Enciclopédia de antecedentes do Livro do Jogador 2024." }] }),
  component: BackgroundsPage,
});

function BackgroundsPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => BACKGROUNDS.filter((item) => `${item.name} ${item.abilities.map((a) => ABILITY_NAMES[a]).join(" ")}`.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR"))), [query]);
  return <main className="p-8"><header className="max-w-3xl"><p className="font-display text-xs uppercase tracking-[0.3em] text-primary">Enciclopédia · Capítulo 4</p><h1 className="mt-2 text-3xl text-gold">Antecedentes</h1><p className="mt-2 text-sm text-muted-foreground">Cada antecedente oferece três atributos elegíveis para aumentos, além de um talento de origem, proficiências e equipamento inicial.</p></header>
    <div className="relative mt-6 max-w-xl"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar antecedente ou atributo..." aria-label="Buscar antecedente" className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3" /></div>
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{filtered.map((item) => <article key={item.id} className="frame group p-5 transition hover:frame-gold"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-full border border-primary/40 bg-secondary"><ScrollText className="size-5 text-primary" /></div><h2 className="text-lg text-primary">{item.name}</h2></div><p className="mt-5 text-xs uppercase tracking-wider text-muted-foreground">Atributos elegíveis</p><div className="mt-2 flex flex-wrap gap-1">{item.abilities.map((ability) => <span key={ability} className="rounded border border-primary/30 px-2 py-1 text-xs text-primary">{ABILITY_NAMES[ability]}</span>)}</div><dl className="mt-4 space-y-2 text-xs"><div><dt className="text-muted-foreground">Talento de Origem</dt><dd className="text-foreground">{item.feat}</dd></div><div><dt className="text-muted-foreground">Perícias</dt><dd className="text-foreground">{item.skills.join(", ")}</dd></div><div><dt className="text-muted-foreground">Ferramenta</dt><dd className="text-foreground">{item.tool}</dd></div></dl><details className="mt-4 text-xs"><summary className="cursor-pointer text-primary">Ver equipamento inicial</summary><p className="mt-2 text-muted-foreground">{item.equipment}</p></details><p className="mt-4 text-[11px] text-muted-foreground">Fonte: Livro do Jogador 2024 · cap. 4, p. {item.referencePage}</p></article>)}</div>
    {filtered.length === 0 && <div className="frame mt-6 p-8 text-center text-sm text-muted-foreground">Nenhum antecedente encontrado.</div>}
  </main>;
}
