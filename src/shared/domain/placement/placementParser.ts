import type { Direction, Placement, PlacementError } from "./placementTypes";
import type { IPlacementParser, PlacementParseResult } from "./placementParser.types";

const DIRECTIONS: Direction[] = ["NORTH", "EAST", "SOUTH", "WEST"];

function isDirection(v: string): v is Direction {
  return (DIRECTIONS as string[]).includes(v);
}

function error(code: PlacementError["code"], message: string): PlacementParseResult {
  return { ok: false, error: { code, message } };
}

function inRange(n: number): boolean {
  return Number.isInteger(n) && n >= 0 && n <= 4;
}

export class PlacementParser implements IPlacementParser {
  parse(input: string): PlacementParseResult {
    const raw = (input ?? "").trim();
    if (!raw) return error("EMPTY", "Input is empty.");

    const parts = raw.split(/\s+/);
    if (parts.length != 2) {
      return error("INVALID_FORMAT", 'Invalid format. Expected "x,y DIRECTION" like "1,1 NORTH".');
    }

    const [coordsPart, dirPart] = parts;
    const directionCandidate = dirPart.toUpperCase();

    if (!isDirection(directionCandidate)) {
      return error("INVALID_DIRECTION", `Direction must be one of: ${DIRECTIONS.join(", ")}.`);
    }

    const coords = coordsPart.split(",");
    if (coords.length !== 2) {
      return error("INVALID_FORMAT", 'Invalid format. Expected "x,y DIRECTION" like "1,1 NORTH".');
    }

    const x = Number(coords[0].trim());
    const y = Number(coords[1].trim());

    if (!inRange(x) || !inRange(y)) {
      return error("OUT_OF_RANGE", "x and y must be integers between 0 and 4.");
    }

    const value: Placement = { x, y, direction: directionCandidate };
    return { ok: true, value };
  }
}
