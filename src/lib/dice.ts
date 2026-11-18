export type DiceResult = { expression: string; rolls: number[]; modifier: number; total: number; at: number };

export function rollExpression(expression: string): DiceResult {
  const normalized = expression.replace(/\s/g, '').toLowerCase();
  const match = normalized.match(/^(\d+)d(4|6|8|10|12|20|100)([+-]\d+)?$/);
  if (!match) throw new Error('Use uma expressão como 1d20+5 ou 2d6.');
  const count = Number(match[1]);
  const sides = Number(match[2]);
  if (count < 1 || count > 100) throw new Error('A quantidade de dados deve ficar entre 1 e 100.');
  const modifier = Number(match[3] ?? 0);
  const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
  return { expression: normalized, rolls, modifier, total: rolls.reduce((sum, value) => sum + value, 0) + modifier, at: Date.now() };
}
