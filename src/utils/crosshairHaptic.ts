import { Platform } from 'react-native';
import RNHapticFeedback from 'react-native-haptic-feedback';

/**
 * Crosshair snap feedback: iOS uses UISelectionFeedback (`selection`).
 * Android: `selection` is not wired in react-native-haptic-feedback's native map (no-op);
 * use `soft` (short waveform) + relax system gate so it still fires when the ringer is silent.
 */
export function triggerCrosshairMoveHaptic(): void {
  if (Platform.OS === 'web') return;

  if (Platform.OS === 'android') {
    RNHapticFeedback.trigger('soft', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: true,
    });
    return;
  }

  RNHapticFeedback.trigger('selection', {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  });
}
