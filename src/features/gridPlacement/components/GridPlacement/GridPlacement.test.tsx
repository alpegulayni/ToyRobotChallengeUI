import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GridPlacement } from "./GridPlacement";

// ✅ Mock only the ViewModel builder so tests are stable & focused on UI behavior
vi.mock("./GridPlacement.viewModel", () => ({
  buildGridPlacementVM: vi.fn(),
}));

import { buildGridPlacementVM } from "./GridPlacement.viewModel";

type VmOk = {
  ok: true;
  errorMessage: "";
  occupied: { x: number; y: number; direction: string };
  cells: Array<{
    x: number;
    y: number;
    isOccupied: boolean;
    rotation: number;
    ariaLabel: string;
  }>;
};

type VmFail = {
  ok: false;
  errorMessage: string;
  occupied: { x: 0; y: 0; direction: "NORTH" };
  cells: Array<{
    x: number;
    y: number;
    isOccupied: boolean;
    rotation: number;
    ariaLabel: string;
  }>;
};

function makeCells(occupied?: { x: number; y: number; ariaLabel?: string; rotation?: number }) {
  const cells: VmOk["cells"] = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const isOcc = occupied ? col === occupied.x && row === occupied.y : false;
      cells.push({
        x: col,
        y: row,
        isOccupied: isOcc,
        rotation: isOcc ? occupied.rotation ?? 0 : 0,
        ariaLabel: isOcc ? occupied.ariaLabel ?? `robot-${col}-${row}` : `cell-${col}-${row}`,
      });
    }
  }
  return cells;
}

describe("<GridPlacement />", () => {
  it("renders title and input text", () => {
    (buildGridPlacementVM as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ok: true,
      errorMessage: "",
      occupied: { x: 1, y: 2, direction: "NORTH" },
      cells: makeCells({ x: 1, y: 2, ariaLabel: "robot at 1,2", rotation: 0 }),
    } satisfies VmOk);

    render(<GridPlacement placement="1,2 NORTH" />);

    expect(screen.getByText("5×5 Grid Visualizer")).toBeInTheDocument();
    expect(screen.getByText(/Input:/)).toBeInTheDocument();
    expect(screen.getByText("1,2 NORTH")).toBeInTheDocument();
  });

  it("shows occupied cell icon container by aria-label and parsed summary when vm.ok=true", () => {
    (buildGridPlacementVM as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ok: true,
      errorMessage: "",
      occupied: { x: 3, y: 4, direction: "EAST" },
      cells: makeCells({ x: 3, y: 4, ariaLabel: "robot at 3,4 facing EAST", rotation: 90 }),
    } satisfies VmOk);

    render(<GridPlacement placement="3,4 EAST" />);

    // The occupied cell wrapper has aria-label={cell.ariaLabel}
    expect(screen.getByLabelText("robot at 3,4 facing EAST")).toBeInTheDocument();

    // Parsed summary should appear only when ok
    expect(screen.getByText(/Parsed:/)).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument(); // x
    expect(screen.getByText("4")).toBeInTheDocument(); // y
    expect(screen.getByText("EAST")).toBeInTheDocument();
  });

  it("shows error alert and calls onError when vm.ok=false", () => {
    const onError = vi.fn();

    (buildGridPlacementVM as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ok: false,
      errorMessage: "Invalid input format",
      occupied: { x: 0, y: 0, direction: "NORTH" },
      cells: makeCells(), // no occupied
    } satisfies VmFail);

    render(<GridPlacement placement="bad-input" onError={onError} />);

    expect(screen.getByText("Invalid input format")).toBeInTheDocument();
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith("Invalid input format");
  });

  it("hides axis labels when showAxisLabels=false", () => {
    (buildGridPlacementVM as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ok: true,
      errorMessage: "",
      occupied: { x: 0, y: 0, direction: "NORTH" },
      cells: makeCells({ x: 0, y: 0, ariaLabel: "robot at 0,0", rotation: 0 }),
    } satisfies VmOk);

    render(<GridPlacement placement="0,0 NORTH" showAxisLabels={false} />);

    // axis labels are rendered as "x,y" text in each cell; ensure one common label is absent
    expect(screen.queryByText("0,0")).not.toBeInTheDocument();
    expect(screen.queryByText("4,4")).not.toBeInTheDocument();
  });
});
