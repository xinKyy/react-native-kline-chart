<div align="center">

# 🕯️ React Native KLine Chart

### The KLine chart React Native deserves.

**60 fps · Skia-powered · 10K+ candles · Zero jank**

[![npm version](https://img.shields.io/npm/v/react-native-kline-chart?style=flat-square&color=2DC08E)](https://www.npmjs.com/package/react-native-kline-chart)
[![license](https://img.shields.io/npm/l/react-native-kline-chart?style=flat-square&color=blue)](./LICENSE)
[![platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey?style=flat-square)](https://github.com/xinKyy/react-native-kline-chart)

[📖 Documentation](https://react-native-kline-chart.vercel.app/) · [🎮 Live Demo](https://react-native-kline-chart.vercel.app/) · [🐛 Report Bug](https://github.com/xinKyy/react-native-kline-chart/issues) · [💬 Discussions](https://github.com/xinKyy/react-native-kline-chart/issues)

**[🇨🇳 中文文档](./README.zh-CN.md)**

<br/>

<p>
  <img src="https://react-native-kline-chart.vercel.app/screenshots/screenshot1.png" width="280" alt="K-line chart" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://react-native-kline-chart.vercel.app/screenshots/screenshot2.png" width="280" alt="Crosshair with info panel" />
</p>

</div>

---

## Why This Exists

Every React Native trading app needs a candlestick chart. Every existing solution either wraps a WebView (laggy), bridges a native chart library (heavy), or builds on `react-native-svg` (slow at scale).

**react-native-kline-chart** takes a different approach: it draws directly on a Skia canvas using `PictureRecorder`, bypasses React reconciliation entirely, and runs all gestures as Reanimated worklets on the UI thread.

The result? **Butter-smooth 60 fps** with 10,000+ candles. No bridge. No WebView. No compromises.

---

## Highlights

| | Feature | Details |
|---|---|---|
| ⚡ | **Skia Rendering** | Immediate-mode drawing via `PictureRecorder` — zero React component overhead per candle |
| 🤌 | **Native Gestures** | Pan, pinch-to-zoom, long-press crosshair — all Reanimated worklets on the UI thread |
| 📊 | **10K+ Candles** | Viewport clipping ensures only visible candles are drawn — zero jank at scale |
| 📈 | **MA Indicators** | Built-in moving average lines with configurable periods and colors (MA5, MA10, MA20…) |
| 🎯 | **Crosshair + Info Panel** | Long-press to reveal precision crosshair with OHLC, change %, and amplitude |
| 💹 | **Last Price Line** | Dashed line showing the latest close price in real-time |
| 🏷️ | **High / Low Markers** | Visible extremes annotated directly on the chart |
| 🎨 | **Fully Customizable** | Colors, sizes, spacing, indicators — dark theme ready out of the box |

---

## Quick Start

### Install

```bash
npm install react-native-kline-chart
```

### Peer Dependencies

```bash
npm install @shopify/react-native-skia react-native-reanimated react-native-gesture-handler
```

Add the Reanimated Babel plugin:

```js
// babel.config.js
module.exports = {
  plugins: ['react-native-reanimated/plugin'],
};
```

### Usage

```tsx
import { KlineChart } from 'react-native-kline-chart';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const data = [
    { time: 1700000000000, open: 100, high: 105, low: 98, close: 103 },
    { time: 1700000060000, open: 103, high: 107, low: 101, close: 99 },
    // ...more candles
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KlineChart
        data={data}
        width={400}
        height={600}
        showMA
        showCrosshair
      />
    </GestureHandlerRootView>
  );
}
```

That's it. Three imports, one component, **production-ready charts**.

---

## API Reference

### `<KlineChart />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Candle[]` | **required** | Array of candle data |
| `width` | `number` | **required** | Canvas width in pixels |
| `height` | `number` | **required** | Canvas height in pixels |
| `candleWidth` | `number` | `8` | Width of each candle body |
| `candleSpacing` | `number` | `3` | Gap between candles |
| `minCandleWidth` | `number` | `2` | Min candle width when zooming out |
| `maxCandleWidth` | `number` | `24` | Max candle width when zooming in |
| `bullishColor` | `string` | `'#2DC08E'` | Bullish (close ≥ open) candle color |
| `bearishColor` | `string` | `'#F6465D'` | Bearish candle color |
| `showMA` | `boolean` | `true` | Show moving average lines |
| `maPeriods` | `number[]` | `[5, 10]` | MA periods |
| `maColors` | `string[]` | `['#F7931A', '#5B8DEF', '#C084FC']` | MA line colors |
| `showCrosshair` | `boolean` | `true` | Enable long-press crosshair |
| `backgroundColor` | `string` | `'#0B0E11'` | Chart background color |
| `gridColor` | `string` | `'rgba(255,255,255,0.2)'` | Grid line color |
| `textColor` | `string` | `'rgba(255,255,255,0.35)'` | Axis label color |
| `crosshairColor` | `string` | `'rgba(255,255,255,0.3)'` | Crosshair line color |
| `rightPaddingCandles` | `number` | `20` | Right padding (in candle widths) |
| `onCrosshairChange` | `(candle: Candle \| null) => void` | — | Crosshair activation callback |

### `Candle`

```typescript
type Candle = {
  time: number;   // timestamp in milliseconds
  open: number;
  high: number;
  low: number;
  close: number;
};
```

### Exports

```typescript
import { KlineChart, computeMA } from 'react-native-kline-chart';
import type { Candle, KlineChartProps } from 'react-native-kline-chart';
```

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  JS Thread                       │
│  useMemo → pre-compute MA values                │
│  useChartData → flatten candle data to Float64   │
└───────────────────┬─────────────────────────────┘
                    │ SharedValue
┌───────────────────▼─────────────────────────────┐
│                  UI Thread                        │
│  useDerivedValue → PictureRecorder → draw all    │
│  Gesture worklets → pan / pinch / long-press     │
│  Viewport clipping → only visible candles drawn  │
└─────────────────────────────────────────────────┘
```

**Why it's fast:**
- Skia `PictureRecorder` batches all draw calls — no React reconciliation per candle
- All gesture handlers run as Reanimated worklets — never touch the JS thread
- Candle/wick geometry is batched into 4 Skia `Path` objects (bull body, bear body, bull wick, bear wick)
- Paint objects are reused across frames
- Thousand-separator formatting runs inside worklets

---

## Running the Example

```bash
cd example
npm install
cd ios && pod install && cd ..
npx react-native run-ios
```

---

## Contributing

PRs welcome! Please open an issue first to discuss what you'd like to change.

## License

[MIT](./LICENSE) © [xinKyy](https://github.com/xinKyy)

---

<div align="center">

**If this helped you, consider giving it a ⭐**

[Website](https://react-native-kline-chart.vercel.app/) · [npm](https://www.npmjs.com/package/react-native-kline-chart) · [GitHub](https://github.com/xinKyy/react-native-kline-chart)

</div>
