import type { Preview } from "@storybook/react";
import * as React from "react";
import { AppThemeProvider } from "../src/app/providers/AppThemeProvider";

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    layout: "padded"
  },
  decorators: [
    (Story) => (
      <AppThemeProvider>
        <Story />
      </AppThemeProvider>
    )
  ]
};

export default preview;
