import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BACKGROUNDS, CLASSES, SPECIES, byId } from "@/lib/rules/data";
import { ABILITIES, ABILITY_NAMES, type Ability, type CharacterDraft, type Method } from "@/lib/rules/types";
import { POINT_BUY_BUDGET, STANDARD_ARRAY, fmtMod, modifier, pointBuyCost, summarize, validate } from "@/lib/rules/engine";
import { listCharacters, loadDraft, newDraft, saveCharacter, storeDraft } from "@/lib/characters";

export const Route = createFileRoute("/criar")({
  validateSearch: (s: Record<string, unknown>): { editar?: string } => ({ editar: typeof s.editar === "string" ? s.editar : undefined }),
  head: () => ({ meta: [
    { title: "Criar personagem — Planalto Nightmare" },
    { name: "description", content: "Assistente de criação de personagens com regras de D&D 2024." },
    { property: "og:title", content: "Criar personagem — Planalto Nightmare" },
    { property: "og:description", content: "Assistente de criação de personagens com regras de D&D 2024." },
  ]}),
  component: Creator,
});

const STEPS = ["Configuração", "Classe", "Espécie", "Antecedente", "Atributos", "Revisão"];
const pill = (on: boolean) => cn("frame cursor-pointer p-4 text-left transition", on ? "frame-gold" : "hover:border-primary/40");

function Creator() {
  const { editar } = Route.useSearch();
  const navigate = useNavigate();
  const [d, setD] = useState<CharacterDraft | null>(null);
  const [step, setStep] = useState(0);
  useEffect(() => {
    setD((editar && listCharacters().find((c) => c.id === editar)) || loadDraft() || newDraft());
  }, [editar]);
  useEffect(() => { if (d && !editar) storeDraft(d); }, [d, editar]);
  if (!d) return null;
  const up = (p: Partial<CharacterDraft>) => setD({ ...d, ...p, updatedAt: Date.now() });
  const errors = validate(d);
  const sum = summarize(d);
  const cls = byId(CLASSES, d.classId); const bg = byId(BACKGROUNDS, d.backgroundId);

  const setMethod = (m: Method) => up({ method: m, base: m === "compra" ? { FOR: 8, DES: 8, CON: 8, INT: 8, SAB: 8, CAR: 8 } : { FOR: 15, DES: 14, CON: 13, INT: 12, SAB: 10, CAR: 8 } });
  const swapStd = (a: Ability, v: number) => {
    const other = ABILITIES.find((x) => d.base[x] === v)!;
    up({ base: { ...d.base, [other]: d.base[a], [a]: v } });
  };
  const finish = () => { saveCharacter(d); if (!editar) storeDraft(null); navigate({ to: "/personagens" }); };

  return (
    <main className="grid gap-6 p-6 lg:grid-cols-[1fr_300px]">
      <div>
        <h1 className="text-3xl text-gold">{editar ? "Editar personagem" : "Criar personagem"}</h1>
        <ol className="mt-4 flex flex-wrap gap-2">
          {STEPS.map((s, i) => (
            <li key={s}><button onClick={() => setStep(i)} className={cn("rounded-full border px-3 py-1 text-xs font-display", i === step ? "border-primary bg-primary/15 text-primary" : i < step ? "border-emerald/60 text-emerald" : "border-border text-muted-foreground")}>{i + 1}. {s}</button></li>
          ))}
        </ol>
        <div className="mt-2 h-1 overflow-hidden rounded bg-secondary"><div className="h-full bg-gold transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>

        <section className="mt-6 space-y-4">
          {step === 0 && (
            <div className="frame space-y-4 p-5">
              <label className="block text-sm">Nome do personagem
                <input value={d.name} onChange={(e) => up({ name: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2" placeholder="Ex.: Lyra Sombraluz" />
              </label>
              <label className="block text-sm">Nível inicial: <b className="text-primary">{d.level}</b>
                <input type="range" min={1} max={20} value={d.level} onChange={(e) => up({ level: +e.target.value })} className="mt-1 w-full accent-primary" />
              </label>
              <div className="text-sm">Método de atributos
                <div className="mt-1 flex gap-2">
                  {([["padrao", "Conjunto padrão"], ["compra", "Compra de pontos"], ["manual", "Manual / rolagem"]] as const).map(([m, l]) => (
                    <button key={m} onClick={() => setMethod(m)} className={cn("rounded-md border px-3 py-1.5", d.method === m ? "border-primary text-primary" : "border-border")}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {step === 1 && (
            <>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {CLASSES.map((c) => (
                  <button key={c.id} onClick={() => up({ classId: c.id, subclass: c.id === d.classId ? d.subclass : undefined })} className={pill(d.classId === c.id)}>
                    <div className="flex justify-between"><span className="font-display text-primary">{c.name}</span><span className="text-xs text-muted-foreground">d{c.hitDie}</span></div>
                    <p className="mt-1 text-xs text-muted-foreground">{c.summary}</p>
                    <p className="mt-2 text-[11px] text-foreground/80">Primário: {c.primary.map((a) => ABILITY_NAMES[a]).join("/")} · {c.complexity}</p>
                  </button>
                ))}
              </div>
              {cls && (
                <div className="frame p-5">
                  <h2 className="text-lg text-foreground">Subclasse {d.level < 3 && <span className="text-xs text-muted-foreground">(disponível no nível 3)</span>}</h2>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {cls.subclasses.map((s) => (
                      <button key={s} disabled={d.level < 3} onClick={() => up({ subclass: s })} className={cn(pill(d.subclass === s), "py-2 text-sm disabled:opacity-40")}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          {step === 2 && (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {SPECIES.map((s) => (
                <button key={s.id} onClick={() => up({ speciesId: s.id })} className={pill(d.speciesId === s.id)}>
                  <span className="font-display text-primary">{s.name}</span>
                  <p className="mt-1 text-xs text-muted-foreground">{s.summary}</p>
                  <p className="mt-2 text-[11px] text-foreground/80">{s.size} · Desl. {s.speed} m</p>
                </button>
              ))}
            </div>
          )}
          {step === 3 && (
            <>
              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {BACKGROUNDS.map((b) => (
                  <button key={b.id} onClick={() => up({ backgroundId: b.id, bonus2: undefined, bonus1: undefined })} className={pill(d.backgroundId === b.id)}>
                    <span className="font-display text-sm text-primary">{b.name}</span>
                    <p className="mt-1 text-[11px] text-muted-foreground">{b.abilities.join(" · ")}</p>
                  </button>
                ))}
              </div>
              {bg && (
                <div className="frame space-y-3 p-5 text-sm">
                  <p>Aumento de atributo do antecedente:</p>
                  <div className="flex gap-2">
                    {(["2-1", "1-1-1"] as const).map((m) => <button key={m} onClick={() => up({ bonusMode: m })} className={cn("rounded-md border px-3 py-1", d.bonusMode === m ? "border-primary text-primary" : "border-border")}>{m === "2-1" ? "+2 / +1" : "+1 / +1 / +1"}</button>)}
                  </div>
                  {d.bonusMode === "2-1" && (["bonus2", "bonus1"] as const).map((k) => (
                    <div key={k} className="flex items-center gap-2"><span className="w-8 text-primary">{k === "bonus2" ? "+2" : "+1"}</span>
                      {bg.abilities.map((a) => <button key={a} onClick={() => up({ [k]: a })} className={cn("rounded border px-2 py-0.5", d[k] === a ? "border-primary text-primary" : "border-border")}>{ABILITY_NAMES[a]}</button>)}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {step === 4 && (
            <div className="frame p-5">
              {d.method === "compra" && <p className="mb-3 text-sm">Pontos usados: <b className={pointBuyCost(d.base) > POINT_BUY_BUDGET ? "text-destructive" : "text-primary"}>{pointBuyCost(d.base)}</b> / {POINT_BUY_BUDGET}</p>}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {ABILITIES.map((a) => (
                  <div key={a} className="rounded-md border border-border p-3 text-center">
                    <p className="font-display text-xs text-muted-foreground">{ABILITY_NAMES[a]}</p>
                    {d.method === "padrao" ? (
                      <select value={d.base[a]} onChange={(e) => swapStd(a, +e.target.value)} className="mt-1 rounded bg-background px-2 py-1">{STANDARD_ARRAY.map((v) => <option key={v}>{v}</option>)}</select>
                    ) : (
                      <input type="number" min={d.method === "compra" ? 8 : 3} max={d.method === "compra" ? 15 : 18} value={d.base[a]}
                        onChange={(e) => up({ base: { ...d.base, [a]: +e.target.value } })} className="mt-1 w-16 rounded bg-background px-2 py-1 text-center" />
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">final {sum.scores[a]} ({fmtMod(modifier(sum.scores[a]))})</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {step === 5 && (
            <div className="frame space-y-3 p-5">
              {errors.length ? (
                <ul className="space-y-1 text-sm text-destructive">{errors.map((e) => <li key={e}>• {e}</li>)}</ul>
              ) : <p className="flex items-center gap-2 text-emerald"><Check className="size-4" />Personagem válido segundo as regras.</p>}
              <button disabled={errors.length > 0} onClick={finish} className="rounded-md bg-gold px-5 py-2 font-display font-bold text-primary-foreground disabled:opacity-40">Salvar personagem</button>
            </div>
          )}
        </section>
        <div className="mt-6 flex justify-between">
          <button disabled={step === 0} onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-sm text-muted-foreground disabled:opacity-30"><ChevronLeft className="size-4" />Voltar</button>
          {step < STEPS.length - 1 && <button onClick={() => setStep(step + 1)} className="flex items-center gap-1 rounded-md border border-primary px-4 py-1.5 text-sm text-primary">Avançar<ChevronRight className="size-4" /></button>}
        </div>
      </div>

      <aside className="frame frame-gold h-fit p-5 lg:sticky lg:top-6">
        <p className="font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Prévia da ficha</p>
        <h2 className="mt-1 text-2xl text-gold">{d.name || "Sem nome"}</h2>
        <p className="text-xs text-muted-foreground">{byId(SPECIES, d.speciesId)?.name ?? "Espécie?"} · {cls?.name ?? "Classe?"} {d.level} {d.subclass && `· ${d.subclass}`}</p>
        <p className="text-xs text-muted-foreground">{bg?.name ?? "Antecedente?"}</p>
        <div className="ornament my-4" />
        <div className="grid grid-cols-4 gap-2 text-center">
          {[["PV", sum.hp || "—"], ["CA", sum.ac], ["Prof.", fmtMod(sum.prof)], ["Inic.", fmtMod(sum.initiative)]].map(([l, v]) => (
            <div key={l as string} className="rounded border border-border py-2"><p className="text-[10px] text-muted-foreground">{l}</p><p className="font-display text-primary">{v}</p></div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {ABILITIES.map((a) => (
            <div key={a} className="rounded border border-border py-2"><p className="text-[10px] text-muted-foreground">{a}</p><p className="font-display text-lg">{sum.scores[a]}</p><p className="text-xs text-accent">{fmtMod(modifier(sum.scores[a]))}</p></div>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-muted-foreground">CA sem armadura. Progresso salvo automaticamente.</p>
      </aside>
    </main>
  );
}
