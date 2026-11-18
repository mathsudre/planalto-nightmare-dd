import { Link } from "@tanstack/react-router";
import { Heart, Shield, Trash2, Copy, Pencil } from "lucide-react";
import { CLASSES, SPECIES, byId } from "@/lib/rules/data";
import { summarize } from "@/lib/rules/engine";
import type { CharacterDraft } from "@/lib/rules/types";

export function CharacterCard({ c, onDelete, onDuplicate }: { c: CharacterDraft; onDelete?: () => void; onDuplicate?: () => void }) {
  const cls = byId(CLASSES, c.classId); const sp = byId(SPECIES, c.speciesId); const s = summarize(c);
  return (
    <div className="frame group p-4 transition hover:frame-gold">
      <div className="flex items-center gap-3">
        <div className="grid size-14 place-items-center rounded-full border border-primary/50 bg-secondary font-display text-xl text-primary">{c.name.charAt(0) || "?"}</div>
        <div className="min-w-0">
          <h3 className="truncate text-lg text-foreground">{c.name || "Sem nome"}</h3>
          <p className="truncate text-xs text-muted-foreground">{sp?.name ?? "—"} · {cls?.name ?? "—"}{c.subclass ? ` (${c.subclass})` : ""}</p>
        </div>
        <span className="ml-auto rounded border border-primary/40 px-2 py-0.5 font-display text-xs text-primary">Nv {c.level}</span>
      </div>
      <div className="mt-4 flex gap-4 text-sm">
        <span className="flex items-center gap-1"><Heart className="size-4 text-destructive" />{s.hp} PV</span>
        <span className="flex items-center gap-1"><Shield className="size-4 text-emerald" />CA {s.ac}</span>
      </div>
      <div className="mt-4 flex gap-2">
        <Link to="/criar" search={{ editar: c.id }} className="flex flex-1 items-center justify-center gap-1 rounded-md bg-gold py-1.5 text-sm font-medium text-primary-foreground"><Pencil className="size-3.5" />Editar</Link>
        {onDuplicate && <button onClick={onDuplicate} aria-label="Duplicar" className="rounded-md border border-border px-2 hover:text-primary"><Copy className="size-4" /></button>}
        {onDelete && <button onClick={onDelete} aria-label="Excluir" className="rounded-md border border-border px-2 hover:text-destructive"><Trash2 className="size-4" /></button>}
      </div>
    </div>
  );
}
