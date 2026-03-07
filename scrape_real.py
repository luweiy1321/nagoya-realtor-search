#!/usr/bin/env python3
"""
直接从 Google Images 获取房源图片
"""

import csv
import time
import random
import requests
from urllib.parse import quote
import re

def scrape_google_images(query):
    """直接从Google图片搜索获取"""
    url = f"https://www.google.com/search?q={quote(query)}&tbm=isch"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
    }
    
    try:
        resp = requests.get(url, headers=headers, timeout=15)
        
        # 找图片URL
        # 多种模式
        patterns = [
            r'"([^"]+)"',  # 引号包围的URL
            r'url=([^&]+)',  # url参数
        ]
        
        # 简单提取所有可能的图片URL
        urls = re.findall(r'https://[^"\'<>]+\.(?:jpg|jpeg|png|gif)', resp.text)
        
        for u in urls[:10]:
            if 'google' not in u and 'logo' not in u.lower():
                return u
                
    except Exception as e:
        print(f"  错误: {e}")
    
    return ""

FALLBACK = [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
]

# 读取
rows = []
with open('nagoya_properties.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

print(f"共 {len(rows)} 条")

success = 0
for i, row in enumerate(rows):
    if i >= 30:
        break
    
    print(f"[{i+1}/30] {row.get('title_ja', '')[:25]}...")
    
    # 已有图片跳过
    if row.get('image_url') and len(row.get('image_url', '')) > 20:
        if 'unsplash' not in row.get('image_url', ''):
            success += 1
            continue
    
    address = row.get('address', '')
    
    if address:
        query = f"{address} apartment Japan"
        img = scrape_google_images(query)
        if img:
            row['image_url'] = img
            success += 1
            print(f"  ✓ {img[:50]}...")
        else:
            row['image_url'] = random.choice(FALLBACK)
    else:
        row['image_url'] = random.choice(FALLBACK)
    
    time.sleep(random.uniform(1, 2))

# 保存
with open('nagoya_properties_real.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print(f"\n完成！成功 {success} 张")
