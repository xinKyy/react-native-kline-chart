import { useMemo } from 'react';
import { Canvas, Picture, Skia, matchFont, ClipOp } from '@shopify/react-native-skia';
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
  LAST_PRICE_COLOR,
  MA_COLORS,
  MA_PERIODS,
  X_AXIS_HEIGHT,
  PRICE_PADDING_RATIO,
  WICK_WIDTH,
  GRID_ROWS,
  X_AXIS_LABEL_INTERVAL,
  RIGHT_PADDING_CANDLES,
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
  rightPaddingCandles = RIGHT_PADDING_CANDLES,
  onCrosshairChange,
}: KlineChartProps) {
  const chartWidth = width;
  const chartHeight = height - X_AXIS_HEIGHT;

  const scrollOffset = useSharedValue(
    Math.max(0, data.length - Math.floor(chartWidth / (initialCandleWidth + candleSpacing)) + rightPaddingCandles),
  );
  const candleWidthSV = useSharedValue(initialCandleWidth);
  const crosshairX = useSharedValue(0);
  const crosshairVisible = useSharedValue(false);

  const { dataShared, maShared } = useChartData(data, maPeriods);

  const font = useMemo(() => matchFont({ fontSize: 10 }), []);
  const fontSmall = useMemo(() => matchFont({ fontSize: 9 }), []);
  const fontPanel = useMemo(() => matchFont({ fontSize: 11 }), []);

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
    gPaint.setPathEffect(Skia.PathEffect.MakeDash([3, 3], 0));

    const tPaint = Skia.Paint();
    tPaint.setColor(Skia.Color(textColor));

    const lastPricePaint = Skia.Paint();
    lastPricePaint.setColor(Skia.Color(LAST_PRICE_COLOR));
    lastPricePaint.setStrokeWidth(0.5);
    lastPricePaint.setPathEffect(Skia.PathEffect.MakeDash([4, 3], 0));

    const lastPriceBgPaint = Skia.Paint();
    lastPriceBgPaint.setColor(Skia.Color('rgba(255, 255, 255, 0.08)'));

    const lastPriceTextPaint = Skia.Paint();
    lastPriceTextPaint.setColor(Skia.Color('rgba(255, 255, 255, 0.6)'));

    const chPaint = Skia.Paint();
    chPaint.setColor(Skia.Color(crosshairColor));
    chPaint.setStrokeWidth(0.5);
    chPaint.setPathEffect(Skia.PathEffect.MakeDash([4, 4], 0));

    const chBgPaint = Skia.Paint();
    chBgPaint.setColor(Skia.Color('rgba(24, 28, 33, 0.92)'));

    const chLabelPaint = Skia.Paint();
    chLabelPaint.setColor(Skia.Color('#FFFFFF'));

    const panelBgPaint = Skia.Paint();
    panelBgPaint.setColor(Skia.Color('rgba(24, 28, 33, 0.92)'));

    const panelBorderPaint = Skia.Paint();
    panelBorderPaint.setColor(Skia.Color('rgba(255, 255, 255, 0.08)'));
    panelBorderPaint.setStyle(1);
    panelBorderPaint.setStrokeWidth(0.5);

    const panelLabelPaint = Skia.Paint();
    panelLabelPaint.setColor(Skia.Color('rgba(255, 255, 255, 0.45)'));

    const panelValuePaint = Skia.Paint();
    panelValuePaint.setColor(Skia.Color('#FFFFFF'));

    const panelGreenPaint = Skia.Paint();
    panelGreenPaint.setColor(Skia.Color(bullishColor));

    const panelRedPaint = Skia.Paint();
    panelRedPaint.setColor(Skia.Color(bearishColor));

    const highLowLinePaint = Skia.Paint();
    highLowLinePaint.setColor(Skia.Color('rgba(255, 255, 255, 0.35)'));
    highLowLinePaint.setStrokeWidth(0.5);

    const highLowTextPaint = Skia.Paint();
    highLowTextPaint.setColor(Skia.Color('rgba(255, 255, 255, 0.55)'));

    const maPaints = maColors.map((color) => {
      const p = Skia.Paint();
      p.setColor(Skia.Color(color));
      p.setStyle(1);
      p.setStrokeWidth(1);
      p.setAntiAlias(true);
      return p;
    });

    return {
      bullPaint, bearPaint,
      wickBullPaint, wickBearPaint,
      bgPaint,
      gridPaint: gPaint,
      textPaint: tPaint,
      lastPricePaint, lastPriceBgPaint, lastPriceTextPaint,
      crosshairPaint: chPaint,
      crosshairBgPaint: chBgPaint,
      crosshairLabelPaint: chLabelPaint,
      panelBgPaint, panelBorderPaint, panelLabelPaint, panelValuePaint,
      panelGreenPaint, panelRedPaint,
      highLowLinePaint, highLowTextPaint,
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
    rightPaddingCandles,
    onCrosshairChange,
  });

  const recorder = Skia.PictureRecorder();

  const picture = useDerivedValue(() => {
    'worklet';
    const canvas = recorder.beginRecording(Skia.XYWHRect(0, 0, width, height));

    const p2y = (price: number, h: number, minP: number, range: number) => {
      if (range === 0) return h / 2;
      return h - ((price - minP) / range) * h;
    };

    const fmtPrice = (p: number) => {
      const abs = Math.abs(p);
      let s: string;
      if (abs >= 1000) s = p.toFixed(1);
      else if (abs >= 1) s = p.toFixed(2);
      else s = p.toFixed(4);
      const parts = s.split('.');
      const intPart = parts[0]!;
      const decPart = parts[1] ?? '';
      let formatted = '';
      const digits = intPart.replace('-', '');
      for (let i = 0; i < digits.length; i++) {
        if (i > 0 && (digits.length - i) % 3 === 0) formatted += ',';
        formatted += digits[i];
      }
      if (p < 0) formatted = '-' + formatted;
      return decPart ? formatted + '.' + decPart : formatted;
    };

    canvas.drawRect({ x: 0, y: 0, width, height }, paints.bgPaint);

    const allData = dataShared.value;
    const cw = candleWidthSV.value;
    const step = cw + candleSpacing;
    const visibleCount = Math.floor(chartWidth / step);
    const maxOff = Math.max(0, allData.length - visibleCount + rightPaddingCandles);
    const offset = clamp(scrollOffset.value, 0, maxOff);
    const startIdx = Math.floor(offset);
    const endIdx = Math.min(startIdx + visibleCount + 2, allData.length);
    const visibleData = allData.slice(startIdx, endIdx);

    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let highIdx = 0;
    let lowIdx = 0;
    for (let i = 0; i < visibleData.length; i++) {
      const c = visibleData[i]!;
      if (c.high > maxPrice) { maxPrice = c.high; highIdx = i; }
      if (c.low < minPrice) { minPrice = c.low; lowIdx = i; }
    }
    if (minPrice === Infinity) { minPrice = 0; maxPrice = 100; }
    const pricePad = (maxPrice - minPrice) * PRICE_PADDING_RATIO;
    const rawMin = minPrice;
    const rawMax = maxPrice;
    minPrice -= pricePad;
    maxPrice += pricePad;
    const priceRange = maxPrice - minPrice;

    // ========== Grid (horizontal dashed) ==========
    const gridRows = GRID_ROWS;
    for (let i = 1; i < gridRows; i++) {
      const gy = (chartHeight / gridRows) * i;
      canvas.drawLine(0, gy, chartWidth, gy, paints.gridPaint);
    }

    // ========== Candles ==========
    canvas.save();
    canvas.clipRect(Skia.XYWHRect(0, 0, chartWidth, chartHeight), ClipOp.Intersect, false);

    const halfCandle = cw / 2;
    const halfWick = WICK_WIDTH / 2;

    for (let i = 0; i < visibleData.length; i++) {
      const candle = visibleData[i]!;
      const cx = i * step;
      const centerX = cx + halfCandle;

      const isBull = candle.close >= candle.open;
      const cPaint = isBull ? paints.bullPaint : paints.bearPaint;
      const wPaint = isBull ? paints.wickBullPaint : paints.wickBearPaint;

      const openY = p2y(candle.open, chartHeight, minPrice, priceRange);
      const closeY = p2y(candle.close, chartHeight, minPrice, priceRange);
      const highY = p2y(candle.high, chartHeight, minPrice, priceRange);
      const lowY = p2y(candle.low, chartHeight, minPrice, priceRange);

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

    // ========== High / Low markers ==========
    if (visibleData.length > 0) {
      const highCx = highIdx * step + halfCandle;
      const highY = p2y(rawMax, chartHeight, minPrice, priceRange);
      const highLabel = fmtPrice(rawMax);
      const htw = fontSmall.measureText(highLabel).width;
      const drawRight = highCx < chartWidth / 2;
      if (drawRight) {
        canvas.drawLine(highCx, highY, highCx + 30, highY, paints.highLowLinePaint);
        canvas.drawText(highLabel, highCx + 33, highY + 3, paints.highLowTextPaint, fontSmall);
      } else {
        canvas.drawLine(highCx - 30, highY, highCx, highY, paints.highLowLinePaint);
        canvas.drawText(highLabel, highCx - 33 - htw, highY + 3, paints.highLowTextPaint, fontSmall);
      }

      const lowCx = lowIdx * step + halfCandle;
      const lowY = p2y(rawMin, chartHeight, minPrice, priceRange);
      const lowLabel = fmtPrice(rawMin);
      const ltw = fontSmall.measureText(lowLabel).width;
      const drawRightLow = lowCx < chartWidth / 2;
      if (drawRightLow) {
        canvas.drawLine(lowCx, lowY, lowCx + 30, lowY, paints.highLowLinePaint);
        canvas.drawText(lowLabel, lowCx + 33, lowY + 3, paints.highLowTextPaint, fontSmall);
      } else {
        canvas.drawLine(lowCx - 30, lowY, lowCx, lowY, paints.highLowLinePaint);
        canvas.drawText(lowLabel, lowCx - 33 - ltw, lowY + 3, paints.highLowTextPaint, fontSmall);
      }
    }

    // ========== MA lines ==========
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
          if (val === null || val === undefined) { started = false; continue; }
          const lx = (i - startIdx) * step + halfCandle;
          const ly = p2y(val, chartHeight, minPrice, priceRange);
          if (!started) { path.moveTo(lx, ly); started = true; }
          else { path.lineTo(lx, ly); }
        }
        canvas.drawPath(path, maPaint);
      }
    }

    // ========== Last price indicator ==========
    if (allData.length > 0) {
      const lastCandle = allData[allData.length - 1]!;
      const lastY = p2y(lastCandle.close, chartHeight, minPrice, priceRange);
      if (lastY >= 0 && lastY <= chartHeight) {
        canvas.drawLine(0, lastY, chartWidth, lastY, paints.lastPricePaint);
        const lbl = fmtPrice(lastCandle.close);
        const lblW = font.measureText(lbl).width;
        const lblPad = 6;
        const lblH = 16;
        canvas.drawRect(
          { x: chartWidth - lblW - lblPad * 2, y: lastY - lblH / 2, width: lblW + lblPad * 2, height: lblH },
          paints.lastPriceBgPaint,
        );
        canvas.drawText(lbl, chartWidth - lblW - lblPad, lastY + 4, paints.lastPriceTextPaint, font);
      }
    }

    canvas.restore();

    // ========== Y-axis labels (floating over chart, right-aligned) ==========
    for (let i = 0; i <= gridRows; i++) {
      const gy = (chartHeight / gridRows) * i;
      const gp = maxPrice - ((maxPrice - minPrice) / gridRows) * i;
      const label = fmtPrice(gp);
      const tw = font.measureText(label).width;
      const textY = i === 0 ? gy + 12 : (i === gridRows ? gy - 2 : gy + 4);
      canvas.drawText(label, chartWidth - tw - 4, textY, paints.textPaint, font);
    }

    // ========== X-axis time labels ==========
    const interval = X_AXIS_LABEL_INTERVAL;
    for (let i = 0; i < visibleData.length; i += interval) {
      const dataIndex = startIdx + i;
      if (dataIndex >= allData.length) break;
      const candle = allData[dataIndex]!;
      const lx = i * step + cw / 2;
      const d = new Date(candle.time);
      const mm = (d.getMonth() + 1).toString().padStart(2, '0');
      const dd = d.getDate().toString().padStart(2, '0');
      const hh = d.getHours().toString().padStart(2, '0');
      const mi = d.getMinutes().toString().padStart(2, '0');
      const timeStr = `${mm}/${dd} ${hh}:${mi}`;
      const tw = font.measureText(timeStr).width;
      const labelX = Math.max(0, Math.min(lx - tw / 2, chartWidth - tw));
      canvas.drawText(timeStr, labelX, chartHeight + 18, paints.textPaint, font);
    }

    // ========== Crosshair + Info Panel ==========
    if (crosshairVisible.value && showCrosshair) {
      const chx = crosshairX.value;
      const candleIdx = Math.round(chx / step);
      const dataIdx = startIdx + candleIdx;
      if (dataIdx >= 0 && dataIdx < allData.length) {
        const candle = allData[dataIdx]!;
        const snapX = candleIdx * step + cw / 2;
        const closeY = p2y(candle.close, chartHeight, minPrice, priceRange);

        // Crosshair lines
        canvas.drawLine(snapX, 0, snapX, chartHeight, paints.crosshairPaint);
        canvas.drawLine(0, closeY, chartWidth, closeY, paints.crosshairPaint);

        // Price label on right
        const priceText = fmtPrice(candle.close);
        const ptw = font.measureText(priceText).width;
        const plPad = 6;
        const plH = 16;
        canvas.drawRect(
          { x: chartWidth - ptw - plPad * 2, y: closeY - plH / 2, width: ptw + plPad * 2, height: plH },
          paints.crosshairBgPaint,
        );
        canvas.drawText(priceText, chartWidth - ptw - plPad, closeY + 4, paints.crosshairLabelPaint, font);

        // Time label on X-axis
        const td = new Date(candle.time);
        const tyyyy = td.getFullYear();
        const tmm = (td.getMonth() + 1).toString().padStart(2, '0');
        const tdd = td.getDate().toString().padStart(2, '0');
        const thh = td.getHours().toString().padStart(2, '0');
        const tmi = td.getMinutes().toString().padStart(2, '0');
        const timeStr = `${tyyyy}/${tmm}/${tdd} ${thh}:${tmi}`;
        const ttw = font.measureText(timeStr).width;
        const tlx = Math.max(0, Math.min(snapX - ttw / 2, chartWidth - ttw - 4));
        const tlPad = 5;
        canvas.drawRect(
          { x: tlx - tlPad, y: chartHeight + 3, width: ttw + tlPad * 2, height: X_AXIS_HEIGHT - 6 },
          paints.crosshairBgPaint,
        );
        canvas.drawText(timeStr, tlx, chartHeight + 17, paints.crosshairLabelPaint, font);

        // ========== OKX-style Info Panel ==========
        const change = candle.close - candle.open;
        const changePct = candle.open !== 0 ? (change / candle.open) * 100 : 0;
        const amplitude = candle.open !== 0 ? ((candle.high - candle.low) / candle.open) * 100 : 0;

        const labels = [
          'Time',        // Time
          'Open',        // Open
          'High',        // High
          'Low',         // Low
          'Close',       // Close
          'Change',      // Change
          '% Change',    // Change
          'Amplitude',   // Amplitude
        ];

        const timeVal = `${tmm}/${tdd} ${thh}:${tmi}`;
        const values = [
          timeVal,
          fmtPrice(candle.open),
          fmtPrice(candle.high),
          fmtPrice(candle.low),
          fmtPrice(candle.close),
          fmtPrice(change),
          (changePct >= 0 ? '+' : '') + changePct.toFixed(2) + '%',
          amplitude.toFixed(2) + '%',
        ];

        const rowH = 20;
        const panelPadX = 12;
        const panelPadY = 8;
        const panelH = labels.length * rowH + panelPadY * 2;

        const labelColW = 56;
        const valMeasures = values.map(v => fontPanel.measureText(v).width);
        let maxValW = 0;
        for (let vi = 0; vi < valMeasures.length; vi++) {
          if (valMeasures[vi]! > maxValW) maxValW = valMeasures[vi]!;
        }
        const panelW = labelColW + maxValW + panelPadX * 2 + 12;

        const panelOnRight = snapX < chartWidth / 2;
        const panelX = panelOnRight
          ? Math.min(snapX + 20, chartWidth - panelW - 4)
          : Math.max(snapX - panelW - 20, 4);
        const panelY = Math.max(4, Math.min(closeY - panelH / 2, chartHeight - panelH - 4));

        // Panel background
        canvas.drawRect(
          { x: panelX, y: panelY, width: panelW, height: panelH },
          paints.panelBgPaint,
        );
        // Panel border
        canvas.drawRect(
          { x: panelX, y: panelY, width: panelW, height: panelH },
          paints.panelBorderPaint,
        );

        for (let r = 0; r < labels.length; r++) {
          const ry = panelY + panelPadY + r * rowH + 14;

          canvas.drawText(labels[r]!, panelX + panelPadX, ry, paints.panelLabelPaint, fontPanel);

          let valuePaint = paints.panelValuePaint;
          if (r === 5 || r === 6) {
            valuePaint = change >= 0 ? paints.panelGreenPaint : paints.panelRedPaint;
          }

          const valText = values[r]!;
          const valW = fontPanel.measureText(valText).width;
          canvas.drawText(valText, panelX + panelW - panelPadX - valW, ry, valuePaint, fontPanel);
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
