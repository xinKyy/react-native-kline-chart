import { useMemo } from 'react';
import { Canvas, Picture, Skia, useFont, ClipOp } from '@shopify/react-native-skia';
import { GestureDetector } from 'react-native-gesture-handler';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import type { KlineChartProps } from './types';
import { useChartData } from './hooks/useChartData';
import { useChartGestures } from './hooks/useChartGestures';
import { drawCandles } from './drawing/drawCandles';
import { drawGrid } from './drawing/drawGrid';
import { drawMALine } from './drawing/drawMA';
import { drawCrosshair } from './drawing/drawCrosshair';
import {
  DEFAULT_CANDLE_WIDTH,
  DEFAULT_CANDLE_SPACING,
  MIN_CANDLE_WIDTH,
  MAX_CANDLE_WIDTH,
  BULLISH_COLOR,
  BEARISH_COLOR,
  BACKGROUND_COLOR,
  GRID_COLOR,
  TEXT_COLOR,
  CROSSHAIR_COLOR,
  MA_COLORS,
  MA_PERIODS,
  Y_AXIS_WIDTH,
  PRICE_PADDING_RATIO,
  WICK_WIDTH,
} from './utils/constants';

function clamp(val: number, min: number, max: number): number {
  'worklet';
  return Math.min(Math.max(val, min), max);
}

export function KlineChart({
  data,
  width,
  height,
  candleWidth: initialCandleWidth = DEFAULT_CANDLE_WIDTH,
  candleSpacing = DEFAULT_CANDLE_SPACING,
  minCandleWidth = MIN_CANDLE_WIDTH,
  maxCandleWidth = MAX_CANDLE_WIDTH,
  bullishColor = BULLISH_COLOR,
  bearishColor = BEARISH_COLOR,
  showMA = true,
  maPeriods = MA_PERIODS,
  maColors = MA_COLORS,
  showCrosshair = true,
  backgroundColor = BACKGROUND_COLOR,
  gridColor = GRID_COLOR,
  textColor = TEXT_COLOR,
  crosshairColor = CROSSHAIR_COLOR,
  onCrosshairChange,
}: KlineChartProps) {
  const chartWidth = width - Y_AXIS_WIDTH;

  const scrollOffset = useSharedValue(Math.max(0, data.length - Math.floor(chartWidth / (initialCandleWidth + candleSpacing))));
  const candleWidthSV = useSharedValue(initialCandleWidth);
  const crosshairX = useSharedValue(0);
  const crosshairVisible = useSharedValue(false);

  const { dataShared, maShared } = useChartData(data, maPeriods);

  const font = useFont(null, 11);

  const paints = useMemo(() => {
    const bullPaint = Skia.Paint();
    bullPaint.setColor(Skia.Color(bullishColor));

    const bearPaint = Skia.Paint();
    bearPaint.setColor(Skia.Color(bearishColor));

    const wickBullPaint = Skia.Paint();
    wickBullPaint.setColor(Skia.Color(bullishColor));
    wickBullPaint.setStrokeWidth(WICK_WIDTH);

    const wickBearPaint = Skia.Paint();
    wickBearPaint.setColor(Skia.Color(bearishColor));
    wickBearPaint.setStrokeWidth(WICK_WIDTH);

    const bgPaint = Skia.Paint();
    bgPaint.setColor(Skia.Color(backgroundColor));

    const gPaint = Skia.Paint();
    gPaint.setColor(Skia.Color(gridColor));
    gPaint.setStrokeWidth(0.5);

    const tPaint = Skia.Paint();
    tPaint.setColor(Skia.Color(textColor));

    const chPaint = Skia.Paint();
    chPaint.setColor(Skia.Color(crosshairColor));
    chPaint.setStrokeWidth(0.5);
    chPaint.setPathEffect(Skia.PathEffect.MakeDash([4, 4], 0));

    const chBgPaint = Skia.Paint();
    chBgPaint.setColor(Skia.Color('rgba(50, 50, 55, 0.9)'));

    const chLabelPaint = Skia.Paint();
    chLabelPaint.setColor(Skia.Color('#FFFFFF'));

    const maPaints = maColors.map((color) => {
      const p = Skia.Paint();
      p.setColor(Skia.Color(color));
      p.setStyle(1); // Stroke
      p.setStrokeWidth(1);
      p.setAntiAlias(true);
      return p;
    });

    return {
      bullPaint,
      bearPaint,
      wickBullPaint,
      wickBearPaint,
      bgPaint,
      gridPaint: gPaint,
      textPaint: tPaint,
      crosshairPaint: chPaint,
      crosshairBgPaint: chBgPaint,
      crosshairLabelPaint: chLabelPaint,
      maPaints,
    };
  }, [bullishColor, bearishColor, backgroundColor, gridColor, textColor, crosshairColor, maColors]);

  const gesture = useChartGestures({
    scrollOffset,
    candleWidth: candleWidthSV,
    crosshairX,
    crosshairVisible,
    dataLength: data.length,
    chartWidth,
    candleSpacing,
    minCandleWidth,
    maxCandleWidth,
    onCrosshairChange,
  });

  const recorder = Skia.PictureRecorder();

  const picture = useDerivedValue(() => {
    const canvas = recorder.beginRecording(
      Skia.XYWHRect(0, 0, width, height),
    );

    // Background
    canvas.drawRect(
      { x: 0, y: 0, width, height },
      paints.bgPaint,
    );

    const allData = dataShared.value;
    const cw = candleWidthSV.value;
    const step = cw + candleSpacing;
    const visibleCount = Math.floor(chartWidth / step);
    const maxOffset = Math.max(0, allData.length - visibleCount);
    const offset = clamp(scrollOffset.value, 0, maxOffset);
    const startIdx = Math.floor(offset);
    const endIdx = Math.min(startIdx + visibleCount + 2, allData.length);

    const visibleData = allData.slice(startIdx, endIdx);

    // Compute price range for visible data
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    for (let i = 0; i < visibleData.length; i++) {
      const c = visibleData[i]!;
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
    }

    if (minPrice === Infinity) {
      minPrice = 0;
      maxPrice = 100;
    }

    const padding = (maxPrice - minPrice) * PRICE_PADDING_RATIO;
    minPrice -= padding;
    maxPrice += padding;
    const priceRange = maxPrice - minPrice;

    // Grid
    drawGrid(
      canvas,
      chartWidth,
      height,
      minPrice,
      maxPrice,
      paints.gridPaint,
      paints.textPaint,
      font,
      Y_AXIS_WIDTH,
    );

    // Candles
    canvas.save();
    canvas.clipRect(Skia.XYWHRect(0, 0, chartWidth, height), ClipOp.Intersect, false);

    drawCandles(
      canvas,
      visibleData,
      startIdx,
      cw,
      candleSpacing,
      height,
      minPrice,
      priceRange,
      paints.bullPaint,
      paints.bearPaint,
      paints.wickBullPaint,
      paints.wickBearPaint,
    );

    // MA lines
    if (showMA) {
      const allMA = maShared.value;
      for (let m = 0; m < allMA.length; m++) {
        const maData = allMA[m];
        const maPaint = paints.maPaints[m];
        if (maData && maPaint) {
          drawMALine(
            canvas,
            maData,
            startIdx,
            visibleCount + 2,
            cw,
            candleSpacing,
            height,
            minPrice,
            priceRange,
            maPaint,
          );
        }
      }
    }

    canvas.restore();

    // Crosshair
    if (crosshairVisible.value && showCrosshair) {
      const cx = crosshairX.value;
      const candleIdx = Math.round(cx / step);
      const dataIdx = startIdx + candleIdx;
      if (dataIdx >= 0 && dataIdx < allData.length) {
        const candle = allData[dataIdx]!;
        const snapX = candleIdx * step + cw / 2;

        drawCrosshair(
          canvas,
          candle,
          snapX,
          chartWidth,
          height,
          minPrice,
          priceRange,
          paints.crosshairPaint,
          paints.crosshairBgPaint,
          paints.crosshairLabelPaint,
          font,
          Y_AXIS_WIDTH,
        );
      }
    }

    return recorder.finishRecordingAsPicture();
  });

  return (
    <GestureDetector gesture={gesture}>
      <Canvas style={{ width, height }}>
        <Picture picture={picture} />
      </Canvas>
    </GestureDetector>
  );
}
