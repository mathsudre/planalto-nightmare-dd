import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Dices, RotateCcw } from "lucide-react";
import { rollExpression, type DiceResult } from "@/lib/dice";

export const Route = createFileRoute("/rolador")({ component: DiceRoller });

function DiceRoller() {
  const [expression, setExpression] = useState("1d20+5");
  const [result, setResult] = useState<DiceResult | null>(null);
  const [history, setHistory] = useState<DiceResult[]>([]);
  const [error, setError] = useState("");
  const roll = (value = expression) => {
    try { const next = rollExpression(value); setResult(next); setHistory((old) => [next, ...old].slice(0, 12)); setError(""); }
    catch (e) { setError(e instanceof Error ? e.message : "Não foi possível rolar os dados."); }
  };
  return <main className="mx-auto max-w-4xl space-y-6 p-8">
    <header><p className="font-display text-xs uppercase tracking-[0.3em] text-primary">Ferramentas</p><h1 className="mt-2 text-3xl text-gold">Rolador de dados</h1><p className="mt-2 text-sm text-muted-foreground">Resultados locais, detalhados e sem dados fictícios.</p></header>
    <section className="frame frame-gold p-6">
      <div className="flex flex-wrap gap-2">{["1d20", "1d20+5", "2d6+3", "1d100"].map((quick) => <button key={quick} onClick={() => { setExpression(quick); roll(quick); }} className="rounded border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary">{quick}</button>)}</div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row"><input value={expression} onChange={(e) => setExpression(e.target.value)} onKeyDown={(e) => e.key === "Enter" && roll()} aria-label="Expressão de dados" className="flex-1 rounded-md border border-input bg-background px-4 py-3 font-display" /><button onClick={() => roll()} className="inline-flex items-center justify-center gap-2 rounded-md bg-gold px-5 py-3 font-display font-bold text-primary-foreground"><Dices className="size-5" />Rolar</button></div>
      {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      {result && <div className="mt-6 rounded-md border border-primary/40 bg-secondary/40 p-5 text-center"><p className="text-xs uppercase tracking-widest text-muted-foreground">{result.expression}</p><p className="mt-1 text-6xl font-black text-gold">{result.total}</p><p className="mt-2 text-sm text-muted-foreground">Dados: {result.rolls.join(" + ")}{result.modifier ? ` ${result.modifier >= 0 ? "+" : "−"} ${Math.abs(result.modifier)}` : ""}</p></div>}
    </section>
    <section><div className="mb-3 flex items-center justify-between"><h2 className="text-xl">Histórico</h2><button onClick={() => { setHistory([]); setResult(null); }} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><RotateCcw className="size-3" />Limpar</button></div>{history.length === 0 ? <div className="frame p-6 text-sm text-muted-foreground">Nenhuma rolagem realizada.</div> : <div className="space-y-2">{history.map((item) => <div key={item.at} className="frame flex items-center justify-between px-4 py-3"><span className="font-display text-primary">{item.expression}</span><span className="font-bold">{item.total}</span><span className="text-xs text-muted-foreground">{item.rolls.join(", ")}</span></div>)}</div>}</section>
  </main>;
}
