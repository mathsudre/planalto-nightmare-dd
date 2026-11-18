import { describe, expect, it } from "vitest";
import { modifier, proficiencyBonus, hitPoints, pointBuyCost } from "./engine";

describe("motor de regras", () => {
  it("modificador", () => { expect(modifier(8)).toBe(-1); expect(modifier(15)).toBe(2); });
  it("bônus de proficiência", () => { expect(proficiencyBonus(1)).toBe(2); expect(proficiencyBonus(5)).toBe(3); expect(proficiencyBonus(17)).toBe(6); });
  it("PV do bárbaro nível 3 com CON 14", () => expect(hitPoints(12, 3, 14)).toBe(14 + 2 * 9));
  it("compra de pontos", () => expect(pointBuyCost({ FOR: 15, DES: 15, CON: 15, INT: 8, SAB: 8, CAR: 8 })).toBe(27));
});
