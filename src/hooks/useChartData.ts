import { useMemo, useEffect } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import type { Candle } from '../types';
import { computeMA } from '../utils/indicators';

/**
 * Flat data layout per candle (stride = 5):
 *   [time, open, high, low, close, time, open, high, low, close, ...]
 *
 * MA arrays use NaN instead of null for missing values.
 *
 * A monotonically increasing `version` shared value is bumped on every data
 * change so that `useDerivedValue` worklets that read it are guaranteed to
 * re-execute even when Reanimated's internal shallow-compare on large arrays
 * fails to detect the mutation.
 */
export function useChartData(data: Candle[], maPeriods: number[]) {
  const flatData = useMemo(() => {
    const len = data.length;
    const arr = new Array<number>(len * 5);
    for (let i = 0; i < len; i++) {
      const b = i * 5;
      const c = data[i]!;
      arr[b] = c.time;
      arr[b + 1] = c.open;
      arr[b + 2] = c.high;
      arr[b + 3] = c.low;
      arr[b + 4] = c.close;
    }
    return arr;
  }, [data]);

  const flatMA = useMemo(() => {
    return maPeriods.map(period => {
      const raw = computeMA(data, period);
      return raw.map(v => v ?? NaN);
    });
  }, [data, maPeriods]);

  const dataShared = useSharedValue<number[]>(flatData);
  const maShared = useSharedValue<number[][]>(flatMA);
  const version = useSharedValue(0);

  useEffect(() => {
    dataShared.value = flatData;
    maShared.value = flatMA;
    version.value = version.value + 1;
  }, [flatData, flatMA, dataShared, maShared, version]);

  return { dataShared, maShared, version };
}
