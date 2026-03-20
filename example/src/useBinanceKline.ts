import { useState, useEffect, useRef, useCallback } from 'react';
import type { Candle } from 'react-native-kline-chart';

export type TimeInterval =
  | '1s' | '1m' | '3m' | '5m' | '15m' | '30m'
  | '1h' | '2h' | '4h' | '6h' | '8h' | '12h'
  | '1d' | '3d' | '1w' | '1M';

const MAX_CANDLES = 1000;

const REST_BASE = 'https://api.binance.com/api/v3';

function parseKline(raw: any[]): Candle {
  return {
    time: raw[0] as number,
    open: parseFloat(raw[1] as string),
    high: parseFloat(raw[2] as string),
    low: parseFloat(raw[3] as string),
    close: parseFloat(raw[4] as string),
  };
}

export function useBinanceKline(
  symbol: string = 'BTCUSDT',
  interval: TimeInterval = '1d',
  limit: number = 500,
) {
  const [data, setData] = useState<Candle[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [prevClose, setPrevClose] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const url = `${REST_BASE}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
      const res = await fetch(url);
      const json = await res.json();
      const candles: Candle[] = json.map(parseKline);
      setData(candles);
      if (candles.length >= 2) {
        setPrevClose(candles[candles.length - 2]!.close);
        setPrice(candles[candles.length - 1]!.close);
      }
    } catch (e) {
      console.warn('Failed to fetch Binance klines:', e);
    } finally {
      setLoading(false);
    }
  }, [symbol, interval, limit]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    const pair = symbol.toLowerCase();
    const wsUrl = `wss://stream.binance.com:9443/ws/${pair}@kline_${interval}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const k = msg.k;
        if (!k) return;

        const candle: Candle = {
          time: k.t,
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
        };
        setPrice(candle.close);

        setData((prev) => {
          if (prev.length === 0) return prev;
          const last = prev[prev.length - 1]!;
          if (last.time === candle.time) {
            const updated = [...prev];
            updated[updated.length - 1] = candle;
            return updated;
          }
          if (candle.time > last.time) {
            setPrevClose(last.close);
            const next = [...prev, candle];
            return next.length > MAX_CANDLES ? next.slice(next.length - MAX_CANDLES) : next;
          }
          return prev;
        });
      } catch {}
    };

    ws.onerror = () => {};

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [symbol, interval]);

  const change = price - prevClose;
  const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;

  return { data, price, prevClose, change, changePercent, loading };
}
