import { describe, expect, it } from "vitest";
import { rollExpression } from "./dice";

describe("rollExpression", () => {
  it("respeita a quantidade, faces e modificador", () => {
    const result = rollExpression("2d6+3");
    expect(result.rolls).toHaveLength(2);
    expect(result.rolls.every((value) => value >= 1 && value <= 6)).toBe(true);
    expect(result.total).toBe(result.rolls[0] + result.rolls[1] + 3);
  });
  it("rejeita expressões inválidas", () => {
    expect(() => rollExpression("1d7")).toThrow();
  });
});
