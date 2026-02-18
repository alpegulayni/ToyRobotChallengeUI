import type { Placement, PlacementError } from "./placementTypes";

export type PlacementParseResult =
  | { ok: true; value: Placement }
  | { ok: false; error: PlacementError };

export interface IPlacementParser {
  parse(input: string): PlacementParseResult;
}
