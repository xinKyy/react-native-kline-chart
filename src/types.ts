export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type KlineChartProps = {
  data: Candle[];
  width: number;
  height: number;
  candleWidth?: number;
  candleSpacing?: number;
  minCandleWidth?: number;
  maxCandleWidth?: number;
  bullishColor?: string;
  bearishColor?: string;
  showMA?: boolean;
  maPeriods?: number[];
  maColors?: string[];
  showCrosshair?: boolean;
  /** Light haptic when the crosshair moves to another candle while dragging. Default `true`. */
  crosshairHaptics?: boolean;
  backgroundColor?: string;
  gridColor?: string;
  textColor?: string;
  crosshairColor?: string;
  rightPaddingCandles?: number;
  onCrosshairChange?: (candle: Candle | null) => void;
};
