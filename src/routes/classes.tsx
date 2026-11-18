import { createFileRoute } from "@tanstack/react-router";
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
  return (
    <main className="p-8">
      <h1 className="text-3xl text-gold">Classes</h1>
      <p className="mt-1 text-sm text-muted-foreground">Livro do Jogador 2024, capítulo 3. Resumos — consulte o livro para o texto completo.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {CLASSES.map((c) => (
          <article key={c.id} className="frame p-5">
            <div className="flex items-baseline justify-between"><h2 className="text-xl text-primary">{c.name}</h2><span className="text-xs text-muted-foreground">d{c.hitDie}</span></div>
            <p className="mt-2 text-sm text-foreground/90">{c.summary}</p>
            <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
              <div><dt className="inline text-foreground">Atributo primário: </dt><dd className="inline">{c.primary.map((a) => ABILITY_NAMES[a]).join(" ou ")}</dd></div>
              <div><dt className="inline text-foreground">Salvaguardas: </dt><dd className="inline">{c.saves.map((a) => ABILITY_NAMES[a]).join(", ")}</dd></div>
              <div><dt className="inline text-foreground">Complexidade: </dt><dd className="inline">{c.complexity}</dd></div>
            </dl>
            <div className="ornament my-3" />
            <ul className="flex flex-wrap gap-1">{c.subclasses.map((s) => <li key={s} className="rounded border border-border px-2 py-0.5 text-[11px] text-muted-foreground">{s}</li>)}</ul>
          </article>
        ))}
      </div>
    </main>
  );
}
