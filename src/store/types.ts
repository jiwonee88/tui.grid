export type CellValue = number | string | boolean | null | undefined;

export type Range = [number, number];

export type Side = 'L' | 'R';

export interface Row {
  [propName: string]: CellValue;
}

export interface Column {
  readonly name: string;
  readonly title: string;
  readonly minWidth: number;
  baseWidth: number;
  resizable: boolean;
  fixedWidth: boolean;
}

export interface Store {
  readonly data: Row[];
  readonly columns: Column[];
  readonly dimension: Dimension;
  readonly viewport: Viewport;
  readonly columnCoords: ColumnCoords;
}

export interface Dimension {
  width: number;
  autoWidth: boolean;
  rsideWidth: number;
  lsideWidth: number;
  bodyHeight: number;
  autoHeight: boolean;
  minBodyHeight: number;
  fitToParentHeight: boolean;
  rowHeight: number;
  minRowHeight: number;
  autoRowHeight: boolean;
  headerHeight: number;
  summaryPosition: 'top' | 'bottom';
  summaryHeight: number;
  frozenBorderWidth: number;
  scrollbarWidth: number;
  tableBorderWidth: number;
  cellBorderWidth: number;
  scrollX: boolean;
  scrollY: boolean;
  readonly totalRowHeight: number;
  readonly rowOffsets: number[];
  readonly colOffsets: number[];
}

export interface Viewport {
  scrollX: number;
  scrollY: number;
  readonly offsetY: number;
  readonly rowRange: Range;
  readonly colRange: Range;
  readonly colsL: Column[];
  readonly colsR: Column[];
  readonly rowsL: Row[];
  readonly rowsR: Row[];
}

export interface ColumnCoords {
  readonly widths: number[];
  readonly offsets: number[];
}