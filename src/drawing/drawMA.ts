import type { SkCanvas, SkPaint } from '@shopify/react-native-skia';
import { Skia } from '@shopify/react-native-skia';
import { priceToY } from './drawCandles';

export function drawMALine(
  canvas: SkCanvas,
  maValues: (number | null)[],
  startIndex: number,
  visibleCount: number,
  candleWidth: number,
  candleSpacing: number,
  chartHeight: number,
  minPrice: number,
  priceRange: number,
  paint: SkPaint,
) {
  'worklet';

  const step = candleWidth + candleSpacing;
  const halfCandle = candleWidth / 2;
  const path = Skia.Path.Make();
  let started = false;

  const end = Math.min(startIndex + visibleCount + 1, maValues.length);

  for (let i = startIndex; i < end; i++) {
    const val = maValues[i];
    if (val === null || val === undefined) {
      started = false;
      continue;
    }

    const localIdx = i - startIndex;
    const x = localIdx * step + halfCandle;
    const y = priceToY(val, chartHeight, minPrice, priceRange);

    if (!started) {
      path.moveTo(x, y);
      started = true;
    } else {
      path.lineTo(x, y);
    }
  }

  canvas.drawPath(path, paint);
}
