import type { SkCanvas, SkPaint, SkFont } from '@shopify/react-native-skia';
import { GRID_ROWS } from '../utils/constants';

export function drawGrid(
  canvas: SkCanvas,
  chartWidth: number,
  chartHeight: number,
  minPrice: number,
  maxPrice: number,
  gridPaint: SkPaint,
  textPaint: SkPaint,
  font: SkFont | null,
  yAxisWidth: number,
) {
  'worklet';

  const totalWidth = chartWidth + yAxisWidth;

  for (let i = 0; i <= GRID_ROWS; i++) {
    const y = (chartHeight / GRID_ROWS) * i;
    canvas.drawLine(0, y, totalWidth, y, gridPaint);

    if (font) {
      const price = maxPrice - ((maxPrice - minPrice) / GRID_ROWS) * i;
      const label = formatPrice(price);
      canvas.drawText(label, chartWidth + 4, y + 4, textPaint, font);
    }
  }
}

function formatPrice(price: number): string {
  'worklet';
  if (price >= 10000) return price.toFixed(0);
  if (price >= 1000) return price.toFixed(1);
  if (price >= 1) return price.toFixed(2);
  return price.toFixed(4);
}
