import { useMemo } from 'react';
import { Canvas, Picture, Skia, useFont, ClipOp } from '@shopify/react-native-skia';
import { GestureDetector } from 'react-native-gesture-handler';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import type { KlineChartProps } from './types';
import { useChartData } from './hooks/useChartData';
import { useChartGestures } from './hooks/useChartGestures';
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
  GRID_ROWS,
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

  const scrollOffset = useSharedValue(
    Math.max(0, data.length - Math.floor(chartWidth / (initialCandleWidth + candleSpacing))),
  );
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
    'worklet';
    const canvas = recorder.beginRecording(
      Skia.XYWHRect(0, 0, width, height),
    );

    // --- helpers inlined for worklet serialization ---

    const p2y = (price: number, h: number, minP: number, range: number) => {
      if (range === 0) return h / 2;
      return h - ((price - minP) / range) * h;
    };

    // Background
    canvas.drawRect({ x: 0, y: 0, width, height }, paints.bgPaint);

    const allData = dataShared.value;
    const cw = candleWidthSV.value;
    const step = cw + candleSpacing;
    const visibleCount = Math.floor(chartWidth / step);
    const maxOffset = Math.max(0, allData.length - visibleCount);
    const offset = clamp(scrollOffset.value, 0, maxOffset);
    const startIdx = Math.floor(offset);
    const endIdx = Math.min(startIdx + visibleCount + 2, allData.length);

    const visibleData = allData.slice(startIdx, endIdx);

    // Price range
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
    const pad = (maxPrice - minPrice) * PRICE_PADDING_RATIO;
    minPrice -= pad;
    maxPrice += pad;
    const priceRange = maxPrice - minPrice;

    // --- Grid ---
    const totalW = chartWidth + Y_AXIS_WIDTH;
    const gridRows = GRID_ROWS;
    for (let i = 0; i <= gridRows; i++) {
      const gy = (height / gridRows) * i;
      canvas.drawLine(0, gy, totalW, gy, paints.gridPaint);
      if (font) {
        const gp = maxPrice - ((maxPrice - minPrice) / gridRows) * i;
        let label: string;
        if (gp >= 10000) label = gp.toFixed(0);
        else if (gp >= 1000) label = gp.toFixed(1);
        else if (gp >= 1) label = gp.toFixed(2);
        else label = gp.toFixed(4);
        canvas.drawText(label, chartWidth + 4, gy + 4, paints.textPaint, font);
      }
    }

    // --- Candles ---
    canvas.save();
    canvas.clipRect(Skia.XYWHRect(0, 0, chartWidth, height), ClipOp.Intersect, false);

    const halfCandle = cw / 2;
    const halfWick = WICK_WIDTH / 2;

    for (let i = 0; i < visibleData.length; i++) {
      const candle = visibleData[i]!;
      const cx = i * step;
      const centerX = cx + halfCandle;

      const isBull = candle.close >= candle.open;
      const cPaint = isBull ? paints.bullPaint : paints.bearPaint;
      const wPaint = isBull ? paints.wickBullPaint : paints.wickBearPaint;

      const openY = p2y(candle.open, height, minPrice, priceRange);
      const closeY = p2y(candle.close, height, minPrice, priceRange);
      const highY = p2y(candle.high, height, minPrice, priceRange);
      const lowY = p2y(candle.low, height, minPrice, priceRange);

      const bodyTop = Math.min(openY, closeY);
      const bodyH = Math.max(Math.abs(closeY - openY), 1);

      canvas.drawRect(
        { x: centerX - halfWick, y: highY, width: WICK_WIDTH, height: lowY - highY },
        wPaint,
      );
      canvas.drawRect(
        { x: cx, y: bodyTop, width: cw, height: bodyH },
        cPaint,
      );
    }

    // --- MA lines ---
    if (showMA) {
      const allMA = maShared.value;
      for (let m = 0; m < allMA.length; m++) {
        const maData = allMA[m];
        const maPaint = paints.maPaints[m];
        if (!maData || !maPaint) continue;

        const path = Skia.Path.Make();
        let started = false;
        const maEnd = Math.min(startIdx + visibleCount + 2, maData.length);

        for (let i = startIdx; i < maEnd; i++) {
          const val = maData[i];
          if (val === null || val === undefined) {
            started = false;
            continue;
          }
          const lx = (i - startIdx) * step + halfCandle;
          const ly = p2y(val, height, minPrice, priceRange);
          if (!started) {
            path.moveTo(lx, ly);
            started = true;
          } else {
            path.lineTo(lx, ly);
          }
        }
        canvas.drawPath(path, maPaint);
      }
    }

    canvas.restore();

    // --- Crosshair ---
    if (crosshairVisible.value && showCrosshair) {
      const chx = crosshairX.value;
      const candleIdx = Math.round(chx / step);
      const dataIdx = startIdx + candleIdx;
      if (dataIdx >= 0 && dataIdx < allData.length) {
        const candle = allData[dataIdx]!;
        const snapX = candleIdx * step + cw / 2;
        const closeY = p2y(candle.close, height, minPrice, priceRange);

        canvas.drawLine(snapX, 0, snapX, height, paints.crosshairPaint);
        canvas.drawLine(0, closeY, totalW, closeY, paints.crosshairPaint);

        if (font) {
          const priceText = candle.close.toFixed(2);
          const tw = font.measureText(priceText).width;
          const lx = chartWidth + 2;
          const lPad = 4;
          canvas.drawRect(
            { x: lx, y: closeY - 10 - lPad, width: tw + lPad * 2, height: 14 + lPad * 2 },
            paints.crosshairBgPaint,
          );
          canvas.drawText(priceText, lx + lPad, closeY + 2, paints.crosshairLabelPaint, font);

          const info = `O:${candle.open.toFixed(2)}  H:${candle.high.toFixed(2)}  L:${candle.low.toFixed(2)}  C:${candle.close.toFixed(2)}`;
          canvas.drawText(info, 8, 14, paints.crosshairLabelPaint, font);
        }
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
