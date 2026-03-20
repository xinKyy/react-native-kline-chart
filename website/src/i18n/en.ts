const en = {
  meta: {
    title: 'React Native KLine Chart',
    description:
      'A high-performance candlestick chart component for React Native, powered by Skia.',
  },
  nav: {
    home: 'Home',
    docs: 'Docs',
    examples: 'Examples',
    github: 'GitHub',
    getStarted: 'Get Started',
  },
  hero: {
    badge: 'Built with Skia + Reanimated',
    title: 'Stunning KLine Charts',
    titleHighlight: 'for React Native',
    description:
      'A high-performance candlestick chart component powered by @shopify/react-native-skia. Smooth gestures, crosshair, MA indicators — all at 60fps.',
    cta: 'Get Started',
    secondary: 'View on GitHub',
    install: 'npm install react-native-kline-chart',
  },
  features: {
    title: 'Why KLine Chart?',
    subtitle: 'Everything you need to build professional financial charts in React Native.',
    skia: {
      title: 'Skia Rendering',
      description:
        'Draws directly on a Skia canvas using PictureRecorder for maximum performance — bypasses React reconciliation entirely.',
    },
    gestures: {
      title: 'Smooth Gestures',
      description:
        'Pan, pinch-to-zoom, and long-press crosshair — all running as Reanimated worklets on the UI thread.',
    },
    performance: {
      title: '10K+ Candles',
      description:
        'Viewport clipping ensures only visible candles are drawn. Handles 10,000+ data points with zero jank.',
    },
    indicators: {
      title: 'MA Indicators',
      description:
        'Built-in Moving Average lines with configurable periods (MA5, MA10, MA20...) and colors.',
    },
    crosshair: {
      title: 'Crosshair & Info Panel',
      description:
        'Long press to reveal a precision crosshair with OHLC data, price change, and amplitude details.',
    },
    customizable: {
      title: 'Fully Customizable',
      description:
        'Colors, sizes, spacing, indicators — tweak everything via props. Dark theme ready out of the box.',
    },
  },
  quickStart: {
    title: 'Up and Running in Minutes',
    subtitle: 'Three simple steps to add professional KLine charts to your app.',
    step1: {
      title: 'Install',
      description: 'Add the package and its peer dependencies.',
    },
    step2: {
      title: 'Import',
      description: 'Import the component and your candle data.',
    },
    step3: {
      title: 'Render',
      description: 'Drop it into your app — that\'s it!',
    },
  },
  showcase: {
    title: 'See It in Action',
    subtitle: 'Real examples of react-native-kline-chart rendering financial data.',
  },
  cta: {
    title: 'Ready to Build?',
    description: 'Add professional candlestick charts to your React Native app today.',
    button: 'Read the Docs',
    github: 'Star on GitHub',
  },
  footer: {
    description:
      'A high-performance React Native candlestick chart component built with Skia.',
    resources: 'Resources',
    community: 'Community',
    docs: 'Documentation',
    apiRef: 'API Reference',
    examples: 'Examples',
    changelog: 'Changelog',
    github: 'GitHub',
    issues: 'Issues',
    discussions: 'Discussions',
    releases: 'Releases',
    builtWith: 'Built with',
    by: 'by',
  },
  docs: {
    sidebar: {
      gettingStarted: 'Getting Started',
      overview: 'Overview',
      installation: 'Installation',
      quickStart: 'Quick Start',
      guides: 'Guides',
      basicUsage: 'Basic Usage',
      customization: 'Customization',
      gestures: 'Gestures',
      reference: 'Reference',
      apiReference: 'API Reference',
      types: 'Types',
      examples: 'Examples',
    },
    overview: {
      title: 'Overview',
      intro:
        'react-native-kline-chart is a high-performance candlestick (KLine) chart component for React Native, built on @shopify/react-native-skia and react-native-reanimated.',
      whyTitle: 'Why react-native-kline-chart?',
      whyItems: [
        'GPU-accelerated rendering via Skia canvas',
        'Smooth 60fps gestures (pan, pinch, long-press)',
        'Handles 10,000+ candles with viewport clipping',
        'Built-in MA indicators and crosshair',
        'Fully customizable colors, sizes, and behavior',
        'TypeScript-first with full type definitions',
      ],
      requirementsTitle: 'Requirements',
      requirements: [
        'React Native >= 0.78.0',
        'React >= 19.0.0',
        '@shopify/react-native-skia >= 2.0.0',
        'react-native-reanimated >= 4.0.0',
        'react-native-gesture-handler >= 2.20.0',
      ],
    },
    installation: {
      title: 'Installation',
      step1Title: 'Install the package',
      step2Title: 'Install peer dependencies',
      step3Title: 'Configure Babel',
      step3Description: 'Add the Reanimated plugin to your babel.config.js:',
      step4Title: 'iOS Setup',
      step4Description: 'For iOS, run pod install:',
      doneTitle: "You're all set!",
      doneDescription: 'Head over to the Quick Start guide to render your first chart.',
    },
    quickStart: {
      title: 'Quick Start',
      description: 'Get your first KLine chart rendering in under 5 minutes.',
      basicTitle: 'Basic Example',
      basicDescription:
        'Here\'s the minimal code to render a candlestick chart:',
      propsTitle: 'Add More Features',
      propsDescription:
        'Enable MA lines, crosshair, and customize the appearance:',
      nextTitle: 'What\'s Next?',
      nextItems: [
        'Learn about all available props in the API Reference',
        'See advanced examples in the Examples page',
        'Customize colors and behavior in the Customization guide',
      ],
    },
    basicUsage: {
      title: 'Basic Usage',
      description: 'Learn how to set up and use the KlineChart component in your app.',
      dataTitle: 'Preparing Your Data',
      dataDescription:
        'KlineChart expects an array of Candle objects. Each candle needs a timestamp and OHLC (Open, High, Low, Close) values:',
      renderTitle: 'Rendering the Chart',
      renderDescription:
        'Wrap your app in GestureHandlerRootView and pass the data:',
      crosshairTitle: 'Handling Crosshair Events',
      crosshairDescription:
        'Use the onCrosshairChange callback to get data when the user long-presses:',
    },
    customization: {
      title: 'Customization',
      description: 'Customize every aspect of the chart appearance.',
      colorsTitle: 'Colors',
      colorsDescription:
        'Override default colors for candles, background, grid, and text:',
      candleTitle: 'Candle Sizing',
      candleDescription:
        'Control the width and spacing of candles:',
      maTitle: 'Moving Average Lines',
      maDescription:
        'Configure MA periods and their colors:',
    },
    gesturesGuide: {
      title: 'Gestures',
      description: 'The chart supports three built-in gestures, all running at 60fps on the UI thread.',
      panTitle: 'Pan (Scroll)',
      panDescription: 'Swipe left or right to scroll through historical data. The chart automatically handles bounds and momentum.',
      pinchTitle: 'Pinch to Zoom',
      pinchDescription: 'Use two fingers to zoom in and out. Candle width adjusts between minCandleWidth and maxCandleWidth.',
      crosshairTitle: 'Long Press (Crosshair)',
      crosshairDescription: 'Long press to activate the crosshair. An info panel shows OHLC data, price change %, and amplitude.',
    },
    apiReference: {
      title: 'API Reference',
      description: 'Complete reference for all components, props, and types.',
      componentTitle: 'KlineChart Component',
      componentDescription: 'The main component for rendering candlestick charts.',
      propsTitle: 'Props',
      prop: 'Prop',
      type: 'Type',
      default: 'Default',
      required: 'Required',
      descriptionLabel: 'Description',
      propsData: [
        { prop: 'data', type: 'Candle[]', default: '—', required: 'Yes', description: 'Array of candle data to render' },
        { prop: 'width', type: 'number', default: '—', required: 'Yes', description: 'Chart canvas width in pixels' },
        { prop: 'height', type: 'number', default: '—', required: 'Yes', description: 'Chart canvas height in pixels' },
        { prop: 'candleWidth', type: 'number', default: '8', required: 'No', description: 'Width of each candle body' },
        { prop: 'candleSpacing', type: 'number', default: '3', required: 'No', description: 'Space between candles' },
        { prop: 'minCandleWidth', type: 'number', default: '2', required: 'No', description: 'Minimum candle width when zoomed out' },
        { prop: 'maxCandleWidth', type: 'number', default: '24', required: 'No', description: 'Maximum candle width when zoomed in' },
        { prop: 'bullishColor', type: 'string', default: "'#2DC08E'", required: 'No', description: 'Color for bullish candles (close >= open)' },
        { prop: 'bearishColor', type: 'string', default: "'#F6465D'", required: 'No', description: 'Color for bearish candles (close < open)' },
        { prop: 'showMA', type: 'boolean', default: 'true', required: 'No', description: 'Whether to show Moving Average lines' },
        { prop: 'maPeriods', type: 'number[]', default: '[5, 10]', required: 'No', description: 'MA calculation periods' },
        { prop: 'maColors', type: 'string[]', default: "['#F7931A', '#5B8DEF', '#C084FC']", required: 'No', description: 'Colors for each MA line' },
        { prop: 'showCrosshair', type: 'boolean', default: 'true', required: 'No', description: 'Enable long-press crosshair' },
        { prop: 'backgroundColor', type: 'string', default: "'#0B0E11'", required: 'No', description: 'Chart background color' },
        { prop: 'gridColor', type: 'string', default: "'rgba(255,255,255,0.2)'", required: 'No', description: 'Grid line color' },
        { prop: 'textColor', type: 'string', default: "'rgba(255,255,255,0.35)'", required: 'No', description: 'Axis label text color' },
        { prop: 'crosshairColor', type: 'string', default: "'rgba(255,255,255,0.3)'", required: 'No', description: 'Crosshair line color' },
        { prop: 'rightPaddingCandles', type: 'number', default: '20', required: 'No', description: 'Right-side padding in candle units' },
        { prop: 'onCrosshairChange', type: '(candle: Candle | null) => void', default: '—', required: 'No', description: 'Callback when crosshair activates or deactivates' },
      ],
      typesTitle: 'Types',
      candleType: 'Candle',
      candleDescription: 'Represents a single candlestick data point.',
      exportedTitle: 'Exports',
      exportedDescription: 'Everything exported from the package:',
    },
    examples: {
      title: 'Examples',
      description: 'Real-world examples and patterns for using react-native-kline-chart.',
      basicTitle: 'Basic Chart',
      basicDescription: 'Minimal setup with required props only.',
      fullTitle: 'Full Featured',
      fullDescription: 'Chart with all features enabled — MA lines, crosshair, and custom colors.',
      darkTitle: 'Custom Dark Theme',
      darkDescription: 'A fully customized dark theme matching your app\'s design system.',
      screenshotsTitle: 'Screenshots',
      screenshotsDescription: 'See the chart in action:',
    },
  },
} as const;

export default en;
