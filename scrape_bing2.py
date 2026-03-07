#!/usr/bin/env python3
"""
用 Bing Image 获取房源图片
"""

import csv
import time
import random
import requests
from urllib.parse import quote
import re
import json

def scrape_bing_images(query):
    """从Bing图片搜索获取"""
    url = f"https://www.bing.com/images/search?q={quote(query)}&form=QBLH"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
    
    try:
        resp = requests.get(url, headers=headers, timeout=15)
        
        # 找 murl 或直接图片URL
        matches = re.findall(r'"murl":"(https?://[^"]+)"', resp.text)
        
        for m in matches[:5]:
            if any(x in m.lower() for x in ['.jpg', '.jpeg', '.png']) and 'bing' not in m:
                return m
        
        # 备选：找 otherTranslations
        alt = re.findall(r'"turl":"(https?://[^"]+)"', resp.text)
        for a in alt[:3]:
            if any(x in a.lower() for x in ['.jpg', '.jpeg', '.png']):
                return a
                
    except Exception as e:
        print(f"  错误: {e}")
    
    return ""

FALLBACK = [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
]

rows = []
with open('nagoya_properties.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

print(f"共 {len(rows)} 条")

success = 0
for i, row in enumerate(rows):
    if i >= 20:
        break
    
    print(f"[{i+1}/20] {row.get('title_ja', '')[:25]}...")
    
    if row.get('image_url') and len(row.get('image_url', '')) > 20:
        if 'unsplash' not in row.get('image_url', ''):
            success += 1
            continue
    
    address = row.get('address', '')
    
    if address:
        query = f"{address} apartment Japan"
        img = scrape_bing_images(query)
        if img:
            row['image_url'] = img
            success += 1
            print(f"  ✓ {img[:50]}...")
        else:
            row['image_url'] = random.choice(FALLBACK)
    else:
        row['image_url'] = random.choice(FALLBACK)
    
    time.sleep(random.uniform(1, 2))

with open('nagoya_properties_bing2.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print(f"\n完成！成功 {success} 张")
