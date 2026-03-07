#!/usr/bin/env python3
"""
A股股票分析工具 - 增强版
支持：技术指标、趋势分析、历史走势
数据源：Sina (无需token)
"""
import urllib.request
import json
import sys
import datetime

def get_realtime(code):
    """获取实时行情"""
    if code.startswith('6'):
        sina_code = 'sh' + code
    else:
        sina_code = 'sz' + code
    
    url = 'https://hq.sinajs.cn/list=' + sina_code
    req = urllib.request.Request(url, headers={'Referer': 'https://finance.sina.com.cn'})
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            data = response.read().decode('gbk')
            data = data.split('=')[1].strip('"')
            fields = data.split(',')
            return {
                'name': fields[0],
                'prev_close': float(fields[1]),
                'open': float(fields[2]),
                'high': float(fields[3]),
                'low': float(fields[4]),
                'close': float(fields[5]),
                'volume': int(float(fields[6])),
                'amount': float(fields[7]),
            }
    except Exception as e:
        print(f"获取实时数据失败: {e}")
        return None

def get_history_sina(code, days=30):
    """从Sina获取历史数据"""
    history = []
    
    # 尝试获取K线数据
    if code.startswith('6'):
        symbol = 'sh' + code
    else:
        symbol = 'sz' + code
    
    # 使用新浪K线接口
    url = f"https://quotes.sina.cn/cn/api/jsonp.php/var%20_{symbol}=/CN_MarketDataService.getKLineData?symbol={symbol}&scale=240&ma=no&datalen={days}"
    
    try:
        req = urllib.request.Request(url, headers={'Referer': 'https://finance.sina.com.cn'})
        with urllib.request.urlopen(req, timeout=15) as response:
            text = response.read().decode('utf-8')
            # 解析JSON
            start = text.find('[')
            end = text.rfind(']') + 1
            if start >= 0 and end > 0:
                json_str = text[start:end]
                data = json.loads(json_str)
                for item in data:
                    history.append({
                        'date': item['day'],
                        'open': float(item['open']),
                        'high': float(item['high']),
                        'low': float(item['low']),
                        'close': float(item['close']),
                        'volume': float(item['volume']) if 'volume' in item else 0
                    })
    except Exception as e:
        print(f"获取历史数据失败: {e}")
    
    return history

def calculate_ma(prices, period):
    """计算移动平均线"""
    if len(prices) < period:
        return None
    return sum(prices[-period:]) / period

def calculate_rsi(prices, period=14):
    """计算RSI指标"""
    if len(prices) < period + 1:
        return None
    
    deltas = [prices[i] - prices[i-1] for i in range(1, len(prices))]
    gains = [d if d > 0 else 0 for d in deltas]
    losses = [-d if d < 0 else 0 for d in deltas]
    
    avg_gain = sum(gains[-period:]) / period
    avg_loss = sum(losses[-period:]) / period
    
    if avg_loss == 0:
        return 100
    
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

def calculate_ema(prices, period):
    """计算指数移动平均"""
    if len(prices) < period:
        return None
    ema = prices[0]
    multiplier = 2 / (period + 1)
    for price in prices[1:]:
        ema = (price - ema) * multiplier + ema
    return ema

def calculate_macd(prices):
    """计算MACD"""
    if len(prices) < 26:
        return None
    
    ema12 = calculate_ema(prices, 12)
    ema26 = calculate_ema(prices, 26)
    
    if ema12 is None or ema26 is None:
        return None
    
    macd_line = ema12 - ema26
    
    # 计算9日EMA作为信号线
    ema9_prices = prices[-9:] if len(prices) >= 9 else prices
    signal_line = calculate_ema(ema9_prices, 9)
    
    if signal_line is None:
        return None
    
    histogram = macd_line - signal_line
    
    return {
        'macd': macd_line,
        'signal': signal_line,
        'histogram': histogram
    }

def analyze_trend(history):
    """分析趋势"""
    if len(history) < 5:
        return "数据不足"
    
    closes = [h['close'] for h in history]
    
    # 短期趋势（5日）
    short_term = "上涨" if closes[-1] > closes[-5] else "下跌"
    
    # 中期趋势（20日）
    if len(closes) >= 20:
        mid_term = "上涨" if closes[-1] > closes[-20] else "下跌"
    else:
        mid_term = "震荡"
    
    return f"短期{short_term}，中期{mid_term}"

def generate_signals(history, rsi, macd_data):
    """生成交易信号"""
    signals = []
    
    if len(history) < 2:
        return signals
    
    closes = [h['close'] for h in history]
    
    # RSI信号
    if rsi:
        if rsi > 70:
            signals.append("⚠️ RSI超买")
        elif rsi < 30:
            signals.append("🔥 RSI超卖")
        elif rsi > 50:
            signals.append("📈 RSI偏强")
        else:
            signals.append("📉 RSI偏弱")
    
    # MACD信号
    if macd_data:
        if macd_data['histogram'] > 0:
            signals.append("📈 MACD金叉")
        else:
            signals.append("📉 MACD死叉")
    
    # 均线信号
    if len(history) >= 5 and len(history) >= 10:
        ma5 = calculate_ma(closes, 5)
        ma10 = calculate_ma(closes, 10)
        ma20 = calculate_ma(closes, 20) if len(history) >= 20 else ma10
        
        if ma5 and ma10 and ma20:
            if ma5 > ma10 > ma20:
                signals.append("✅ 多头排列")
            elif ma5 < ma10 < ma20:
                signals.append("❌ 空头排列")
    
    return signals

def generate_advice(change_pct, rsi, macd_data):
    """生成建议"""
    advice = []
    
    # 基于涨跌幅
    if change_pct > 7:
        advice.append("⚠️ 涨停板附近，注意风险")
    elif change_pct > 5:
        advice.append("⚡ 涨幅较大，谨慎追高")
    elif change_pct < -7:
        advice.append("🔥 可能超卖，关注反弹")
    elif change_pct < -5:
        advice.append("💪 跌幅较大，可能超卖")
    
    # 基于RSI
    if rsi:
        if rsi > 75:
            advice.append("RSI严重超买，建议观望")
        elif rsi < 25:
            advice.append("RSI严重超卖，可适当关注")
    
    # 基于MACD
    if macd_data:
        if macd_data['histogram'] > 0 and macd_data['macd'] > macd_data['signal']:
            advice.append("MACD多头信号")
        elif macd_data['histogram'] < 0 and macd_data['macd'] < macd_data['signal']:
            advice.append("MACD空头信号")
    
    if not advice:
        advice.append("✅ 正常运行")
    
    return advice

def main():
    if len(sys.argv) < 2:
        print('用法: python3 stock_v2.py 股票代码')
        print('例: python3 stock_v2.py 601599')
        sys.exit(1)
    
    code = sys.argv[1]
    
    print(f"\n{'='*50}")
    print(f"📊 股票分析: {code}")
    print('='*50)
    
    # 获取实时数据
    realtime = get_realtime(code)
    if not realtime:
        print("❌ 获取实时数据失败")
        return
    
    print(f"股票名称: {realtime['name']}\n")
    
    # 获取历史数据
    history = get_history_sina(code, days=30)
    
    # 实时行情
    close = realtime['close']
    prev_close = realtime['prev_close']
    change = close - prev_close
    change_pct = (change / prev_close) * 100
    
    print(f"📈 最新行情")
    print(f"  当前价: {close:.2f}元")
    print(f"  昨  收: {prev_close:.2f}元")
    print(f"  涨  跌: {change:+.2f}元 ({change_pct:+.2f}%)")
    print(f"  开  盘: {realtime['open']:.2f}元")
    print(f"  最  高: {realtime['high']:.2f}元")
    print(f"  最  低: {realtime['low']:.2f}元")
    print(f"  成交额: {realtime['amount']/100000000:.2f}亿")
    print(f"  成交量: {realtime['volume']/10000:.2f}万手")
    
    # 计算技术指标
    if history:
        closes = [h['close'] for h in history]
        opens = [h['open'] for h in history]
        
        ma5 = calculate_ma(closes, 5)
        ma10 = calculate_ma(closes, 10)
        ma20 = calculate_ma(closes, 20)
        rsi = calculate_rsi(closes)
        macd_data = calculate_macd(closes)
        
        print(f"\n📊 技术指标")
        if ma5:
            print(f"  MA5:  {ma5:.2f}元")
        if ma10:
            print(f"  MA10: {ma10:.2f}元")
        if ma20:
            print(f"  MA20: {ma20:.2f}元")
        if rsi:
            print(f"  RSI:  {rsi:.1f}")
        if macd_data:
            print(f"  MACD: {macd_data['macd']:.4f}")
            print(f"  Signal: {macd_data['signal']:.4f}")
            print(f"  柱状: {macd_data['histogram']:+.4f}")
        
        # 趋势分析
        trend = analyze_trend(history)
        print(f"\n📈 趋势分析: {trend}")
        
        # 交易信号
        signals = generate_signals(history, rsi, macd_data)
        print(f"\n📋 交易信号:")
        for sig in signals:
            print(f"  {sig}")
        
        # 建议
        advice = generate_advice(change_pct, rsi, macd_data)
        print(f"\n💡 建议:")
        for a in advice:
            print(f"  {a}")
        
        # 支撑压力
        support = realtime['low'] * 0.95
        resistance = realtime['high'] * 1.05
        print(f"\n📍 支撑/压力: {support:.2f} / {resistance:.2f}元")
        
        # 最近5日走势
        print(f"\n📊 最近5日走势:")
        for i in range(-5, 0):
            if len(history) > abs(i+1):
                h = history[i]
                pct = ((h['close'] - h['open']) / h['open']) * 100
                arrow = "↑" if h['close'] >= h['open'] else "↓"
                print(f"  {h['date'][:10]}: {h['open']:.2f} → {h['close']:.2f} {arrow}{pct:.2f}%")
    else:
        print("\n⚠️ 无法获取历史数据，仅显示实时行情")
    
    print('='*50)

if __name__ == '__main__':
    main()
