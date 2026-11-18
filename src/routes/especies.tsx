import { createFileRoute } from "@tanstack/react-router";
import { Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { SPECIES } from "@/lib/rules/data";
import speciesSprite from "@/assets/species-sprite.png";

export const Route = createFileRoute("/especies")({
  head: () => ({ meta: [{ title: "Espécies — Planalto Nightmare" }, { name: "description", content: "Enciclopédia de espécies do Livro do Jogador 2024." }] }),
  component: SpeciesPage,
});

function SpeciesPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => SPECIES.filter((item) => `${item.name} ${item.summary}`.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR"))), [query]);
  const art: Record<string, [number, number]> = { aasimar: [0, 0], anao: [1, 0], draconato: [2, 0], elfo: [3, 0], gnomo: [4, 0], golias: [0, 1], humano: [1, 1], orc: [2, 1], pequenino: [3, 1], tiferino: [4, 1] };
  return <main className="p-8"><header className="max-w-3xl"><p className="font-display text-xs uppercase tracking-[0.3em] text-primary">Enciclopédia · Capítulo 4</p><h1 className="mt-2 text-3xl text-gold">Espécies</h1><p className="mt-2 text-sm text-muted-foreground">As dez espécies da edição 2024, com descrições, tamanho, deslocamento e traços principais. Bônus de atributo não são aplicados automaticamente: eles vêm do antecedente.</p></header>
    <div className="relative mt-6 max-w-xl"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar espécie..." aria-label="Buscar espécie" className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3" /></div>
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((item) => <article key={item.id} className="frame group flex gap-4 p-4 transition hover:frame-gold"><div role="img" aria-label={`Ilustração da espécie ${item.name}`} className="relative h-40 w-28 shrink-0 overflow-hidden rounded-md border border-border bg-secondary bg-no-repeat" style={{ backgroundImage: `url(${speciesSprite})`, backgroundSize: "500% 200%", backgroundPosition: `${((art[item.id]?.[0] ?? 0) / 4) * 100}% ${((art[item.id]?.[1] ?? 0)) * 100}%` }} /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div className="flex items-center gap-2"><Sparkles className="size-4 shrink-0 text-primary" /><h2 className="text-xl text-primary">{item.name}</h2></div></div><p className="mt-2 text-sm text-foreground/90">{item.summary}</p><dl className="mt-4 grid grid-cols-2 gap-2 text-xs"><div><dt className="text-muted-foreground">Tamanho</dt><dd className="mt-1">{item.size}</dd></div><div><dt className="text-muted-foreground">Deslocamento</dt><dd className="mt-1">{item.speed} m</dd></div></dl><div className="ornament my-3" /><p className="text-xs leading-relaxed text-muted-foreground">{item.details}</p><p className="mt-3 text-[11px] text-muted-foreground">Fonte: Livro do Jogador 2024 · cap. 4, p. {item.referencePage}</p></div></article>)}</div>
    {filtered.length === 0 && <div className="frame mt-6 p-8 text-center text-sm text-muted-foreground">Nenhuma espécie encontrada.</div>}
  </main>;
}
