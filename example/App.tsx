import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KlineChart } from 'react-native-kline-chart';
import type { Candle } from 'react-native-kline-chart';
import { useBinanceKline } from './src/useBinanceKline';
import type { TimeInterval } from './src/useBinanceKline';

const INTERVALS: { label: string; value: TimeInterval }[] = [
  { label: '1秒', value: '1s' },
  { label: '1分', value: '1m' },
  { label: '3分', value: '3m' },
  { label: '15分', value: '15m' },
  { label: '1时', value: '1h' },
  { label: '4时', value: '4h' },
  { label: '1日', value: '1d' },
];

const TABS = ['行情', '概况', '数据', '动态', '交易', '跟单', '策略'];
const INDICATORS = ['VOL', 'MA', 'EMA', 'BOLL', 'SAR', '撑压线', '超级趋势', '包络线'];

function formatPrice(p: number): string {
  if (p === 0) return '--';
  const fixed = p >= 1000 ? p.toFixed(1) : p >= 1 ? p.toFixed(2) : p.toFixed(4);
  const [intPart, decPart] = fixed.split('.');
  const formatted = intPart!.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decPart ? `${formatted}.${decPart}` : formatted;
}

export default function App() {
  const { width } = useWindowDimensions();
  const [interval, setInterval] = useState<TimeInterval>('1s');
  const [activeTab, setActiveTab] = useState(0);
  const [activeIndicator, setActiveIndicator] = useState(1);
  const [activeCandle, setActiveCandle] = useState<Candle | null>(null);

  const { data, price, change, changePercent, loading } = useBinanceKline(
    'BTCUSDT',
    interval,
    500,
  );

  const handleCrosshairChange = useCallback((candle: Candle | null) => {
    setActiveCandle(candle);
  }, []);

  const isUp = change >= 0;
  const priceColor = isUp ? '#2DC08E' : '#F6465D';

  const displayCandle = activeCandle ?? (data.length > 0 ? data[data.length - 1]! : null);

  const chartHeight = 380;

  const maConfig = useMemo(() => {
    switch (INDICATORS[activeIndicator]) {
      case 'MA': return { show: true, periods: [5, 10, 20] };
      case 'EMA': return { show: true, periods: [7, 25] };
      default: return { show: true, periods: [5, 10] };
    }
  }, [activeIndicator]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.backArrow}>{'‹'}</Text>
          <Text style={styles.pairName}>BTC/USDT</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>现货</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>10x</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.headerIcon}>★</Text>
          <Text style={styles.headerIcon}>↗</Text>
        </View>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={[styles.priceText, { color: priceColor }]}>
            {formatPrice(price)}
          </Text>
          <Text style={[styles.changeText, { color: priceColor }]}>
            {isUp ? '+' : ''}{changePercent.toFixed(2)}%
          </Text>
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabBar}
          contentContainerStyle={styles.tabBarContent}
        >
          {TABS.map((tab, i) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(i)}
              style={[styles.tab, activeTab === i && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Interval selector */}
        <View style={styles.intervalRow}>
          <View style={styles.intervalGroup}>
            {INTERVALS.map((item) => (
              <TouchableOpacity
                key={item.value}
                onPress={() => setInterval(item.value)}
                style={[
                  styles.intervalBtn,
                  interval === item.value && styles.intervalBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.intervalText,
                    interval === item.value && styles.intervalTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.intervalBtn}>
              <Text style={styles.intervalText}>更多 ▾</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.intervalRight}>
            <Text style={styles.intervalIcon}>📊</Text>
            <Text style={styles.intervalIcon}>⏱</Text>
          </View>
        </View>

        {/* OHLC info */}
        {displayCandle && (
          <View style={styles.ohlcRow}>
            <Text style={styles.ohlcLabel}>
              O<Text style={styles.ohlcVal}> {formatPrice(displayCandle.open)}</Text>
            </Text>
            <Text style={styles.ohlcLabel}>
              H<Text style={styles.ohlcVal}> {formatPrice(displayCandle.high)}</Text>
            </Text>
            <Text style={styles.ohlcLabel}>
              L<Text style={styles.ohlcVal}> {formatPrice(displayCandle.low)}</Text>
            </Text>
            <Text style={styles.ohlcLabel}>
              C<Text style={styles.ohlcVal}> {formatPrice(displayCandle.close)}</Text>
            </Text>
          </View>
        )}

        {/* Chart */}
        <View style={styles.chartContainer}>
          {loading ? (
            <View style={[styles.loadingContainer, { height: chartHeight }]}>
              <ActivityIndicator color="#2DC08E" size="large" />
              <Text style={styles.loadingText}>加载K线数据...</Text>
            </View>
          ) : (
            <KlineChart
              data={data}
              width={width}
              height={chartHeight}
              showMA={maConfig.show}
              maPeriods={maConfig.periods}
              showCrosshair
              onCrosshairChange={handleCrosshairChange}
            />
          )}
        </View>

        {/* Indicator tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.indicatorBar}
          contentContainerStyle={styles.indicatorBarContent}
        >
          {INDICATORS.map((ind, i) => (
            <TouchableOpacity
              key={ind}
              onPress={() => setActiveIndicator(i)}
              style={styles.indicatorBtn}
            >
              <Text
                style={[
                  styles.indicatorText,
                  activeIndicator === i && styles.indicatorTextActive,
                ]}
              >
                {ind}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Order Book Section */}
        <OrderBookSection />

        {/* Bottom Tabs */}
        <View style={styles.bottomTabs}>
          <View style={styles.bottomTabItem}>
            <Text style={styles.bottomTabIcon}>📋</Text>
            <Text style={styles.bottomTabLabel}>订单表</Text>
          </View>
          <View style={styles.bottomTabItem}>
            <Text style={styles.bottomTabIcon}>📊</Text>
            <Text style={styles.bottomTabLabel}>深度图</Text>
          </View>
          <View style={styles.bottomTabItem}>
            <Text style={styles.bottomTabIcon}>🔄</Text>
            <Text style={styles.bottomTabLabel}>最新成交</Text>
          </View>
          <View style={styles.bottomTabItem}>
            <Text style={styles.bottomTabIcon}>⚡</Text>
            <Text style={styles.bottomTabLabel}>关键事件</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Trade Button */}
      <View style={styles.floatingBar}>
        <TouchableOpacity style={styles.tradeButton}>
          <Text style={styles.tradeButtonText}>交易</Text>
        </TouchableOpacity>
        <View style={styles.floatingIcons}>
          <View style={styles.floatingIconItem}>
            <Text style={styles.floatingIconText}>网格</Text>
          </View>
          <View style={styles.floatingIconItem}>
            <Text style={styles.floatingIconText}>合约</Text>
          </View>
          <View style={styles.floatingIconItem}>
            <Text style={styles.floatingIconText}>预警</Text>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

function OrderBookSection() {
  const bids = useMemo(() => {
    const items = [];
    const base = 69470;
    for (let i = 0; i < 4; i++) {
      items.push({
        price: (base - i * 0.1).toFixed(1),
        amount: (Math.random() * 0.5 + 0.001).toFixed(5),
      });
    }
    return items;
  }, []);

  const asks = useMemo(() => {
    const items = [];
    const base = 69470.2;
    for (let i = 0; i < 4; i++) {
      items.push({
        price: (base + i * 0.7).toFixed(1),
        amount: (Math.random() * 0.5 + 0.05).toFixed(5),
      });
    }
    return items;
  }, []);

  return (
    <View style={styles.orderBook}>
      <View style={styles.orderBookHeader}>
        <Text style={styles.orderBookHeaderLeft}>买入 (BTC)</Text>
        <View style={styles.orderBookHeaderCenter}>
          <Text style={styles.orderBookStep}>0.1</Text>
          <Text style={styles.orderBookDropdown}>▾</Text>
        </View>
        <Text style={styles.orderBookHeaderRight}>卖出 (BTC)</Text>
      </View>

      {bids.map((bid, i) => (
        <View key={`bid-${i}`} style={styles.orderRow}>
          <Text style={styles.orderAmount}>{bid.amount}</Text>
          <Text style={styles.orderBidPrice}>{bid.price}</Text>
          <Text style={styles.orderAskPrice}>{asks[i]?.price}</Text>
          <Text style={styles.orderAmount}>{asks[i]?.amount}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0E11',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backArrow: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '300',
    marginRight: 4,
  },
  pairName: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  headerIcon: {
    color: '#F7B500',
    fontSize: 20,
  },

  // Price
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 8,
    gap: 10,
  },
  priceText: {
    fontSize: 30,
    fontWeight: '600',
  },
  changeText: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Tabs
  tabBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  tabBarContent: {
    paddingHorizontal: 16,
    gap: 24,
  },
  tab: {
    paddingVertical: 10,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFF',
  },
  tabText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFF',
  },

  // Intervals
  intervalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  intervalGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  intervalBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  intervalBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  intervalText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 13,
    fontWeight: '500',
  },
  intervalTextActive: {
    color: '#FFF',
  },
  intervalRight: {
    flexDirection: 'row',
    gap: 12,
  },
  intervalIcon: {
    fontSize: 16,
  },

  // OHLC
  ohlcRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 4,
    gap: 12,
  },
  ohlcLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
  },
  ohlcVal: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
  },

  // Chart
  chartContainer: {
    overflow: 'hidden',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
  },

  // Indicator tabs
  indicatorBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  indicatorBarContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 16,
  },
  indicatorBtn: {
    paddingHorizontal: 4,
  },
  indicatorText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    fontWeight: '500',
  },
  indicatorTextActive: {
    color: '#FFF',
  },

  // Order Book
  orderBook: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  orderBookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  orderBookHeaderLeft: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  orderBookHeaderCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orderBookStep: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  orderBookDropdown: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
  },
  orderBookHeaderRight: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  orderAmount: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    width: 80,
  },
  orderBidPrice: {
    color: '#2DC08E',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
    width: 80,
  },
  orderAskPrice: {
    color: '#F6465D',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'left',
    width: 80,
  },

  // Bottom section tabs
  bottomTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.06)',
    marginTop: 8,
  },
  bottomTabItem: {
    alignItems: 'center',
    gap: 4,
  },
  bottomTabIcon: {
    fontSize: 16,
  },
  bottomTabLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
  },

  // Floating bar
  floatingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B0E11',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: 34,
  },
  tradeButton: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 16,
  },
  tradeButtonText: {
    color: '#0B0E11',
    fontSize: 16,
    fontWeight: '700',
  },
  floatingIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  floatingIconItem: {
    alignItems: 'center',
  },
  floatingIconText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
  },
});
