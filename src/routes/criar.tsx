import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { BACKGROUNDS, CLASSES, SPECIES, byId } from "@/lib/rules/data";
import { ABILITIES, ABILITY_NAMES, type Ability, type CharacterDraft, type Method } from "@/lib/rules/types";
import { POINT_BUY_BUDGET, STANDARD_ARRAY, fmtMod, modifier, pointBuyCost, rollAbilitySet, summarize, validate } from "@/lib/rules/engine";
import { listCharacters, loadDraft, newDraft, saveCharacter, storeDraft } from "@/lib/characters";
import classSprite from "@/assets/class-sprite.png";
import speciesSprite from "@/assets/species-sprite.png";
import backgroundSprite from "@/assets/background-sprite.png";
import { SPELLS } from "@/lib/rules/spells";

export const Route = createFileRoute("/criar")({
  validateSearch: (s: Record<string, unknown>): { editar?: string | undefined } => ({ editar: typeof s["editar"] === "string" ? s["editar"] : undefined }),
  head: () => ({ meta: [
    { title: "Criar personagem — Planalto Nightmare" },
    { name: "description", content: "Assistente de criação de personagens com regras de D&D 2024." },
    { property: "og:title", content: "Criar personagem — Planalto Nightmare" },
    { property: "og:description", content: "Assistente de criação de personagens com regras de D&D 2024." },
  ]}),
  component: Creator,
});

const STEPS = ["Configuração", "Classe", "Espécie", "Antecedente", "Atributos", "Ficha", "Revisão"];
const CLASS_ART: Record<string, [number, number]> = {
  barbaro: [0, 0], bardo: [1, 0], bruxo: [2, 0], clerigo: [3, 0], druida: [0, 1], feiticeiro: [1, 1],
  guardiao: [2, 1], guerreiro: [3, 1], ladino: [0, 2], mago: [1, 2], monge: [2, 2], paladino: [3, 2],
};
const SPECIES_ART: Record<string, [number, number]> = {
  aasimar: [0, 0], anao: [1, 0], draconato: [2, 0], elfo: [3, 0], gnomo: [4, 0],
  golias: [0, 1], humano: [1, 1], orc: [2, 1], pequenino: [3, 1], tiferino: [4, 1],
};
const BACKGROUND_ART: Record<string, [number, number]> = {
  acolito: [0, 0], andarilho: [1, 0], artesao: [2, 0], artista: [3, 0],
  charlatao: [0, 1], criminoso: [1, 1], eremita: [2, 1], escriba: [3, 1],
  fazendeiro: [0, 2], guarda: [1, 2], guia: [2, 2], marinheiro: [3, 2],
  mercador: [0, 3], nobre: [1, 3], sabio: [2, 3], soldado: [3, 3],
};
const pill = (on: boolean) => cn("frame cursor-pointer p-4 text-left transition", on ? "frame-gold" : "hover:border-primary/40");

function Creator() {
  const { editar } = Route.useSearch();
  const navigate = useNavigate();
  const [d, setD] = useState<CharacterDraft | null>(null);
  const [step, setStep] = useState(0);
  const [spellQuery, setSpellQuery] = useState("");
  const [spellLevel, setSpellLevel] = useState("Todos");
  useEffect(() => {
    setD((editar && listCharacters().find((c) => c.id === editar)) || loadDraft() || newDraft());
  }, [editar]);
  useEffect(() => { if (d && !editar) storeDraft(d); }, [d, editar]);
  if (!d) return null;
  const up = (p: Partial<CharacterDraft>) => setD({ ...d, ...p, updatedAt: Date.now() });
  const errors = validate(d);
  const sum = summarize(d);
  const cls = byId(CLASSES, d.classId); const bg = byId(BACKGROUNDS, d.backgroundId);
  const eligibleSpells = SPELLS.filter((spell) => !cls || spell.classes.includes(cls.name));
  const visibleSpells = eligibleSpells.filter((spell) => `${spell.name} ${spell.summary}`.toLocaleLowerCase("pt-BR").includes(spellQuery.toLocaleLowerCase("pt-BR")) && (spellLevel === "Todos" || String(spell.level) === spellLevel));
  const selectedSpells = (d.spells ?? "").split("\n").map((value) => value.trim()).filter(Boolean);
  const selectedCantrips = (d.cantrips ?? "").split("\n").map((value) => value.trim()).filter(Boolean);
  const toggleSpell = (name: string, cantrip: boolean) => {
    const current = cantrip ? selectedCantrips : selectedSpells;
    const next = current.includes(name) ? current.filter((value) => value !== name) : [...current, name];
    up(cantrip ? { cantrips: next.join("\n") } : { spells: next.join("\n") });
  };

  const setMethod = (m: Method) => up({ method: m, base: m === "compra" ? { FOR: 8, DES: 8, CON: 8, INT: 8, SAB: 8, CAR: 8 } : { FOR: 15, DES: 14, CON: 13, INT: 12, SAB: 10, CAR: 8 } });
  const rollAttributes = () => {
    const rolls = rollAbilitySet();
    up({ method: "manual", base: Object.fromEntries(ABILITIES.map((a, i) => [a, rolls[i].total])) as CharacterDraft["base"] });
  };
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
                {d.method === "manual" && <button onClick={rollAttributes} className="mt-3 rounded-md border border-primary px-3 py-1.5 text-xs text-primary">Rolar 4d6, descartando o menor</button>}
              </div>
            </div>
          )}
          {step === 1 && (
            <>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {CLASSES.map((c) => (
                  <button key={c.id} onClick={() => up({ classId: c.id, subclass: c.id === d.classId ? d.subclass : undefined })} className={cn(pill(d.classId === c.id), "flex gap-4") }>
                    <div role="img" aria-label={`Ilustração da classe ${c.name}`} className="relative h-40 w-28 shrink-0 overflow-hidden rounded-md border border-border bg-secondary bg-no-repeat" style={{ backgroundImage: `url(${classSprite})`, backgroundSize: "400% 300%", backgroundPosition: `${((CLASS_ART[c.id]?.[0] ?? 0) / 3) * 100}% ${((CLASS_ART[c.id]?.[1] ?? 0) / 2) * 100}%` }} />
                    <div className="min-w-0 flex-1"><div className="flex justify-between"><span className="font-display text-primary">{c.name}</span><span className="text-xs text-muted-foreground">d{c.hitDie}</span></div>
                    <p className="mt-2 text-xs text-muted-foreground">{c.summary}</p>
                    <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] text-foreground/80"><p><span className="text-muted-foreground">Primário:</span> {c.primary.map((a) => ABILITY_NAMES[a]).join("/")}</p><p><span className="text-muted-foreground">Complexidade:</span> {c.complexity}</p><p><span className="text-muted-foreground">Salvaguardas:</span> {c.saves.map((a) => ABILITY_NAMES[a]).join(" e ")}</p><p><span className="text-muted-foreground">Conjuração:</span> {c.caster ? "Sim" : "Não"}</p><p><span className="text-muted-foreground">Subclasses:</span> {c.subclasses.length} no nível 3</p>{c.unarmoredBonus && <p><span className="text-muted-foreground">CA sem armadura:</span> +mod. {ABILITY_NAMES[c.unarmoredBonus]}</p>}</div></div>
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
                <button key={s.id} onClick={() => up({ speciesId: s.id })} className={cn(pill(d.speciesId === s.id), "flex gap-4")}>
                  <div role="img" aria-label={`Ilustração da espécie ${s.name}`} className="relative h-40 w-28 shrink-0 overflow-hidden rounded-md border border-border bg-secondary bg-no-repeat" style={{ backgroundImage: `url(${speciesSprite})`, backgroundSize: "500% 200%", backgroundPosition: `${((SPECIES_ART[s.id]?.[0] ?? 0) / 4) * 100}% ${((SPECIES_ART[s.id]?.[1] ?? 0)) * 100}%` }} />
                  <div className="min-w-0 flex-1 text-left"><div className="flex justify-between"><span className="font-display text-primary">{s.name}</span><span className="text-xs text-muted-foreground">{s.speed} m</span></div>
                  <p className="mt-2 text-xs text-muted-foreground">{s.summary}</p>
                  <p className="mt-3 text-[11px] text-foreground/80">{s.size} · Traços da espécie 2024</p></div>
                </button>
              ))}
            </div>
          )}
          {step === 3 && (
            <>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {BACKGROUNDS.map((b) => (
                  <button key={b.id} onClick={() => up({ backgroundId: b.id, bonus2: undefined, bonus1: undefined })} className={cn(pill(d.backgroundId === b.id), "flex gap-4")}>
                    <div role="img" aria-label={`Ilustração do antecedente ${b.name}`} className="relative h-40 w-28 shrink-0 overflow-hidden rounded-md border border-border bg-secondary bg-no-repeat" style={{ backgroundImage: `url(${backgroundSprite})`, backgroundSize: "400% 400%", backgroundPosition: `${((BACKGROUND_ART[b.id]?.[0] ?? 0) / 3) * 100}% ${((BACKGROUND_ART[b.id]?.[1] ?? 0) / 3) * 100}%` }} />
                    <div className="min-w-0 flex-1 text-left"><span className="font-display text-sm text-primary">{b.name}</span>
                    <p className="mt-2 text-[11px] text-muted-foreground">{b.abilities.map((a) => ABILITY_NAMES[a]).join(" · ")}</p><p className="mt-3 text-[11px] text-foreground/80">Talento: {b.feat}</p><p className="mt-2 text-[10px] text-muted-foreground">{b.skills.join(" · ")}</p></div>
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
                        onChange={(e) => up({ base: { ...d.base, [a]: Math.max(3, Math.min(d.method === "compra" ? 15 : 18, +e.target.value || 0)) } })} className="mt-1 w-16 rounded bg-background px-2 py-1 text-center" />
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">final {sum.scores[a]} ({fmtMod(modifier(sum.scores[a]))})</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {step === 5 && (
            <div className="space-y-4">
              <div className="frame space-y-4 p-5"><h2 className="text-xl text-primary">Identidade e personalidade</h2><div className="grid gap-3 sm:grid-cols-2"><label className="text-sm">Apelido<input value={d.nickname ?? ""} onChange={(e) => up({ nickname: e.target.value })} className="mt-1 w-full rounded border bg-background px-3 py-2" /></label><label className="text-sm">Idade<input value={d.age ?? ""} onChange={(e) => up({ age: e.target.value })} className="mt-1 w-full rounded border bg-background px-3 py-2" /></label><label className="text-sm">Gênero<input value={d.gender ?? ""} onChange={(e) => up({ gender: e.target.value })} className="mt-1 w-full rounded border bg-background px-3 py-2" /></label><label className="text-sm">Altura / peso<input value={`${d.height ?? ""}${d.height || d.weight ? " / " : ""}${d.weight ?? ""}`} onChange={(e) => { const [height, weight = ""] = e.target.value.split("/"); up({ height: height.trim(), weight: weight.trim() }); }} placeholder="Ex.: 1,80 m / 75 kg" className="mt-1 w-full rounded border bg-background px-3 py-2" /></label></div><label className="block text-sm">Aparência<textarea value={d.appearance ?? ""} onChange={(e) => up({ appearance: e.target.value })} className="mt-1 min-h-20 w-full rounded border bg-background px-3 py-2" /></label><label className="block text-sm">Personalidade e história<textarea value={`${d.personality ?? ""}${d.personality || d.history ? "\n\n" : ""}${d.history ?? ""}`} onChange={(e) => up({ personality: e.target.value })} placeholder="Descreva personalidade e história" className="mt-1 min-h-28 w-full rounded border bg-background px-3 py-2" /></label></div>
              <div className="frame space-y-4 p-5"><h2 className="text-xl text-primary">Ficha de jogo</h2><div className="grid gap-3 sm:grid-cols-3"><label className="text-sm">XP<input type="number" min="0" value={d.xp ?? 0} onChange={(e) => up({ xp: Number(e.target.value) || 0 })} className="mt-1 w-full rounded border bg-background px-3 py-2" /></label><label className="text-sm">PV atuais<input type="number" min="0" value={d.currentHp ?? sum.hp} onChange={(e) => up({ currentHp: Number(e.target.value) || 0 })} className="mt-1 w-full rounded border bg-background px-3 py-2" /></label><label className="text-sm">PV temporários<input type="number" min="0" value={d.temporaryHp ?? 0} onChange={(e) => up({ temporaryHp: Number(e.target.value) || 0 })} className="mt-1 w-full rounded border bg-background px-3 py-2" /></label></div><label className="block text-sm">Idiomas<input value={(d.languages ?? ["Comum"]).join(", ")} onChange={(e) => up({ languages: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) })} className="mt-1 w-full rounded border bg-background px-3 py-2" /></label><label className="block text-sm">Equipamento e inventário<textarea value={d.inventory ?? ""} onChange={(e) => up({ inventory: e.target.value })} className="mt-1 min-h-20 w-full rounded border bg-background px-3 py-2" /></label><label className="block text-sm">Características, talentos e ataques<textarea value={[d.classFeatures, d.speciesTraits, d.feats, d.attacks].filter(Boolean).join("\n\n")} onChange={(e) => up({ classFeatures: e.target.value })} className="mt-1 min-h-24 w-full rounded border bg-background px-3 py-2" /></label></div>
              <div className="frame space-y-3 p-5"><div><h2 className="text-xl text-primary">Magias e truques</h2><p className="mt-1 text-xs text-muted-foreground">{cls?.caster ? `Registros elegíveis para ${cls.name}. Selecione para salvar na ficha.` : "A classe selecionada não possui conjuração cadastrada."}</p></div>{cls?.caster && <><div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"><label className="text-xs text-muted-foreground"><span className="mb-1 block">Buscar magia</span><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2" /><input value={spellQuery} onChange={(e) => setSpellQuery(e.target.value)} placeholder="Nome ou descrição..." className="w-full rounded border bg-background py-2 pl-9 pr-3" /></div></label><label className="text-xs text-muted-foreground"><span className="mb-1 block">Círculo</span><select value={spellLevel} onChange={(e) => setSpellLevel(e.target.value)} className="rounded border bg-background px-3 py-2 text-sm"><option>Todos</option>{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <option key={n} value={n}>{n === 0 ? "Truques" : `${n}º círculo`}</option>)}</select></label></div><p className="text-xs text-muted-foreground">{visibleSpells.length} registros encontrados</p><div className="grid gap-3 md:grid-cols-2">{visibleSpells.map((spell) => { const cantrip = spell.level === 0; const checked = (cantrip ? selectedCantrips : selectedSpells).includes(spell.name); return <label key={spell.id} className={cn("cursor-pointer rounded border p-3", checked ? "border-primary bg-primary/10" : "border-border")}><div className="flex gap-2"><input type="checkbox" checked={checked} onChange={() => toggleSpell(spell.name, cantrip)} className="mt-1 accent-primary" /><span><span className="text-sm text-primary">{spell.name}</span><span className="ml-2 text-[10px] text-muted-foreground">{cantrip ? "Truque" : `${spell.level}º círculo`}</span><span className="mt-1 block text-xs text-muted-foreground">{spell.summary}</span></span></div></label>; })}</div></>}{cls?.caster && <p className="text-xs text-muted-foreground">Selecionadas: {selectedCantrips.length} truque(s) e {selectedSpells.length} magia(s).</p>}</div>
            </div>
          )}
          {step === 6 && (
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
