import * as React from "react";
import {
  Alert,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
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

export function GridPlacement({
  placement,
  size = 56,
  showAxisLabels = true,
  parser,
  onError,
}: GridPlacementProps) {
  const defaultParser = React.useMemo(() => new PlacementParser(), []);
  const activeParser = parser ?? defaultParser;

  const vm = React.useMemo(
    () => buildGridPlacementVM(placement, activeParser),
    [placement, activeParser]
  );

  React.useEffect(() => {
    if (!vm.ok) onError?.(vm.errorMessage);
  }, [vm.ok, vm, onError]);

  const iconSize = Math.max(20, Math.floor(size * 0.45));
  const rows = [0, 1, 2, 3, 4];

  return (
    <Box sx={{ display: "grid", gap: 1 }}>
      <Typography variant="h6">5×5 Grid Visualizer</Typography>

      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        Input: <b>{placement}</b> (0,0 is bottom-left)
      </Typography>

      {!vm.ok && (
        <Alert severity="error" sx={{ maxWidth: 520 }}>
          {vm.errorMessage}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ width: "fit-content" }}>
        <Table size="small" aria-label="5x5 grid">
          <TableBody>
            {rows.map((rowIndex) => (
              <TableRow key={`row-${rowIndex}`}>
                {vm.cells
                  .slice(rowIndex * 5, rowIndex * 5 + 5)
                  .map((cell) => (
                    <TableCell
                      key={`cell-${cell.x}-${cell.y}`}
                      align="center"
                      sx={{
                        width: size,
                        height: size,
                        p: 0,
                        border: "1px solid",
                        borderColor: "divider",
                        position: "relative",
                        backgroundColor: cell.isOccupied
                          ? "action.hover"
                          : "background.paper",
                      }}
                    >
                      {showAxisLabels && (
                        <Box
                          sx={{
                            position: "absolute",
                            left: 6,
                            bottom: 4, // moved to lower-left
                            fontSize: 11,
                            opacity: 0.6,
                            userSelect: "none",
                          }}
                        >
                          {cell.x},{cell.y}
                        </Box>
                      )}

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
                              fontSize: iconSize,
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
          Parsed: x=<b>{vm.occupied.x}</b>, y=<b>{vm.occupied.y}</b>, direction=
          <b>{vm.occupied.direction}</b>
        </Typography>
      )}
    </Box>
  );
}
