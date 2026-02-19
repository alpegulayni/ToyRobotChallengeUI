import { describe, it, expect } from "vitest";
import { PlacementParser } from "./placementParser";

describe("PlacementParser", () => {
  const parser = new PlacementParser();

  it("parses valid input", () => {
    const r = parser.parse("1,1 NORTH");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toEqual({ x: 1, y: 1, direction: "NORTH" });
  });

  it("rejects out of range", () => {
    const r = parser.parse("5,0 EAST");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("OUT_OF_RANGE");
  });

  it("rejects invalid direction", () => {
    const r = parser.parse("1,1 NORTHWEST");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("INVALID_DIRECTION");
  });

  it("rejects invalid format", () => {
    const r = parser.parse("1 1 NORTH");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("INVALID_FORMAT");
  });
});
