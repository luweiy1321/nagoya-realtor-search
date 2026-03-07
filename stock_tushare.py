#!/usr/bin/env python3
"""
A股股票分析工具 - tushare版
简化输出格式
"""
import tushare as ts
import sys
import os
import json

# 读取token
token_file = os.path.expanduser('~/.tushare_token')
if os.path.exists(token_file):
    with open(token_file) as f:
        TOKEN = f.read().strip()
else:
    print("未找到tushare token")
    sys.exit(1)

pro = ts.pro_api(TOKEN)

# 股票名称缓存
NAME_CACHE_FILE = os.path.expanduser('~/.stock_name_cache')
name_cache = {}

def load_name_cache():
    global name_cache
    if os.path.exists(NAME_CACHE_FILE):
        try:
            with open(NAME_CACHE_FILE, 'r') as f:
                name_cache = json.load(f)
        except:
            pass

def save_name_cache():
    with open(NAME_CACHE_FILE, 'w') as f:
        json.dump(name_cache, f)

def get_stock_name(code):
    # 先检查缓存
    if code in name_cache:
        return name_cache[code]
    
    # 尝试tushare
    try:
        ts_code = code + '.SH' if code.startswith('6') else code + '.SZ'
        df = pro.stock_basic(ts_code=ts_code)
        if not df.empty:
            name = df.iloc[0]['name']
            name_cache[code] = name
            save_name_cache()
            return name
    except:
        pass
    
    # tushare失败时用Sina备用
    try:
        import urllib.request
        if code.startswith('6'):
            sina_code = 'sh' + code
        else:
            sina_code = 'sz' + code
        url = 'https://hq.sinajs.cn/list=' + sina_code
        req = urllib.request.Request(url, headers={'Referer': 'https://finance.sina.com.cn'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = response.read().decode('gbk')
            if '=' in data:
                name = data.split('=')[1].strip('"').split(',')[0]
                if name:
                    name_cache[code] = name
                    save_name_cache()
                    return name
    except:
        pass
    
    return "未知"

def get_daily_data(code, days=30):
    try:
        if code.startswith('6'):
            ts_code = code + '.SH'
        elif code.startswith('0') or code.startswith('3'):
            ts_code = code + '.SZ'
        elif code.startswith('8') or code.startswith('4'):
            ts_code = code + '.BJ'
        else:
            ts_code = code + '.SH'
        
        df = pro.daily(ts_code=ts_code, fields='ts_code,trade_date,open,high,low,close,vol,amount')
        df = df.sort_values('trade_date').tail(days)
        return df
    except Exception as e:
        print(f"获取数据失败: {e}")
        return None

def calculate_ma(prices, period):
    if len(prices) < period:
        return None
    return sum(prices[-period:]) / period

def calculate_rsi(prices, period=14):
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
    if len(prices) < period:
        return None
    ema = prices[0]
    multiplier = 2 / (period + 1)
    for price in prices[1:]:
        ema = (price - ema) * multiplier + ema
    return ema

def calculate_macd(prices):
    if len(prices) < 26:
        return None
    ema12 = calculate_ema(prices, 12)
    ema26 = calculate_ema(prices, 26)
    if ema12 is None or ema26 is None:
        return None
    macd_line = ema12 - ema26
    if len(prices) >= 9:
        ema9_prices = prices[-9:]
    else:
        ema9_prices = prices
    signal_line = calculate_ema(ema9_prices, 9)
    if signal_line is None:
        return None
    histogram = macd_line - signal_line
    return {'macd': macd_line, 'signal': signal_line, 'histogram': histogram}

def analyze_trend(closes):
    if len(closes) < 5:
        return "数据不足"
    short_term = "上涨" if closes[-1] > closes[-5] else "下跌"
    if len(closes) >= 20:
        mid_term = "上涨" if closes[-1] > closes[-20] else "下跌"
    else:
        mid_term = "震荡"
    return f"短期{short_term}，中期{mid_term}"

def main():
    load_name_cache()
    
    if len(sys.argv) < 2:
        print('用法: python3 stock_tool.py 股票代码')
        sys.exit(1)
    
    code = sys.argv[1]
    name = get_stock_name(code)
    
    df = get_daily_data(code, days=30)
    if df is None or df.empty:
        print("获取数据失败")
        return
    
    latest = df.iloc[-1]
    prev = df.iloc[-2] if len(df) > 1 else latest
    
    close = latest['close']
    prev_close = prev['close']
    change_pct = ((close - prev_close) / prev_close) * 100
    
    closes = df['close'].tolist()
    ma5 = calculate_ma(closes, 5)
    ma10 = calculate_ma(closes, 10)
    ma20 = calculate_ma(closes, 20)
    rsi = calculate_rsi(closes)
    macd_data = calculate_macd(closes)
    trend = analyze_trend(closes)
    
    # 信号
    signals = []
    if rsi:
        if rsi > 70:
            signals.append("RSI超买")
        elif rsi < 30:
            signals.append("RSI超卖")
        elif rsi > 50:
            signals.append("RSI偏强")
        else:
            signals.append("RSI偏弱")
    
    if macd_data:
        if macd_data['histogram'] > 0:
            signals.append("MACD金叉")
        else:
            signals.append("MACD死叉")
    
    if len(closes) >= 5 and len(closes) >= 10:
        if ma5 and ma10 and ma20:
            if ma5 > ma10 > ma20:
                signals.append("多头排列")
            elif ma5 < ma10 < ma20:
                signals.append("空头排列")
    
    # MACD建议
    macd_signal = "金叉" if macd_data and macd_data['histogram'] > 0 else "死叉" if macd_data else ""
    
    # 支撑压力
    support = latest['low'] * 0.95
    resistance = latest['high'] * 1.05
    
    # 打印简化格式
    print(f"\n{name} ({code})")
    print(f"• 当前价：{close:.2f}元 ({change_pct:+.2f}%)")
    print(f"• MA5/10/20：{ma5:.2f}/{ma10:.2f}/{ma20:.2f}元" if ma5 and ma10 and ma20 else "• 均线：数据不足")
    print(f"• RSI：{rsi:.1f}" if rsi else "• RSI：-")
    print(f"• MACD：{macd_signal}")
    print(f"• 趋势：{trend}")
    print(f"• 信号：{', '.join(signals) if signals else '-'}")
    print(f"• 支撑/压力：{support:.2f}/{resistance:.2f}元")

if __name__ == '__main__':
    main()
