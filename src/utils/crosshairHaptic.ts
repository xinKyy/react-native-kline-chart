import { Platform } from 'react-native';
import RNHapticFeedback from 'react-native-haptic-feedback';

/** Discrete tick (UISelectionFeedback / equivalent) when crosshair moves to another candle. */
export function triggerCrosshairMoveHaptic(): void {
  if (Platform.OS === 'web') return;

  RNHapticFeedback.trigger('selection', {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  });
}
