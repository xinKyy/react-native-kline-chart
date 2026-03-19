import type { SkCanvas, SkPaint, SkFont } from '@shopify/react-native-skia';
import type { Candle } from '../types';
import { priceToY } from './drawCandles';

export function drawCrosshair(
  canvas: SkCanvas,
  candle: Candle,
  x: number,
  chartWidth: number,
  chartHeight: number,
  minPrice: number,
  priceRange: number,
  linePaint: SkPaint,
  bgPaint: SkPaint,
  labelPaint: SkPaint,
  font: SkFont | null,
  yAxisWidth: number,
) {
  'worklet';

  const closeY = priceToY(candle.close, chartHeight, minPrice, priceRange);
  const totalWidth = chartWidth + yAxisWidth;

  // Vertical line
  canvas.drawLine(x, 0, x, chartHeight, linePaint);
  // Horizontal line
  canvas.drawLine(0, closeY, totalWidth, closeY, linePaint);

  if (!font) return;

  // Price label on Y axis
  const priceText = candle.close.toFixed(2);
  const textWidth = font.measureText(priceText).width;
  const labelX = chartWidth + 2;
  const labelY = closeY;
  const padding = 4;

  canvas.drawRect(
    {
      x: labelX,
      y: labelY - 10 - padding,
      width: textWidth + padding * 2,
      height: 14 + padding * 2,
    },
    bgPaint,
  );
  canvas.drawText(priceText, labelX + padding, labelY + 2, labelPaint, font);

  // OHLC info at top
  const infoText = `O:${candle.open.toFixed(2)}  H:${candle.high.toFixed(2)}  L:${candle.low.toFixed(2)}  C:${candle.close.toFixed(2)}`;
  canvas.drawText(infoText, 8, 14, labelPaint, font);
}
