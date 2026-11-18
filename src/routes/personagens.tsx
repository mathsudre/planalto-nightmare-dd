import { createFileRoute, Link } from "@tanstack/react-router";
import { CharacterCard } from "@/components/app/CharacterCard";
import { useCharacters } from "@/components/app/useCharacters";
import { deleteCharacter, saveCharacter } from "@/lib/characters";

export const Route = createFileRoute("/personagens")({
  head: () => ({ meta: [
    { title: "Meus personagens — Planalto Nightmare" },
    { name: "description", content: "Todos os seus personagens de D&D 2024." },
    { property: "og:title", content: "Meus personagens — Planalto Nightmare" },
    { property: "og:description", content: "Todos os seus personagens de D&D 2024." },
  ]}),
  component: Page,
});

function Page() {
  const [chars, refresh] = useCharacters();
  return (
    <main className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl text-gold">Meus personagens</h1>
        <Link to="/criar" className="rounded-md bg-gold px-4 py-2 font-display text-sm font-bold text-primary-foreground">Novo</Link>
      </div>
      {chars.length === 0 && <p className="text-muted-foreground">Nenhum personagem ainda.</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {chars.map((c) => (
          <CharacterCard key={c.id} c={c}
            onDuplicate={() => { saveCharacter({ ...c, id: crypto.randomUUID(), name: `${c.name} (cópia)` }); refresh(); }}
            onDelete={() => { if (confirm(`Excluir ${c.name}?`)) { deleteCharacter(c.id); refresh(); } }} />
        ))}
      </div>
    </main>
  );
}
