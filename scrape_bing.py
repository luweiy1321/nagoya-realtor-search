#!/usr/bin/env python3
"""
图片爬虫 - 修复版
"""

import csv
import time
import random
import requests
from urllib.parse import quote, unquote
import re

def search_bing_images(query):
    """用Bing图片搜索"""
    url = f"https://www.bing.com/images/search?q={quote(query)}&first=1"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
    
    try:
        resp = requests.get(url, headers=headers, timeout=15)
        
        # 找 murl 参数
        matches = re.findall(r'murl":"(https?://[^"]+)"', resp.text)
        
        for m in matches:
            if any(x in m.lower() for x in ['.jpg', '.jpeg', '.png', '.gif']):
                return m
        
    except Exception as e:
        print(f"  错误: {e}")
    
    return ""

# 读取CSV
input_file = 'nagoya_properties.csv'
output_file = 'nagoya_properties_bing.csv'

rows = []
with open(input_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

print(f"共 {len(rows)} 条房源")

# 处理每条
success = 0
for i, row in enumerate(rows[30:50]):  # 处理30-50条
    idx = i + 30
    print(f"[{idx+1}/50] {row.get('title_ja', '')[:25]}...")
    
    address = row.get('address', '')
    
    if address:
        # 用Bing搜索
        image_url = search_bing_images(f"{address} apartment exterior")
        if image_url:
            row['image_url'] = image_url
            success += 1
            print(f"  ✓ {image_url[:60]}...")
        else:
            print("  ✗ 没找到")
    else:
        print("  跳过")
    
    time.sleep(random.uniform(1, 2))

# 保存
with open(output_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print(f"\n完成！成功获取 {success} 张图片")
print(f"保存到 {output_file}")
