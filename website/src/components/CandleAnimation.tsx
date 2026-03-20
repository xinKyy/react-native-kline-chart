'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CandleData {
  x: number;
  open: number;
  close: number;
  high: number;
  low: number;
  bullish: boolean;
}

function generateCandles(count: number): CandleData[] {
  const candles: CandleData[] = [];
  let price = 50;
  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.48) * 8;
    const open = price;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 4;
    const low = Math.min(open, close) - Math.random() * 4;
    candles.push({
      x: i,
      open: Math.max(5, Math.min(95, open)),
      close: Math.max(5, Math.min(95, close)),
      high: Math.max(5, Math.min(98, high)),
      low: Math.max(2, Math.min(95, low)),
      bullish: close >= open,
    });
    price = close;
  }
  return candles;
}

export function CandleAnimation() {
  const [candles, setCandles] = useState<CandleData[]>([]);

  useEffect(() => {
    setCandles(generateCandles(40));
  }, []);

  if (candles.length === 0) return null;

  const candleWidth = 8;
  const gap = 4;
  const svgWidth = candles.length * (candleWidth + gap);
  const svgHeight = 200;

  const scaleY = (v: number) => svgHeight - (v / 100) * svgHeight;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-bg-secondary/50 p-6">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-48"
        preserveAspectRatio="none"
      >
        {candles.map((c, i) => {
          const bodyTop = scaleY(Math.max(c.open, c.close));
          const bodyBottom = scaleY(Math.min(c.open, c.close));
          const bodyHeight = Math.max(1, bodyBottom - bodyTop);
          const x = i * (candleWidth + gap);
          const color = c.bullish ? 'var(--color-bullish)' : 'var(--color-bearish)';

          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.4 }}
            >
              <line
                x1={x + candleWidth / 2}
                y1={scaleY(c.high)}
                x2={x + candleWidth / 2}
                y2={scaleY(c.low)}
                stroke={color}
                strokeWidth={1.5}
              />
              <rect
                x={x}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                fill={color}
                rx={1}
              />
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
