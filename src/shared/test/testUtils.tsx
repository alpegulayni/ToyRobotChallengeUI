import * as React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { AppThemeProvider } from "@/app/providers/AppThemeProvider";

export function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
  return render(<AppThemeProvider>{ui}</AppThemeProvider>, options);
}
