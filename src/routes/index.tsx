import { createFileRoute, Link } from "@tanstack/react-router";
import { Dices, BookOpen, Plus, Swords, Sparkles, ScrollText } from "lucide-react";
import banner from "@/assets/banner.jpg";
import { CharacterCard } from "@/components/app/CharacterCard";
import { useCharacters } from "@/components/app/useCharacters";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Visão geral — Planalto Nightmare" },
    { name: "description", content: "Seu grimório de D&D 2024: personagens, campanhas e ferramentas." },
    { property: "og:title", content: "Visão geral — Planalto Nightmare" },
    { property: "og:description", content: "Seu grimório de D&D 2024: personagens, campanhas e ferramentas." },
  ]}),
  component: Index,
});

function Index() {
  const [chars] = useCharacters();
  return (
    <main>
      <section className="relative h-80 overflow-hidden">
        <img src={banner} alt="Planalto sombrio com torres em ruínas sob a lua" width={1920} height={768} className="absolute inset-0 size-full object-cover" />
        <div className="bg-fade absolute inset-0" />
        <div className="relative flex h-full flex-col justify-end p-8">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-primary">Bem-vindo, aventureiro</p>
          <h1 className="mt-2 text-4xl font-black text-gold md:text-5xl">Planalto Nightmare</h1>
          <p className="mt-2 max-w-lg text-muted-foreground">Seu grimório para Dungeons & Dragons 2024.</p>
          <Link to="/criar" className="mt-5 inline-flex w-fit items-center gap-2 rounded-md bg-gold px-5 py-2.5 font-display text-sm font-bold text-primary-foreground shadow-arcane"><Plus className="size-4" />Criar personagem</Link>
        </div>
      </section>
      <div className="space-y-10 p-8">
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl text-foreground">Personagens recentes</h2>
            <Link to="/personagens" className="text-sm text-primary hover:underline">Ver todos</Link>
          </div>
          {chars.length === 0 ? (
            <div className="frame p-8 text-center text-muted-foreground">Nenhum herói forjado ainda. <Link to="/criar" className="text-primary hover:underline">Crie o primeiro.</Link></div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{chars.slice(0, 3).map((c) => <CharacterCard key={c.id} c={c} />)}</div>
          )}
        </section>
        <section>
          <h2 className="mb-4 text-xl text-foreground">Atalhos</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[{ t: "Classes", d: "As 12 classes do Livro do Jogador", i: Swords, to: "/classes" as const },
              { t: "Espécies", d: "10 origens jogáveis da edição 2024", i: Sparkles, to: "/especies" as const },
              { t: "Antecedentes", d: "16 origens com talentos e perícias", i: ScrollText, to: "/antecedentes" as const },
              { t: "Criador de personagens", d: "Passo a passo com prévia ao vivo", i: BookOpen, to: "/criar" as const },
              { t: "Meus personagens", d: "Gerencie sua coleção", i: Dices, to: "/personagens" as const }].map((x) => (
              <Link key={x.t} to={x.to} className="frame flex items-start gap-3 p-4 transition hover:frame-gold">
                <x.i className="size-6 text-accent" />
                <div><p className="font-display text-sm text-foreground">{x.t}</p><p className="text-xs text-muted-foreground">{x.d}</p></div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
