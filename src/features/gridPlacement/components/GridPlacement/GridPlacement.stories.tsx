import type { Meta, StoryObj } from "@storybook/react";
import { GridPlacement } from "./GridPlacement";
import { Box } from "@mui/material";

const meta: Meta<typeof GridPlacement> = {
  title: "Features/GridPlacement/GridPlacement",
  component: GridPlacement,
  args: {
    size: 56,
    showAxisLabels: true,
  },
  decorators: [(Story) => (<Box sx={{ p: 3 }}><Story /></Box>)],
};
export default meta;

type Story = StoryObj<typeof GridPlacement>;

export const InvalidFormat: Story = { args: { placement: "Invalid input" } };
export const InvalidOutOfRange: Story = { args: { placement: "5,1 NORTH" } };
export const InvalidDirection: Story = { args: { placement: "1,1 NORTHWEST" } };

export const CenterNorth: Story = { args: { placement: "2,2 NORTH" } };
export const CenterEast: Story = { args: { placement: "2,2 EAST" } };
export const CenterWest: Story = { args: { placement: "2,2 WEST" } };
export const CenterSouth: Story = { args: { placement: "2,2 SOUTH" } };

export const CornerNorthEastFacingWest: Story = { args: { placement: "4,4 WEST" } };
export const CornerSouthWestFacingSouth: Story = { args: { placement: "0,0 SOUTH" } };
export const EdgeCaseEast: Story = { args: { placement: "4,0 EAST" } };
