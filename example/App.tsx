import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KlineChart } from 'react-native-kline-chart';
import type { Candle } from 'react-native-kline-chart';
import { generateMockData } from './src/mockData';

export default function App() {
  const { width } = useWindowDimensions();
  const chartHeight = 450;

  const data = useMemo(() => generateMockData(2000), []);
  const [activeCandle, setActiveCandle] = useState<Candle | null>(null);

  const handleCrosshairChange = useCallback((candle: Candle | null) => {
    setActiveCandle(candle);
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.pair}>BTC/USDT</Text>
          <Text style={styles.subtitle}>
            {data.length} candles
          </Text>
        </View>

        {activeCandle ? (
          <View style={styles.info}>
            <Text style={styles.infoText}>
              O: {activeCandle.open}  H: {activeCandle.high}  L: {activeCandle.low}  C: {activeCandle.close}
            </Text>
          </View>
        ) : null}

        <KlineChart
          data={data}
          width={width}
          height={chartHeight}
          showMA
          maPeriods={[5, 10]}
          showCrosshair
          onCrosshairChange={handleCrosshairChange}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0E11',
  },
  container: {
    flex: 1,
    paddingTop: 56,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  pair: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
  },
  info: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  infoText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
  },
});
