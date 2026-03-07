#!/usr/bin/env python3
import urllib.request
import sys

def get_stock_price(code):
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
        print('Error:', e)
        return None

def analyze(stock):
    change = stock['close'] - stock['prev_close']
    change_pct = (change / stock['prev_close']) * 100
    
    signals = []
    
    # 涨跌信号
    if change_pct > 5:
        signals.append('⚠️ 大涨超过5%')
    elif change_pct < -5:
        signals.append('⚠️ 大跌超过5%')
    elif change_pct > 0:
        signals.append('📈 上涨')
    else:
        signals.append('📉 下跌')
    
    # 放量信号 (简单判断)
    if stock['volume'] > 100000000:
        signals.append('🔥 放量')
    
    # 压力支撑
    support = stock['low'] * 0.95
    resistance = stock['high'] * 1.05
    
    return change, change_pct, signals, support, resistance

def main():
    if len(sys.argv) < 2:
        print('用法: python3 stock_tool.py 股票代码')
        print('例: python3 stock_tool.py 601599')
        sys.exit(1)
    
    code = sys.argv[1]
    stock = get_stock_price(code)
    
    if stock:
        change, change_pct, signals, support, resistance = analyze(stock)
        
        print('=' * 45)
        print('📊 ' + stock['name'] + ' (' + code + ')')
        print('=' * 45)
        print('当前价: ' + str(stock['close']) + '元')
        print('昨  收: ' + str(stock['prev_close']) + '元')
        print('涨  跌: ' + ('%+.2f' % change) + '元  (' + ('%+.2f' % change_pct) + '%)')
        print('高/低: ' + str(stock['high']) + '/' + str(stock['low']) + '元')
        print('成交额: ' + ('%.0f' % (stock['amount']/10000)) + '万')
        print('-' * 45)
        print('📋 信号: ' + ' '.join(signals))
        print('支  撑: ' + ('%.2f' % support) + '元')
        print('压  力: ' + ('%.2f' % resistance) + '元')
        print('-' * 45)
        
        # 简单建议
        print('💡 建议:')
        if change_pct > 7:
            print('  ⚠️ 涨停板，注意风险')
        elif change_pct < -7:
            print('  ⚠️ 跌停板，可能超卖')
        elif change_pct > 3:
            print('  ⚡ 涨幅较大，谨慎追高')
        elif change_pct < -3:
            print('  💪 跌幅较大，可能反弹')
        elif change > 0:
            print('  ✅ 正常运行')
        else:
            print('  ➖ 正常运行')
        print('=' * 45)
    else:
        print('获取数据失败')

if __name__ == '__main__':
    main()
