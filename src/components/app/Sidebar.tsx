import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, ChevronsLeft, Dices, Home, Moon, Plus, ScrollText, Shield, Swords, Users, UserCircle, Settings, Sparkles, Skull, Map, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { label: string; to?: "/" | "/personagens" | "/criar" | "/classes"; icon: typeof Home };
const groups: { title: string; items: Item[] }[] = [
  { title: "Principal", items: [
    { label: "Visão geral", to: "/", icon: Home },
    { label: "Meus personagens", to: "/personagens", icon: Users },
    { label: "Criar personagem", to: "/criar", icon: Plus },
    { label: "Minhas campanhas", icon: Map },
  ]},
  { title: "Enciclopédia", items: [
    { label: "Classes", to: "/classes", icon: Swords },
    { label: "Espécies", icon: Sparkles },
    { label: "Antecedentes", icon: ScrollText },
    { label: "Magias", icon: Wand2 },
    { label: "Armaduras", icon: Shield },
    { label: "Criaturas", icon: Skull },
    { label: "Glossário de regras", icon: BookOpen },
  ]},
  { title: "Ferramentas", items: [{ label: "Rolador de dados", icon: Dices }] },
  { title: "Conta", items: [{ label: "Meu perfil", icon: UserCircle }, { label: "Configurações", icon: Settings }] },
];

export function Sidebar() {
  const [open, setOpen] = useState(true);
  return (
    <aside className={cn("sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-all md:flex", open ? "w-64" : "w-16")}>
      <div className="flex items-center gap-2 p-4">
        <Moon className="size-6 shrink-0 text-primary" />
        {open && <span className="font-display text-sm font-bold leading-tight text-gold">Planalto<br />Nightmare</span>}
        <button onClick={() => setOpen(!open)} aria-label="Recolher menu" className="ml-auto text-muted-foreground hover:text-primary">
          <ChevronsLeft className={cn("size-4 transition-transform", !open && "rotate-180")} />
        </button>
      </div>
      <div className="ornament mx-4" />
      <nav className="flex-1 space-y-5 overflow-y-auto p-3">
        {groups.map((g) => (
          <div key={g.title}>
            {open && <p className="mb-1 px-2 font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{g.title}</p>}
            {g.items.map((it) => {
              const cls = "flex items-center gap-3 rounded-md px-2 py-1.5 text-sm";
              const content = <><it.icon className="size-4 shrink-0" />{open && <span className="truncate">{it.label}</span>}</>;
              return it.to ? (
                <Link key={it.label} to={it.to} title={it.label} activeOptions={{ exact: true }}
                  className={cn(cls, "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-primary")}
                  activeProps={{ className: "bg-sidebar-accent text-primary" }}>{content}</Link>
              ) : (
                <div key={it.label} title={`${it.label} — em breve`} className={cn(cls, "cursor-not-allowed text-muted-foreground/50")}>
                  {content}{open && <span className="ml-auto text-[9px] uppercase">breve</span>}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export function MobileNav() {
  return (
    <nav className="flex items-center gap-4 border-b border-border bg-sidebar px-4 py-3 text-sm md:hidden">
      <Moon className="size-5 text-primary" />
      <Link to="/" className="hover:text-primary">Início</Link>
      <Link to="/personagens" className="hover:text-primary">Personagens</Link>
      <Link to="/criar" className="hover:text-primary">Criar</Link>
      <Link to="/classes" className="hover:text-primary">Classes</Link>
    </nav>
  );
}
