#!/usr/bin/env python3
"""
用 Google Custom Search API 搜真实房源图片
"""

import csv
import time
import random
import requests
import json

API_KEY = "AIzaSyDLRlMOCBC_HALkVnRUOcyXxmmkma3qbRg"
CX = "224715641918d4cfc"

def search_images(query):
    """用Google图片搜索"""
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        'key': API_KEY,
        'cx': CX,
        'q': query,
        'searchType': 'image',
        'num': 5
    }
    
    try:
        resp = requests.get(url, params=params, timeout=10)
        data = resp.json()
        
        if 'items' in data and len(data['items']) > 0:
            return data['items'][0]['link']
    except Exception as e:
        print(f"  错误: {e}")
    
    return ""

FALLBACK = [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
]

# 读取CSV
rows = []
with open('nagoya_properties.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

print(f"共 {len(rows)} 条")

success = 0
for i, row in enumerate(rows):
    if i >= 50:  # 先跑50条测试
        break
    
    print(f"[{i+1}/50] {row.get('title_ja', '')[:25]}...")
    
    # 已有图片跳过
    if row.get('image_url') and len(row.get('image_url', '')) > 20:
        print("  已有图片")
        success += 1
        continue
    
    address = row.get('address', '')
    
    if address:
        # 搜索真实房源图片
        query = f"{address} apartment Japan"
        img = search_images(query)
        if img:
            row['image_url'] = img
            success += 1
            print(f"  ✓ {img[:40]}...")
        else:
            row['image_url'] = random.choice(FALLBACK)
    else:
        row['image_url'] = random.choice(FALLBACK)
    
    time.sleep(1)

# 保存
with open('nagoya_properties_google.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print(f"\n完成！成功 {success} 张")
