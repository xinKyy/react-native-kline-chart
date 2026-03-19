# react-native-kline-chart

High-performance K-line (Candlestick) chart for React Native, powered by [@shopify/react-native-skia](https://github.com/Shopify/react-native-skia).

## Features

- **Skia Canvas rendering** — All drawing via `drawRect` / `drawLine` / `Path`, zero React component overhead per candle
- **UI-thread gestures** — Pan, pinch-zoom, long-press crosshair, all running as Reanimated worklets
- **Viewport clipping** — Only visible candles are drawn; supports 10,000+ data points without jank
- **MA indicators** — Built-in MA5 / MA10 (configurable periods)
- **Crosshair** — Long-press to inspect individual candle OHLC values
- **Fully customizable** — Colors, sizes, spacing, indicator periods

## Installation

```bash
npm install react-native-kline-chart
```

### Peer dependencies

Make sure these are installed in your app:

```bash
npm install @shopify/react-native-skia react-native-reanimated react-native-gesture-handler
```

Add the Reanimated Babel plugin to your `babel.config.js`:

```js
module.exports = {
  plugins: ['react-native-reanimated/plugin'],
};
```

## Quick Start

```tsx
import { KlineChart } from 'react-native-kline-chart';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  const data = [
    { time: 1700000000, open: 100, high: 105, low: 98, close: 103 },
    { time: 1700000060, open: 103, high: 107, low: 101, close: 99 },
    // ...
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KlineChart
        data={data}
        width={400}
        height={300}
      />
    </GestureHandlerRootView>
  );
}
```

## API

### `<KlineChart />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Candle[]` | **required** | Array of candle data |
| `width` | `number` | **required** | Canvas width in pixels |
| `height` | `number` | **required** | Canvas height in pixels |
| `candleWidth` | `number` | `6` | Width of each candle body |
| `candleSpacing` | `number` | `2` | Gap between candles |
| `minCandleWidth` | `number` | `2` | Minimum candle width (pinch limit) |
| `maxCandleWidth` | `number` | `20` | Maximum candle width (pinch limit) |
| `bullishColor` | `string` | `'#26A69A'` | Color for bullish (close >= open) candles |
| `bearishColor` | `string` | `'#EF5350'` | Color for bearish candles |
| `showMA` | `boolean` | `true` | Show moving average lines |
| `maPeriods` | `number[]` | `[5, 10]` | MA calculation periods |
| `maColors` | `string[]` | `['#FFD54F', '#42A5F5']` | Colors for each MA line |
| `showCrosshair` | `boolean` | `true` | Enable long-press crosshair |
| `backgroundColor` | `string` | `'#1B1B1F'` | Chart background color |
| `gridColor` | `string` | `'rgba(255,255,255,0.06)'` | Grid line color |
| `textColor` | `string` | `'rgba(255,255,255,0.5)'` | Y-axis label color |
| `crosshairColor` | `string` | `'rgba(255,255,255,0.4)'` | Crosshair line color |
| `onCrosshairChange` | `(candle: Candle \| null) => void` | — | Callback when crosshair activates/deactivates |

### `Candle` type

```typescript
type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};
```

## Architecture

### Rendering: Immediate Mode (Picture API)

Uses `Skia.PictureRecorder` inside a `useDerivedValue` worklet to batch all drawing commands on the UI thread. This avoids creating React components per candle and eliminates reconciliation overhead during gestures.

### Gestures

- **Pan** — Scroll through historical data by updating `scrollOffset` shared value
- **Pinch** — Zoom in/out by changing `candleWidth` shared value
- **Long-press** — Activate crosshair overlay

All gesture callbacks run as Reanimated worklets on the UI thread.

### Performance

- Only visible candles are drawn (viewport clipping)
- MA values are pre-computed with `useMemo` on the JS thread
- All animation/gesture state uses Reanimated `SharedValue` (no React re-renders)
- Two Paint objects reused for all bullish/bearish candles

## Running the Example

```bash
cd example
npm install
cd ios && pod install && cd ..
npx react-native run-ios
```

## License

MIT
