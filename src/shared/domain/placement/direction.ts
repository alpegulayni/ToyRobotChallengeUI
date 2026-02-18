import type { Direction } from "./placementTypes";

export function rotationDegrees(direction: Direction): number {
  switch (direction) {
    case "NORTH":
      return 0;
    case "EAST":
      return 90;
    case "SOUTH":
      return 180;
    case "WEST":
      return 270;
  }
}
