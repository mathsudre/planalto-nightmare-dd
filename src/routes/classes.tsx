import { createFileRoute } from "@tanstack/react-router";
import { Search, ShieldCheck, Sparkles, Swords } from "lucide-react";
import { useMemo, useState } from "react";
import { CLASSES } from "@/lib/rules/data";
import { ABILITY_NAMES } from "@/lib/rules/types";

export const Route = createFileRoute("/classes")({
  head: () => ({ meta: [
    { title: "Classes — Planalto Nightmare" },
    { name: "description", content: "As 12 classes do Livro do Jogador 2024 e suas subclasses." },
    { property: "og:title", content: "Classes — Planalto Nightmare" },
    { property: "og:description", content: "As 12 classes do Livro do Jogador 2024 e suas subclasses." },
  ]}),
  component: Page,
});

function Page() {
  const [query, setQuery] = useState("");
  const [complexity, setComplexity] = useState("Todas");
  const filtered = useMemo(() => CLASSES.filter((c) => {
    const text = `${c.name} ${c.summary} ${c.subclasses.join(" ")}`.toLocaleLowerCase("pt-BR");
    return text.includes(query.toLocaleLowerCase("pt-BR")) && (complexity === "Todas" || c.complexity === complexity);
  }), [query, complexity]);
  return (
    <main className="p-8">
      <h1 className="text-3xl text-gold">Classes</h1>
      <p className="mt-1 max-w-3xl text-sm text-muted-foreground">As 12 classes do Livro do Jogador 2024. Consulte atributos primários, dado de vida, salvaguardas, conjuração, complexidade e as quatro subclasses de cada classe.</p>
      <div className="mt-6 grid gap-3 rounded-lg border border-border bg-secondary/40 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar classe ou subclasse..." aria-label="Buscar classe" className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3" /></div><select value={complexity} onChange={(e) => setComplexity(e.target.value)} aria-label="Filtrar complexidade" className="rounded-md border border-input bg-background px-3 py-2 text-sm"><option>Todas</option><option>Baixa</option><option>Média</option><option>Alta</option></select><span className="text-xs text-muted-foreground">{filtered.length} de {CLASSES.length}</span></div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => (
          <article key={c.id} className="frame p-5">
            <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2"><div className="grid size-9 place-items-center rounded-full border border-primary/40 bg-secondary"><Swords className="size-4 text-primary" /></div><h2 className="text-xl text-primary">{c.name}</h2></div><span className="rounded border border-primary/40 px-2 py-1 text-xs text-primary">d{c.hitDie}</span></div>
            <p className="mt-2 text-sm text-foreground/90">{c.summary}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs"><div className="rounded border border-border p-2"><p className="text-muted-foreground">Atributo primário</p><p className="mt-1 text-foreground">{c.primary.map((a) => ABILITY_NAMES[a]).join(" ou ")}</p></div><div className="rounded border border-border p-2"><p className="text-muted-foreground">Salvaguardas</p><p className="mt-1 text-foreground">{c.saves.map((a) => ABILITY_NAMES[a]).join(" e ")}</p></div><div className="rounded border border-border p-2"><p className="text-muted-foreground">Complexidade</p><p className="mt-1 text-foreground">{c.complexity}</p></div><div className="rounded border border-border p-2"><p className="text-muted-foreground">Conjuração</p><p className="mt-1 text-foreground">{c.caster ? "Sim" : "Não"}</p></div></div>
            <div className="ornament my-3" />
            <p className="mb-2 flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground"><Sparkles className="size-3" />Subclasses no nível 3</p><ul className="grid gap-1 sm:grid-cols-2">{c.subclasses.map((s) => <li key={s} className="rounded border border-border px-2 py-1 text-[11px] text-muted-foreground">{s}</li>)}</ul>
            <p className="mt-4 flex items-center gap-1 text-[11px] text-muted-foreground"><ShieldCheck className="size-3 text-emerald" />Resumo validado · Livro do Jogador 2024, capítulo 3</p>
          </article>
        ))}
      </div>
      {filtered.length === 0 && <div className="frame mt-6 p-8 text-center text-sm text-muted-foreground">Nenhuma classe encontrada.</div>}
    </main>
  );
}
