import type { PlacementParseResult, IPlacementParser } from "@/shared/domain/placement/placementParser.types";
import type { Direction } from "@/shared/domain/placement/placementTypes";
import { rotationDegrees } from "@/shared/domain/placement/direction";

export type GridCellVM = {
  x: number;
  y: number;
  isOccupied: boolean;
  ariaLabel?: string;
  rotation?: number;
};

export type GridPlacementVM =
  | {
      ok: true;
      cells: GridCellVM[];
      occupied: { x: number; y: number; direction: Direction; rotation: number };
    }
  | { ok: false; errorMessage: string; cells: GridCellVM[] };

export function cellIndexFor(x: number, y: number): number {
  return (4 - y) * 5 + x;
}

export function buildGridPlacementVM(placementInput: string, parser: IPlacementParser): GridPlacementVM {
  const parse: PlacementParseResult = parser.parse(placementInput);

  const cells: GridCellVM[] = [];
  for (let y = 4; y >= 0; y--) {
    for (let x = 0; x <= 4; x++) {
      cells.push({ x, y, isOccupied: false });
    }
  }

  if (!parse.ok) return { ok: false, errorMessage: parse.error.message, cells };

  const { x, y, direction } = parse.value;
  const rotation = rotationDegrees(direction);

  const idx = cellIndexFor(x, y);
  cells[idx] = {
    ...cells[idx],
    isOccupied: true,
    rotation,
    ariaLabel: `object at ${x},${y} facing ${direction}`,
  };

  return { ok: true, cells, occupied: { x, y, direction, rotation } };
}
