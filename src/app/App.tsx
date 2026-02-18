import * as React from "react";
import { Container, Box, TextField, Paper, Typography } from "@mui/material";
import { GridPlacement } from "@/features/gridPlacement";

export function App() {
  const [value, setValue] = React.useState("1,1 NORTH");

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Grid Placement Demo
        </Typography>

        <Box sx={{ display: "grid", gap: 2, maxWidth: 420 }}>
          <TextField
            label='Placement (e.g. "1,1 NORTH")'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
          />

          <GridPlacement placement={value} />
        </Box>
      </Paper>
    </Container>
  );
}
