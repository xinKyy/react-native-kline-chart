import { useEffect } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import { cancelAnimation, runOnJS, useSharedValue, withDecay } from 'react-native-reanimated';
import type { Candle } from '../types';
import { triggerCrosshairMoveHaptic } from '../utils/crosshairHaptic';

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
  crosshairHaptics: boolean;
  onCrosshairChange?: (candle: Candle | null) => void;
};

function clamp(val: number, min: number, max: number): number {
  'worklet';
  return Math.min(Math.max(val, min), max);
}

function crosshairDataIndex(
  cx: number,
  so: number,
  cw: number,
  spacing: number,
  chartW: number,
  len: number,
  rightPad: number,
): number {
  'worklet';
  if (len <= 0) return -1;
  const step = cw + spacing;
  const visibleCount = Math.floor(chartW / step);
  const maxOffset = Math.max(0, len - visibleCount + rightPad);
  const offset = clamp(so, 0, maxOffset);
  const startIdx = Math.floor(offset);
  const candleIdx = Math.round(cx / step);
  return clamp(startIdx + candleIdx, 0, len - 1);
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
    crosshairHaptics,
    onCrosshairChange,
  } = params;

  const isDragging = useSharedValue(false);
  const panTouchOriginX = useSharedValue(0);
  const panTouchOriginY = useSharedValue(0);
  const crosshairHapticsSV = useSharedValue(crosshairHaptics);
  const crosshairHapticLastDataIdx = useSharedValue(-1);

  useEffect(() => {
    crosshairHapticsSV.value = crosshairHaptics;
  }, [crosshairHaptics, crosshairHapticsSV]);

  const longPressGesture = Gesture.LongPress()
    .minDuration(300)
    .maxDistance(999999)
    .onStart((e) => {
      'worklet';
      if (isDragging.value) return;
      crosshairVisible.value = true;
      const x = clamp(e.x, 0, chartWidth);
      crosshairX.value = x;
      crosshairHapticLastDataIdx.value = crosshairDataIndex(
        x,
        scrollOffset.value,
        candleWidth.value,
        candleSpacing,
        chartWidth,
        dataLength,
        rightPaddingCandles,
      );
    })
    .onEnd(() => {
      'worklet';
      if (crosshairVisible.value) {
        crosshairVisible.value = false;
        crosshairHapticLastDataIdx.value = -1;
        if (onCrosshairChange) {
          runOnJS(onCrosshairChange)(null);
        }
      }
    });

  const AXIS_LOCK_PX = 10;

  const panGesture = Gesture.Pan()
    .manualActivation(true)
    .onTouchesDown((e) => {
      'worklet';
      const t = e.allTouches[0];
      if (t !== undefined) {
        panTouchOriginX.value = t.x;
        panTouchOriginY.value = t.y;
      }
    })
    .onTouchesMove((e, state) => {
      'worklet';
      if (e.numberOfTouches !== 1) {
        state.fail();
        return;
      }
      const t = e.allTouches[0];
      if (t === undefined) return;
      const dx = t.x - panTouchOriginX.value;
      const dy = t.y - panTouchOriginY.value;
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);
      if (adx < AXIS_LOCK_PX && ady < AXIS_LOCK_PX) {
        return;
      }
      if (adx > ady) {
        state.activate();
      } else {
        state.fail();
      }
    })
    .onStart(() => {
      'worklet';
      cancelAnimation(scrollOffset);
      if (!crosshairVisible.value) {
        isDragging.value = true;
      }
    })
    .onChange((e) => {
      'worklet';
      if (crosshairVisible.value) {
        const x = clamp(e.x, 0, chartWidth);
        crosshairX.value = x;
        if (crosshairHapticsSV.value && dataLength > 0) {
          const idx = crosshairDataIndex(
            x,
            scrollOffset.value,
            candleWidth.value,
            candleSpacing,
            chartWidth,
            dataLength,
            rightPaddingCandles,
          );
          if (idx !== crosshairHapticLastDataIdx.value) {
            crosshairHapticLastDataIdx.value = idx;
            runOnJS(triggerCrosshairMoveHaptic)();
          }
        }
        return;
      }
      const step = candleWidth.value + candleSpacing;
      const delta = -e.changeX / step;
      const visibleCount = Math.floor(chartWidth / step);
      const maxOffset = Math.max(0, dataLength - visibleCount + rightPaddingCandles);
      scrollOffset.value = clamp(scrollOffset.value + delta, 0, maxOffset);
    })
    .onEnd((e) => {
      'worklet';
      if (crosshairVisible.value) {
        crosshairVisible.value = false;
        crosshairHapticLastDataIdx.value = -1;
        if (onCrosshairChange) {
          runOnJS(onCrosshairChange)(null);
        }
        isDragging.value = false;
        return;
      }
      const step = candleWidth.value + candleSpacing;
      const visibleCount = Math.floor(chartWidth / step);
      const maxOffset = Math.max(0, dataLength - visibleCount + rightPaddingCandles);
      const velocity = -e.velocityX / step;
      scrollOffset.value = withDecay(
        { velocity, deceleration: 0.997, clamp: [0, maxOffset] },
        () => { isDragging.value = false; },
      );
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      'worklet';
      cancelAnimation(scrollOffset);
      isDragging.value = true;
    })
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
    })
    .onEnd(() => {
      'worklet';
      isDragging.value = false;
    });

  const composed = Gesture.Simultaneous(
    longPressGesture,
    panGesture,
    pinchGesture,
  );

  return { gesture: composed, isDragging };
}
