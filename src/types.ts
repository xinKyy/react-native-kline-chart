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
  backgroundColor?: string;
  gridColor?: string;
  textColor?: string;
  crosshairColor?: string;
  onCrosshairChange?: (candle: Candle | null) => void;
};
