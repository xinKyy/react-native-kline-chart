import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KlineChart } from 'react-native-kline-chart';
import type { Candle } from 'react-native-kline-chart';
import { generateMockData } from './src/mockData';

export default function App() {
  const { width } = useWindowDimensions();
  const chartHeight = 400;

  const data = useMemo(() => generateMockData(2000), []);
  const [activeCandle, setActiveCandle] = useState<Candle | null>(null);

  const handleCrosshairChange = useCallback((candle: Candle | null) => {
    setActiveCandle(candle);
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.title}>K-Line Chart</Text>
        <Text style={styles.subtitle}>
          {data.length} candles | Pinch to zoom, Pan to scroll, Long-press for crosshair
        </Text>

        {activeCandle ? (
          <View style={styles.info}>
            <Text style={styles.infoText}>
              O: {activeCandle.open} H: {activeCandle.high} L: {activeCandle.low} C: {activeCandle.close}
            </Text>
          </View>
        ) : null}

        <KlineChart
          data={data}
          width={width}
          height={chartHeight}
          candleWidth={6}
          candleSpacing={2}
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
    backgroundColor: '#1B1B1F',
  },
  container: {
    flex: 1,
    paddingTop: 60,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  info: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  infoText: {
    color: '#FFD54F',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
