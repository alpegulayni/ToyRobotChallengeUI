export type Direction = "NORTH" | "EAST" | "SOUTH" | "WEST";

export type Placement = {
  x: number; // 0..4
  y: number; // 0..4
  direction: Direction;
};

export type PlacementErrorCode =
  | "EMPTY"
  | "INVALID_FORMAT"
  | "OUT_OF_RANGE"
  | "INVALID_DIRECTION";

export type PlacementError = {
  code: PlacementErrorCode;
  message: string;
};
