import type { Candle } from '../types';

export function computeMA(data: Candle[], period: number): (number | null)[] {
  const result: (number | null)[] = new Array(data.length).fill(null);
  if (data.length < period) return result;

  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i]!.close;
  }
  result[period - 1] = sum / period;

  for (let i = period; i < data.length; i++) {
    sum += data[i]!.close - data[i - period]!.close;
    result[i] = sum / period;
  }

  return result;
}
