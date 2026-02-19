import { describe, it, expect } from "vitest";
import { buildGridPlacementVM, cellIndexFor } from "./GridPlacement.viewModel";
import type { IPlacementParser } from "@/shared/domain/placement/placementParser.types";

describe("GridPlacement ViewModel", () => {
  it("cellIndexFor maps (x,y) to correct index", () => {
    expect(cellIndexFor(0, 4)).toBe(0);
    expect(cellIndexFor(0, 0)).toBe(20);
    expect(cellIndexFor(4, 0)).toBe(24);
  });

  it("marks occupied cell and sets rotation", () => {
    const fakeParser: IPlacementParser = {
      parse: () => ({ ok: true, value: { x: 0, y: 0, direction: "SOUTH" } }),
    };

    const vm = buildGridPlacementVM("0,0 SOUTH", fakeParser);
    expect(vm.ok).toBe(true);
    if (vm.ok) {
      const occupied = vm.cells.find((c) => c.isOccupied);
      expect(occupied?.x).toBe(0);
      expect(occupied?.y).toBe(0);
      expect(occupied?.rotation).toBe(180);
    }
  });
});
