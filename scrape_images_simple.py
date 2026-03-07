#!/usr/bin/env python3
"""
简单版图片爬虫 - 用Google搜索图片
"""

import csv
import time
import random
import requests
from urllib.parse import quote

def search_google_images(query):
    """用Google图片搜索"""
    url = f"https://www.google.com/search?q={quote(query)}&tbm=isch"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    }
    
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        
        # 提取图片URL
        import re
        # 找 "https://...jpg" 或 "https://...png" 
        img_pattern = r'https://[^"]+\.(jpg|jpeg|png|gif)'
        matches = re.findall(img_pattern, resp.text, re.IGNORECASE)
        
        if matches:
            # 返回第一个匹配的图片
            return f"https://{matches[0]}"
    except Exception as e:
        print(f"  错误: {e}")
    
    return ""

# 读取CSV
input_file = 'nagoya_properties.csv'
output_file = 'nagoya_properties_images.csv'

rows = []
with open(input_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

print(f"共 {len(rows)} 条房源")

# 处理每条
success = 0
for i, row in enumerate(rows[:30]):  # 先处理30条测试
    print(f"[{i+1}/30] {row.get('title_ja', '')[:30]}...")
    
    # 如果有图片就跳过
    if row.get('image_url') and len(row.get('image_url', '')) > 10:
        print("  已有图片")
        continue
    
    address = row.get('address', '')
    
    if address:
        # 搜索图片
        image_url = search_google_images(f"{address} apartment Japan")
        if image_url:
            row['image_url'] = image_url
            success += 1
            print(f"  ✓ {image_url[:50]}...")
        else:
            print("  ✗ 没找到图片")
    
    time.sleep(random.uniform(0.5, 1.5))

# 保存
with open(output_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print(f"\n完成！成功获取 {success} 张图片")
print(f"保存到 {output_file}")
