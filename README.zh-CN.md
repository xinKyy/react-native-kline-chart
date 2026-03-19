# react-native-kline-chart

[English](./README.md)

高性能 React Native K线（蜡烛图）组件，基于 [@shopify/react-native-skia](https://github.com/Shopify/react-native-skia) 构建。

所有渲染均通过 Skia `PictureRecorder` 在 UI 线程完成——每根蜡烛零 React 组件开销，即使处理 10,000+ 数据点也能保持流畅的 60fps 手势交互。

## 截图

<p align="center">
  <img src="./assets/screenshot-chart.png" width="280" alt="K线图表" />
  &nbsp;&nbsp;
  <img src="./assets/screenshot-crosshair.png" width="280" alt="十字光标与信息面板" />
</p>

## 特性

- **Skia Canvas 渲染** — 通过 `PictureRecorder` 即时模式绘制，无 React 协调开销
- **UI 线程手势** — 平移、双指缩放、长按十字光标，全部以 Reanimated worklet 运行
- **视口裁剪** — 仅绘制可见蜡烛；轻松处理 10,000+ 数据点
- **MA 均线指标** — 内置移动平均线，周期和颜色可配置（默认 MA5 / MA10）
- **十字光标 + 信息面板** — 长按显示十字光标，展示 OHLC、涨跌额、涨跌幅、振幅
- **最新价格线** — 虚线水平线标示最新收盘价
- **最高/最低价标注** — 可见区域内的最高价和最低价直接标注在图表上
- **价格格式化** — 千位分隔符，自适应小数位数
- **X / Y 轴标签** — X 轴时间标签，Y 轴价格标签
- **虚线网格** — 可配置网格行数和列间隔
- **右侧留白** — 最后一根蜡烛后的额外空间，提升可读性
- **高度可定制** — 颜色、尺寸、间距、指标周期等均可自定义

## 安装

```bash
npm install react-native-kline-chart
# 或
yarn add react-native-kline-chart
```

### 对等依赖

确保你的应用中已安装以下依赖：

```bash
npm install @shopify/react-native-skia react-native-reanimated react-native-gesture-handler
```

在 `babel.config.js` 中添加 Reanimated Babel 插件：

```js
module.exports = {
  plugins: ['react-native-reanimated/plugin'],
};
```

## 快速开始

```tsx
import { KlineChart } from 'react-native-kline-chart';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
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
      />
    </GestureHandlerRootView>
  );
}
```

## API

### `<KlineChart />`

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | `Candle[]` | **必填** | 蜡烛数据数组 |
| `width` | `number` | **必填** | 画布宽度（像素） |
| `height` | `number` | **必填** | 画布高度（像素） |
| `candleWidth` | `number` | `8` | 每根蜡烛的实体宽度 |
| `candleSpacing` | `number` | `3` | 蜡烛之间的间距 |
| `minCandleWidth` | `number` | `2` | 缩小时的最小蜡烛宽度 |
| `maxCandleWidth` | `number` | `24` | 放大时的最大蜡烛宽度 |
| `bullishColor` | `string` | `'#2DC08E'` | 阳线颜色（收盘 >= 开盘） |
| `bearishColor` | `string` | `'#F6465D'` | 阴线颜色 |
| `showMA` | `boolean` | `true` | 是否显示均线 |
| `maPeriods` | `number[]` | `[5, 10]` | 均线计算周期 |
| `maColors` | `string[]` | `['#F7931A', '#5B8DEF', '#C084FC']` | 各均线颜色 |
| `showCrosshair` | `boolean` | `true` | 是否启用长按十字光标和信息面板 |
| `backgroundColor` | `string` | `'#0B0E11'` | 图表背景色 |
| `gridColor` | `string` | `'rgba(255,255,255,0.2)'` | 网格线颜色 |
| `textColor` | `string` | `'rgba(255,255,255,0.35)'` | 坐标轴标签颜色 |
| `crosshairColor` | `string` | `'rgba(255,255,255,0.3)'` | 十字光标线颜色 |
| `rightPaddingCandles` | `number` | `20` | 右侧留白的蜡烛数量 |
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

### 导出内容

```typescript
import { KlineChart, computeMA } from 'react-native-kline-chart';
import type { Candle, KlineChartProps } from 'react-native-kline-chart';
```

## 架构

### 渲染：即时模式 (Picture API)

使用 `Skia.PictureRecorder` 在 `useDerivedValue` worklet 中批量执行所有绘制命令，运行在 UI 线程。这避免了为每根蜡烛创建 React 组件，消除了手势交互期间的协调开销。

### 手势

- **平移** — 通过更新 `scrollOffset` 共享值滚动历史数据
- **双指缩放** — 通过改变 `candleWidth` 共享值进行缩放
- **长按** — 激活十字光标和信息面板

所有手势回调均以 Reanimated worklet 形式运行在 UI 线程。

### 性能

- 仅绘制可见蜡烛（视口裁剪）
- MA 值通过 `useMemo` 在 JS 线程预计算
- 所有动画/手势状态使用 Reanimated `SharedValue`（无 React 重渲染）
- Paint 对象复用于所有阳线/阴线
- 千位分隔符格式化在 worklet 内运行

## 运行示例

```bash
cd example
npm install
cd ios && pod install && cd ..
npx react-native run-ios
```

## 许可证

MIT
