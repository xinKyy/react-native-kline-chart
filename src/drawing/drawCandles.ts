import type { SkCanvas, SkPaint } from '@shopify/react-native-skia';
import type { Candle } from '../types';
import { WICK_WIDTH } from '../utils/constants';

export function drawCandles(
  canvas: SkCanvas,
  data: Candle[],
  _startIndex: number,
  candleWidth: number,
  candleSpacing: number,
  chartHeight: number,
  minPrice: number,
  priceRange: number,
  bullPaint: SkPaint,
  bearPaint: SkPaint,
  wickBullPaint: SkPaint,
  wickBearPaint: SkPaint,
) {
  'worklet';

  const step = candleWidth + candleSpacing;
  const halfCandle = candleWidth / 2;
  const halfWick = WICK_WIDTH / 2;

  for (let i = 0; i < data.length; i++) {
    const candle = data[i]!;
    const x = i * step;
    const centerX = x + halfCandle;

    const isBull = candle.close >= candle.open;
    const paint = isBull ? bullPaint : bearPaint;
    const wPaint = isBull ? wickBullPaint : wickBearPaint;

    const openY = priceToY(candle.open, chartHeight, minPrice, priceRange);
    const closeY = priceToY(candle.close, chartHeight, minPrice, priceRange);
    const highY = priceToY(candle.high, chartHeight, minPrice, priceRange);
    const lowY = priceToY(candle.low, chartHeight, minPrice, priceRange);

    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.max(Math.abs(closeY - openY), 1);

    // Wick (shadow line)
    canvas.drawRect(
      { x: centerX - halfWick, y: highY, width: WICK_WIDTH, height: lowY - highY },
      wPaint,
    );

    // Candle body
    canvas.drawRect(
      { x, y: bodyTop, width: candleWidth, height: bodyHeight },
      paint,
    );
  }
}

export function priceToY(
  price: number,
  chartHeight: number,
  minPrice: number,
  priceRange: number,
): number {
  'worklet';
  if (priceRange === 0) return chartHeight / 2;
  return chartHeight - ((price - minPrice) / priceRange) * chartHeight;
}
