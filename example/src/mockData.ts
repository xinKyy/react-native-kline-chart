import type { Candle } from 'react-native-kline-chart';

export function generateMockData(count: number): Candle[] {
  const data: Candle[] = [];
  let price = 100 + Math.random() * 50;
  const baseTime = Date.now() - count * 60 * 1000;

  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.48) * 3;
    const open = price;
    const close = open + change;
    const highExtra = Math.random() * 2;
    const lowExtra = Math.random() * 2;
    const high = Math.max(open, close) + highExtra;
    const low = Math.min(open, close) - lowExtra;

    data.push({
      time: baseTime + i * 60 * 1000,
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
    });

    price = close;
  }

  return data;
}
