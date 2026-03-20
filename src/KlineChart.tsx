import { useMemo, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
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

  const prevDataLenRef = useRef(data.length);
  const { dataShared, dateCompsShared, maShared, version } = useChartData(data, maPeriods);
  const isDraggingRef = useRef<{ value: boolean } | null>(null);

  const fontFamily = Platform.select({ ios: 'Helvetica', default: 'sans-serif' });
  const font = useMemo(() => matchFont({ fontFamily, fontSize: 10 }), [fontFamily]);
  const fontSmall = useMemo(() => matchFont({ fontFamily, fontSize: 9 }), [fontFamily]);
  const fontPanel = useMemo(() => matchFont({ fontFamily, fontSize: 11 }), [fontFamily]);

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
    lastPriceBgPaint.setColor(Skia.Color('rgba(255, 255, 255, 0.2)'));

    const lastPriceTextPaint = Skia.Paint();
    lastPriceTextPaint.setColor(Skia.Color('rgba(255, 255, 255, 0.8)'));

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

  const { gesture, isDragging } = useChartGestures({
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
  isDraggingRef.current = isDragging;

  useEffect(() => {
    const prevLen = prevDataLenRef.current;
    const curLen = data.length;
    prevDataLenRef.current = curLen;

    if (curLen !== prevLen && curLen > 0) {
      if (isDraggingRef.current?.value) return;

      const visibleCount = Math.floor(chartWidth / (candleWidthSV.value + candleSpacing));
      const prevMaxOff = Math.max(0, prevLen - visibleCount + rightPaddingCandles);
      const newMaxOff = Math.max(0, curLen - visibleCount + rightPaddingCandles);

      const wasAtEnd = scrollOffset.value >= prevMaxOff - 1;
      if (wasAtEnd) {
        scrollOffset.value = newMaxOff;
      }
    }
  }, [data.length, chartWidth, candleSpacing, rightPaddingCandles, scrollOffset, candleWidthSV]);

  const recorder = Skia.PictureRecorder();

  const picture = useDerivedValue(() => {
    'worklet';
    void version.value;

    const canvas = recorder.beginRecording(Skia.XYWHRect(0, 0, width, height));

    const D = dataShared.value;
    const DC = dateCompsShared.value;
    const dataLen = (D.length / 5) | 0;

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
      if (abs < 1000) return s;
      const dot = s.indexOf('.');
      const intEnd = dot >= 0 ? dot : s.length;
      const start = s.charCodeAt(0) === 45 ? 1 : 0;
      const intLen = intEnd - start;
      if (intLen <= 3) return s;
      const fg = ((intLen - 1) % 3) + 1;
      let r = s.substring(0, start + fg);
      for (let i = start + fg; i < intEnd; i += 3) {
        r += ',' + s.substring(i, i + 3);
      }
      if (dot >= 0) r += s.substring(dot);
      return r;
    };

    const pad2 = (n: number) => (n < 10 ? '0' + n : '' + n);

    canvas.drawRect(Skia.XYWHRect(0, 0, width, height), paints.bgPaint);

    const cw = candleWidthSV.value;
    const step = cw + candleSpacing;
    const visibleCount = Math.floor(chartWidth / step);
    const maxOff = Math.max(0, dataLen - visibleCount + rightPaddingCandles);
    const offset = clamp(scrollOffset.value, 0, maxOff);
    const startIdx = Math.floor(offset);
    const endIdx = Math.min(startIdx + visibleCount + 2, dataLen);
    const visibleLen = endIdx - startIdx;

    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let highVi = 0;
    let lowVi = 0;
    for (let i = startIdx; i < endIdx; i++) {
      const b = i * 5;
      const h = D[b + 2]!;
      const l = D[b + 3]!;
      if (h > maxPrice) { maxPrice = h; highVi = i - startIdx; }
      if (l < minPrice) { minPrice = l; lowVi = i - startIdx; }
    }
    if (minPrice === Infinity) { minPrice = 0; maxPrice = 100; }
    const pricePad = (maxPrice - minPrice) * PRICE_PADDING_RATIO;
    const rawMin = minPrice;
    const rawMax = maxPrice;
    minPrice -= pricePad;
    maxPrice += pricePad;
    const priceRange = maxPrice - minPrice;

    // ========== Grid ==========
    const gridRows = GRID_ROWS;
    for (let i = 1; i < gridRows; i++) {
      const gy = (chartHeight / gridRows) * i;
      canvas.drawLine(0, gy, chartWidth, gy, paints.gridPaint);
    }
    const gridInterval = X_AXIS_LABEL_INTERVAL;
    for (let i = gridInterval; i < visibleCount + gridInterval; i += gridInterval) {
      const gx = i * step;
      if (gx > 0 && gx < chartWidth) {
        canvas.drawLine(gx, 0, gx, chartHeight, paints.gridPaint);
      }
    }

    // ========== Candles (batched into 4 paths) ==========
    canvas.save();
    canvas.clipRect(Skia.XYWHRect(0, 0, chartWidth, chartHeight), ClipOp.Intersect, false);

    const halfCandle = cw / 2;
    const halfWick = WICK_WIDTH / 2;

    const bullPath = Skia.Path.Make();
    const bearPath = Skia.Path.Make();
    const bullWickPath = Skia.Path.Make();
    const bearWickPath = Skia.Path.Make();

    for (let i = startIdx; i < endIdx; i++) {
      const vi = i - startIdx;
      const b = i * 5;
      const open = D[b + 1]!;
      const high = D[b + 2]!;
      const low = D[b + 3]!;
      const close = D[b + 4]!;

      const cx = vi * step;
      const centerX = cx + halfCandle;

      const openY = p2y(open, chartHeight, minPrice, priceRange);
      const closeY = p2y(close, chartHeight, minPrice, priceRange);
      const highY = p2y(high, chartHeight, minPrice, priceRange);
      const lowY = p2y(low, chartHeight, minPrice, priceRange);

      const bodyTop = Math.min(openY, closeY);
      const bodyH = Math.max(Math.abs(closeY - openY), 1);

      if (close >= open) {
        bullWickPath.addRect(Skia.XYWHRect(centerX - halfWick, highY, WICK_WIDTH, lowY - highY));
        bullPath.addRect(Skia.XYWHRect(cx, bodyTop, cw, bodyH));
      } else {
        bearWickPath.addRect(Skia.XYWHRect(centerX - halfWick, highY, WICK_WIDTH, lowY - highY));
        bearPath.addRect(Skia.XYWHRect(cx, bodyTop, cw, bodyH));
      }
    }

    canvas.drawPath(bullWickPath, paints.wickBullPaint);
    canvas.drawPath(bearWickPath, paints.wickBearPaint);
    canvas.drawPath(bullPath, paints.bullPaint);
    canvas.drawPath(bearPath, paints.bearPaint);

    // ========== High / Low markers ==========
    if (visibleLen > 0) {
      const highCx = highVi * step + halfCandle;
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

      const lowCx = lowVi * step + halfCandle;
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
        const maEnd = Math.min(endIdx, maData.length);
        for (let i = startIdx; i < maEnd; i++) {
          const val = maData[i]!;
          if (val !== val) { started = false; continue; }
          const lx = (i - startIdx) * step + halfCandle;
          const ly = p2y(val, chartHeight, minPrice, priceRange);
          if (!started) { path.moveTo(lx, ly); started = true; }
          else { path.lineTo(lx, ly); }
        }
        canvas.drawPath(path, maPaint);
      }
    }

    // ========== Last price indicator ==========
    if (dataLen > 0) {
      const lastClose = D[(dataLen - 1) * 5 + 4]!;
      const lastY = p2y(lastClose, chartHeight, minPrice, priceRange);
      if (lastY >= 0 && lastY <= chartHeight) {
        canvas.drawLine(0, lastY, chartWidth, lastY, paints.lastPricePaint);
        const lbl = fmtPrice(lastClose);
        const lblW = font.measureText(lbl).width;
        const lblPad = 6;
        const lblH = 16;
        canvas.drawRect(
          Skia.XYWHRect(chartWidth - lblW - lblPad * 2, lastY - lblH / 2, lblW + lblPad * 2, lblH),
          paints.lastPriceBgPaint,
        );
        canvas.drawText(lbl, chartWidth - lblW - lblPad, lastY + 4, paints.lastPriceTextPaint, font);
      }
    }

    canvas.restore();

    // ========== Y-axis labels ==========
    for (let i = 0; i <= gridRows; i++) {
      const gy = (chartHeight / gridRows) * i;
      const gp = maxPrice - ((maxPrice - minPrice) / gridRows) * i;
      const label = fmtPrice(gp);
      const tw = font.measureText(label).width;
      const textY = i === 0 ? gy + 12 : (i === gridRows ? gy - 2 : gy + 4);
      canvas.drawText(label, chartWidth - tw - 4, textY, paints.textPaint, font);
    }

    // ========== X-axis time labels (uses pre-computed date components) ==========
    // When pinch-zooming out, step shrinks; fixed candle interval would pack labels too tight.
    const xLabelW = font.measureText('12/31 23:59').width;
    const xLabelMinSepPx = xLabelW + 8;
    const xAxisInterval = Math.max(
      X_AXIS_LABEL_INTERVAL,
      Math.max(1, Math.ceil(xLabelMinSepPx / step)),
    );
    let prevLabelRight = -1e9;
    const xLabelGap = 6;
    for (let vi = 0; vi < visibleLen; vi += xAxisInterval) {
      const dataIndex = startIdx + vi;
      if (dataIndex >= dataLen) break;
      const lx = vi * step + cw / 2;
      const dcb = dataIndex * 5;
      const mm = pad2(DC[dcb + 1]!);
      const dd = pad2(DC[dcb + 2]!);
      const hh = pad2(DC[dcb + 3]!);
      const mi = pad2(DC[dcb + 4]!);
      const timeStr = mm + '/' + dd + ' ' + hh + ':' + mi;
      const tw = font.measureText(timeStr).width;
      let labelX = lx - tw / 2;
      labelX = Math.max(0, Math.min(labelX, chartWidth - tw));
      if (labelX < prevLabelRight + xLabelGap) {
        continue;
      }
      canvas.drawText(timeStr, labelX, chartHeight + 18, paints.textPaint, font);
      prevLabelRight = labelX + tw;
    }

    // ========== Crosshair + Info Panel ==========
    if (crosshairVisible.value && showCrosshair) {
      const chx = crosshairX.value;
      const candleIdx = Math.round(chx / step);
      const dataIdx = startIdx + candleIdx;
      if (dataIdx >= 0 && dataIdx < dataLen) {
        const cb = dataIdx * 5;
        const cOpen = D[cb + 1]!;
        const cHigh = D[cb + 2]!;
        const cLow = D[cb + 3]!;
        const cClose = D[cb + 4]!;
        const snapX = candleIdx * step + cw / 2;
        const closeY = p2y(cClose, chartHeight, minPrice, priceRange);

        canvas.drawLine(snapX, 0, snapX, chartHeight, paints.crosshairPaint);
        canvas.drawLine(0, closeY, chartWidth, closeY, paints.crosshairPaint);

        const priceText = fmtPrice(cClose);
        const ptw = font.measureText(priceText).width;
        const plPad = 6;
        const plH = 16;
        canvas.drawRect(
          Skia.XYWHRect(chartWidth - ptw - plPad * 2, closeY - plH / 2, ptw + plPad * 2, plH),
          paints.crosshairBgPaint,
        );
        canvas.drawText(priceText, chartWidth - ptw - plPad, closeY + 4, paints.crosshairLabelPaint, font);

        const dcb = dataIdx * 5;
        const tyyyy = DC[dcb]!;
        const tmm = pad2(DC[dcb + 1]!);
        const tdd = pad2(DC[dcb + 2]!);
        const thh = pad2(DC[dcb + 3]!);
        const tmi = pad2(DC[dcb + 4]!);
        const timeStr = tyyyy + '/' + tmm + '/' + tdd + ' ' + thh + ':' + tmi;
        const ttw = font.measureText(timeStr).width;
        const tlx = Math.max(0, Math.min(snapX - ttw / 2, chartWidth - ttw - 4));
        const tlPad = 5;
        canvas.drawRect(
          Skia.XYWHRect(tlx - tlPad, chartHeight + 3, ttw + tlPad * 2, X_AXIS_HEIGHT - 6),
          paints.crosshairBgPaint,
        );
        canvas.drawText(timeStr, tlx, chartHeight + 17, paints.crosshairLabelPaint, font);

        // ========== Info Panel ==========
        const change = cClose - cOpen;
        const changePct = cOpen !== 0 ? (change / cOpen) * 100 : 0;
        const amplitude = cOpen !== 0 ? ((cHigh - cLow) / cOpen) * 100 : 0;

        const labels = ['Time', 'Open', 'High', 'Low', 'Close', 'Change', '% Change', 'Amplitude'];

        const timeVal = tmm + '/' + tdd + ' ' + thh + ':' + tmi;
        const values = [
          timeVal,
          fmtPrice(cOpen),
          fmtPrice(cHigh),
          fmtPrice(cLow),
          fmtPrice(cClose),
          fmtPrice(change),
          (changePct >= 0 ? '+' : '') + changePct.toFixed(2) + '%',
          amplitude.toFixed(2) + '%',
        ];

        const rowH = 20;
        const panelPadX = 12;
        const panelPadY = 8;
        const panelH = labels.length * rowH + panelPadY * 2;

        const labelColW = 56;
        let maxValW = 0;
        for (let vi2 = 0; vi2 < values.length; vi2++) {
          const vw = fontPanel.measureText(values[vi2]!).width;
          if (vw > maxValW) maxValW = vw;
        }
        const panelW = labelColW + maxValW + panelPadX * 2 + 12;

        const panelOnRight = snapX < chartWidth / 2;
        const panelX = panelOnRight
          ? Math.min(snapX + 20, chartWidth - panelW - 4)
          : Math.max(snapX - panelW - 20, 4);
        const panelY = Math.max(4, Math.min(closeY - panelH / 2, chartHeight - panelH - 4));

        canvas.drawRect(
          Skia.XYWHRect(panelX, panelY, panelW, panelH),
          paints.panelBgPaint,
        );
        canvas.drawRect(
          Skia.XYWHRect(panelX, panelY, panelW, panelH),
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
