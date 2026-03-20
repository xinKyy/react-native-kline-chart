<div align="center">

# 🕯️ React Native KLine Chart

### React Native 上最该有的 K 线图组件

**60 fps · Skia 驱动 · 万级数据 · 丝滑无卡顿**

[![npm version](https://img.shields.io/npm/v/react-native-kline-chart?style=flat-square&color=2DC08E)](https://www.npmjs.com/package/react-native-kline-chart)
[![license](https://img.shields.io/npm/l/react-native-kline-chart?style=flat-square&color=blue)](./LICENSE)
[![platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey?style=flat-square)](https://github.com/xinKyy/react-native-kline-chart)

[📖 文档](https://react-native-kline-chart.vercel.app/) · [🎮 在线演示](https://react-native-kline-chart.vercel.app/) · [🐛 提交 Bug](https://github.com/xinKyy/react-native-kline-chart/issues) · [💬 讨论](https://github.com/xinKyy/react-native-kline-chart/issues)

**[🇺🇸 English](./README.md)**

<br/>

<p>
  <img src="https://react-native-kline-chart.vercel.app/screenshots/screenshot1.png" width="280" alt="K线图表" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://react-native-kline-chart.vercel.app/screenshots/screenshot2.png" width="280" alt="十字光标与信息面板" />
</p>

</div>

---

## 为什么做这个

每个 React Native 交易 App 都需要一个 K 线图。现有方案要么用 WebView 包一层（卡）、要么桥接原生图表库（重）、要么基于 `react-native-svg`（数据量大了就掉帧）。

**react-native-kline-chart** 走了一条不同的路：直接用 Skia `PictureRecorder` 在画布上绘制，完全绕过 React 协调机制，所有手势以 Reanimated worklet 运行在 UI 线程。

结果？**丝滑 60 fps**，万级蜡烛。无桥接、无 WebView、无妥协。

---

## 核心特性

| | 特性 | 说明 |
|---|---|---|
| ⚡ | **Skia 渲染** | 通过 `PictureRecorder` 即时模式绘制 — 每根蜡烛零 React 组件开销 |
| 🤌 | **原生手势** | 平移、双指缩放、长按十字光标 — 全部 Reanimated worklet，UI 线程运行 |
| 📊 | **万级数据** | 视口裁剪，仅绘制可见蜡烛 — 大数据量无卡顿 |
| 📈 | **MA 均线** | 内置移动平均线，周期、颜色均可配置（MA5, MA10, MA20…） |
| 🎯 | **十字光标 + 信息面板** | 长按显示精准十字光标，包含 OHLC、涨跌幅、振幅 |
| 💹 | **最新价格线** | 虚线实时标示最新收盘价 |
| 🏷️ | **最高/最低价标注** | 可视区域极值直接标注在图表上 |
| 🎨 | **高度可定制** | 颜色、尺寸、间距、指标 — 开箱即用的暗色主题 |

---

## 快速开始

### 安装

```bash
npm install react-native-kline-chart
```

### 对等依赖

```bash
npm install @shopify/react-native-skia react-native-reanimated react-native-gesture-handler
```

添加 Reanimated Babel 插件：

```js
// babel.config.js
module.exports = {
  plugins: ['react-native-reanimated/plugin'],
};
```

### 使用

```tsx
import { KlineChart } from 'react-native-kline-chart';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const data = [
    { time: 1700000000000, open: 100, high: 105, low: 98, close: 103 },
    { time: 1700000060000, open: 103, high: 107, low: 101, close: 99 },
    // ...更多蜡烛数据
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

就这样。三个 import，一个组件，**生产级 K 线图**。

---

## API

### `<KlineChart />`

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | `Candle[]` | **必填** | 蜡烛数据数组 |
| `width` | `number` | **必填** | 画布宽度（像素） |
| `height` | `number` | **必填** | 画布高度（像素） |
| `candleWidth` | `number` | `8` | 蜡烛实体宽度 |
| `candleSpacing` | `number` | `3` | 蜡烛间距 |
| `minCandleWidth` | `number` | `2` | 缩小时最小蜡烛宽度 |
| `maxCandleWidth` | `number` | `24` | 放大时最大蜡烛宽度 |
| `bullishColor` | `string` | `'#2DC08E'` | 阳线颜色（收盘 ≥ 开盘） |
| `bearishColor` | `string` | `'#F6465D'` | 阴线颜色 |
| `showMA` | `boolean` | `true` | 是否显示均线 |
| `maPeriods` | `number[]` | `[5, 10]` | 均线计算周期 |
| `maColors` | `string[]` | `['#F7931A', '#5B8DEF', '#C084FC']` | 各均线颜色 |
| `showCrosshair` | `boolean` | `true` | 是否启用长按十字光标 |
| `backgroundColor` | `string` | `'#0B0E11'` | 图表背景色 |
| `gridColor` | `string` | `'rgba(255,255,255,0.2)'` | 网格线颜色 |
| `textColor` | `string` | `'rgba(255,255,255,0.35)'` | 坐标轴标签颜色 |
| `crosshairColor` | `string` | `'rgba(255,255,255,0.3)'` | 十字光标线颜色 |
| `rightPaddingCandles` | `number` | `20` | 右侧留白（蜡烛数量） |
| `onCrosshairChange` | `(candle: Candle \| null) => void` | — | 十字光标激活/取消时的回调 |

### `Candle` 类型

```typescript
type Candle = {
  time: number;   // 毫秒级时间戳
  open: number;   // 开盘价
  high: number;   // 最高价
  low: number;    // 最低价
  close: number;  // 收盘价
};
```

### 导出

```typescript
import { KlineChart, computeMA } from 'react-native-kline-chart';
import type { Candle, KlineChartProps } from 'react-native-kline-chart';
```

---

## 架构

```
┌─────────────────────────────────────────────────┐
│                  JS 线程                          │
│  useMemo → 预计算 MA 均线值                       │
│  useChartData → 将蜡烛数据扁平化为 Float64        │
└───────────────────┬─────────────────────────────┘
                    │ SharedValue
┌───────────────────▼─────────────────────────────┐
│                  UI 线程                          │
│  useDerivedValue → PictureRecorder → 全量绘制     │
│  手势 worklet → 平移 / 缩放 / 长按               │
│  视口裁剪 → 仅绘制可见蜡烛                        │
└─────────────────────────────────────────────────┘
```

**为什么快：**
- Skia `PictureRecorder` 批量执行所有绘制命令 — 无 React 协调开销
- 所有手势处理器以 Reanimated worklet 运行 — 不触及 JS 线程
- 蜡烛/影线几何体批量合入 4 个 Skia `Path`（阳线体、阴线体、阳线影、阴线影）
- Paint 对象跨帧复用
- 千位分隔符格式化在 worklet 内运行

---

## 运行示例

```bash
cd example
npm install
cd ios && pod install && cd ..
npx react-native run-ios
```

---

## 参与贡献

欢迎 PR！请先开一个 Issue 讨论你想要的更改。

## 许可证

[MIT](./LICENSE) © [xinKyy](https://github.com/xinKyy)

---

<div align="center">

**如果对你有帮助，请给一个 ⭐ 支持一下**

[官网](https://react-native-kline-chart.vercel.app/) · [npm](https://www.npmjs.com/package/react-native-kline-chart) · [GitHub](https://github.com/xinKyy/react-native-kline-chart)

</div>
