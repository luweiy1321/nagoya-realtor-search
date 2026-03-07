#!/usr/bin/env python3
"""
A股股票分析工具 - 增强版
支持：技术指标、趋势分析、历史走势
数据源：tushare
"""
import tushare as ts
import sys
import datetime

# 设置tushare token
pro = ts.pro_api('your_token_here')

def get_stock_name(code):
    """获取股票名称"""
    try:
        df = pro.stock_basic(ts_code=code)
        if not df.empty:
            return df.iloc[0]['name']
    except:
        pass
    return "未知"

def get_daily_data(code, days=30):
    """获取历史行情数据"""
    try:
        # 转换代码格式
        if code.startswith('6'):
            ts_code = code + '.SH'
        elif code.startswith('0') or code.startswith('3'):
            ts_code = code + '.SZ'
        elif code.startswith('8') or code.startswith('4'):
            ts_code = code + '.BJ'
        else:
            ts_code = code + '.SH'
        
        # 获取最近N天数据
        end_date = datetime.datetime.now().strftime('%Y%m%d')
        start_date = (datetime.datetime.now() - datetime.timedelta(days=days+30)).strftime('%Y%m%d')
        
        df = pro.daily(ts_code=ts_code, start_date=start_date, end_date=end_date)
        df = df.sort_values('trade_date')
        return df
    except Exception as e:
        print(f"获取数据失败: {e}")
        return None

def calculate_ma(df, period):
    """计算移动平均线"""
    if len(df) < period:
        return None
    return df['close'].tail(period).mean()

def calculate_rsi(df, period=14):
    """计算RSI指标"""
    if len(df) < period + 1:
        return None
    
    delta = df['close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi.iloc[-1]

def calculate_macd(df):
    """计算MACD指标"""
    if len(df) < 26:
        return None
    
    ema12 = df['close'].ewm(span=12, adjust=False).mean()
    ema26 = df['close'].ewm(span=26, adjust=False).mean()
    macd = ema12 - ema26
    signal = macd.ewm(span=9, adjust=False).mean()
    histogram = macd - signal
    
    return {
        'macd': macd.iloc[-1],
        'signal': signal.iloc[-1],
        'histogram': histogram.iloc[-1]
    }

def analyze_trend(df):
    """分析趋势"""
    if len(df) < 5:
        return "数据不足"
    
    # 短期趋势（5日）
    ma5 = df['close'].tail(5)
    short_term = "上涨" if ma5.iloc[-1] > ma5.iloc[0] else "下跌"
    
    # 中期趋势（20日）
    ma20 = df['close'].tail(20)
    mid_term = "上涨" if len(ma20) >= 20 and ma20.iloc[-1] > ma20.iloc[0] else "震荡"
    
    return f"短期{short_term}，中期{mid_term}"

def generate_signals(df, rsi, macd_data):
    """生成交易信号"""
    signals = []
    
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
    if len(df) >= 5 and len(df) >= 10:
        ma5 = df['close'].tail(5).mean()
        ma10 = df['close'].tail(10).mean()
        ma20 = df['close'].tail(20).mean() if len(df) >= 20 else ma10
        
        if ma5 > ma10 > ma20:
            signals.append("✅ 多头排列")
        elif ma5 < ma10 < ma20:
            signals.append("❌ 空头排列")
    
    return signals

def generate_advice(change_pct, rsi, macd_data, trend):
    """生成建议"""
    advice = []
    
    # 基于涨跌幅
    if change_pct > 7:
        advice.append("⚠️ 涨幅较大，注意风险")
    elif change_pct > 5:
        advice.append("⚡ 涨幅可观，谨慎追高")
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
        advice.append("✅ 运行正常")
    
    return advice

def main():
    if len(sys.argv) < 2:
        print('用法: python3 stock_tool.py 股票代码')
        print('例: python3 stock_tool.py 601599')
        sys.exit(1)
    
    code = sys.argv[1]
    
    print(f"\n{'='*50}")
    print(f"📊 股票分析: {code}")
    print('='*50)
    
    # 获取股票名称
    name = get_stock_name(code)
    print(f"股票名称: {name}\n")
    
    # 获取数据
    df = get_daily_data(code, days=30)
    if df is None or df.empty:
        print("❌ 获取数据失败")
        return
    
    # 最新数据
    latest = df.iloc[-1]
    prev = df.iloc[-2] if len(df) > 1 else latest
    
    close = latest['close']
    prev_close = prev['close']
    change = close - prev_close
    change_pct = (change / prev_close) * 100
    
    print(f"📈 最新行情")
    print(f"  当前价: {close:.2f}元")
    print(f"  昨  收: {prev_close:.2f}元")
    print(f"  涨  跌: {change:+.2f}元 ({change_pct:+.2f}%)")
    print(f"  开  盘: {latest['open']:.2f}元")
    print(f"  最  高: {latest['high']:.2f}元")
    print(f"  最  低: {latest['low']:.2f}元")
    print(f"  成 交 额: {latest['amount']/100000000:.2f}亿")
    print(f"  成 交 量: {latest['vol']/10000:.2f}万手")
    
    # 计算技术指标
    ma5 = calculate_ma(df, 5)
    ma10 = calculate_ma(df, 10)
    ma20 = calculate_ma(df, 20)
    rsi = calculate_rsi(df)
    macd_data = calculate_macd(df)
    
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
        print(f"  MACD: {macd_data['macd']:.3f} (signal: {macd_data['signal']:.3f})")
    
    # 趋势分析
    trend = analyze_trend(df)
    print(f"\n📈 趋势分析: {trend}")
    
    # 交易信号
    signals = generate_signals(df, rsi, macd_data)
    print(f"\n📋 交易信号:")
    for sig in signals:
        print(f"  {sig}")
    
    # 建议
    advice = generate_advice(change_pct, rsi, macd_data, trend)
    print(f"\n💡 建议:")
    for a in advice:
        print(f"  {a}")
    
    # 支撑压力
    support = latest['low'] * 0.95
    resistance = latest['high'] * 1.05
    print(f"\n📍 支撑/压力: {support:.2f} / {resistance:.2f}元")
    
    # 最近5日走势
    print(f"\n📊 最近5日走势:")
    for i in range(-5, 0):
        row = df.iloc[i]
        date = row['trade_date']
        c = row['close']
        o = row['open']
        pct = ((c - o) / o) * 100
        arrow = "↑" if c >= o else "↓"
        print(f"  {date}: {o:.2f} → {c:.2f} {arrow}{pct:.2f}%")
    
    print('='*50)

if __name__ == '__main__':
    main()
