import { Gesture } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import { runOnJS } from 'react-native-reanimated';
import type { Candle } from '../types';

type GestureParams = {
  scrollOffset: SharedValue<number>;
  candleWidth: SharedValue<number>;
  crosshairX: SharedValue<number>;
  crosshairVisible: SharedValue<boolean>;
  dataLength: number;
  chartWidth: number;
  candleSpacing: number;
  minCandleWidth: number;
  maxCandleWidth: number;
  rightPaddingCandles: number;
  onCrosshairChange?: (candle: Candle | null) => void;
};

function clamp(val: number, min: number, max: number): number {
  'worklet';
  return Math.min(Math.max(val, min), max);
}

export function useChartGestures(params: GestureParams) {
  const {
    scrollOffset,
    candleWidth,
    crosshairX,
    crosshairVisible,
    dataLength,
    chartWidth,
    candleSpacing,
    minCandleWidth,
    maxCandleWidth,
    rightPaddingCandles,
    onCrosshairChange,
  } = params;

  const crosshairGesture = Gesture.Pan()
    .activateAfterLongPress(300)
    .onStart((e) => {
      'worklet';
      crosshairVisible.value = true;
      crosshairX.value = clamp(e.x, 0, chartWidth);
    })
    .onChange((e) => {
      'worklet';
      crosshairX.value = clamp(e.x, 0, chartWidth);
    })
    .onEnd(() => {
      'worklet';
      crosshairVisible.value = false;
      if (onCrosshairChange) {
        runOnJS(onCrosshairChange)(null);
      }
    });

  const panGesture = Gesture.Pan()
    .onChange((e) => {
      'worklet';
      const step = candleWidth.value + candleSpacing;
      const delta = -e.changeX / step;
      const visibleCount = Math.floor(chartWidth / step);
      const maxOffset = Math.max(0, dataLength - visibleCount + rightPaddingCandles);
      scrollOffset.value = clamp(scrollOffset.value + delta, 0, maxOffset);
    })
    .minDistance(1);

  const pinchGesture = Gesture.Pinch()
    .onChange((e) => {
      'worklet';
      const step = candleWidth.value + candleSpacing;
      const visibleCountBefore = Math.floor(chartWidth / step);
      const centerIndex = scrollOffset.value + visibleCountBefore / 2;

      const newWidth = clamp(
        candleWidth.value * e.scaleChange,
        minCandleWidth,
        maxCandleWidth,
      );
      candleWidth.value = newWidth;

      const newStep = newWidth + candleSpacing;
      const newVisibleCount = Math.floor(chartWidth / newStep);
      const newOffset = centerIndex - newVisibleCount / 2;
      const maxOffset = Math.max(0, dataLength - newVisibleCount + rightPaddingCandles);
      scrollOffset.value = clamp(newOffset, 0, maxOffset);
    });

  const composed = Gesture.Race(
    crosshairGesture,
    Gesture.Simultaneous(panGesture, pinchGesture),
  );

  return composed;
}
