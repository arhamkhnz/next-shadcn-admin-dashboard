const CHART_GRID_COLUMNS = 20;

export function getVerticalGridCoordinates({ offset }: { offset: { left: number; width: number } }) {
  return Array.from(
    { length: CHART_GRID_COLUMNS + 1 },
    (_, index) => offset.left + (offset.width * index) / CHART_GRID_COLUMNS,
  );
}

export function getInnerVerticalGridCoordinates({ offset }: { offset: { left: number; width: number } }) {
  return Array.from(
    { length: CHART_GRID_COLUMNS - 1 },
    (_, index) => offset.left + (offset.width * (index + 1)) / CHART_GRID_COLUMNS,
  );
}
