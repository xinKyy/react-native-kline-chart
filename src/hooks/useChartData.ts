import { useMemo } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import type { Candle } from '../types';
import { computeMA } from '../utils/indicators';

export function useChartData(data: Candle[], maPeriods: number[]) {
  const dataShared = useSharedValue<Candle[]>([]);
  dataShared.value = data;

  const maArrays = useMemo(() => {
    return maPeriods.map((period) => computeMA(data, period));
  }, [data, maPeriods]);

  const maShared = useSharedValue<(number | null)[][]>([]);
  maShared.value = maArrays;

  return { dataShared, maShared };
}
