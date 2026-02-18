import * as React from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Typography, Alert } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import type { IPlacementParser } from "@/shared/domain/placement/placementParser.types";
import { PlacementParser } from "@/shared/domain/placement/placementParser";
import { buildGridPlacementVM } from "./GridPlacement.viewModel";

export type GridPlacementProps = {
  placement: string;
  size?: number;
  showAxisLabels?: boolean;
  parser?: IPlacementParser;
  onError?: (message: string) => void;
};

export function GridPlacement({ placement, size = 56, showAxisLabels = true, parser, onError }: GridPlacementProps) {
  const defaultParser = React.useMemo(() => new PlacementParser(), []);
  const activeParser = parser ?? defaultParser;

  const vm = React.useMemo(() => buildGridPlacementVM(placement, activeParser), [placement, activeParser]);

  React.useEffect(() => {
    if (!vm.ok) onError?.(vm.errorMessage);
  }, [vm, onError]);

  return (
    <Box sx={{ display: "grid", gap: 1 }}>
      <Typography variant="h6">5×5 Grid Visualizer</Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        Input: <b>{placement}</b> (0,0 is bottom-left / South West)
      </Typography>

      {!vm.ok && (
        <Alert severity="error" sx={{ maxWidth: 520 }}>
          {vm.errorMessage}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ width: "fit-content" }}>
        <Table size="small" aria-label="5x5 grid">
          <TableBody>
            {[0, 1, 2, 3, 4].map((rowIndex) => (
              <TableRow key={`row-${rowIndex}`}>
                {vm.cells.slice(rowIndex * 5, rowIndex * 5 + 5).map((cell) => (
                  <TableCell
                    key={`cell-${cell.x}-${cell.y}`}
                    align="center"
                    sx={{
                      width: size,
                      height: size,
                      padding: 0,
                      border: "1px solid",
                      borderColor: "divider",
                      position: "relative",
                      backgroundColor: cell.isOccupied ? "action.hover" : "background.paper",
                    }}
                  >
                    <Box sx={{ position: "absolute", top: 4, left: 6, fontSize: 11, opacity: 0.6, userSelect: "none" }}>
                      {showAxisLabels ? `${cell.x},${cell.y}` : ""}
                    </Box>

                    {cell.isOccupied && (
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          height: "100%",
                        }}
                        aria-label={cell.ariaLabel}
                      >
                        <ArrowUpwardIcon
                          sx={{
                            fontSize: Math.max(20, Math.floor(size * 0.45)),
                            transform: `rotate(${cell.rotation}deg)`,
                            transition: "transform 120ms ease",
                          }}
                        />
                      </Box>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {vm.ok && (
        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          Parsed: x=<b>{vm.occupied.x}</b>, y=<b>{vm.occupied.y}</b>, direction=<b>{vm.occupied.direction}</b>
        </Typography>
      )}
    </Box>
  );
}
