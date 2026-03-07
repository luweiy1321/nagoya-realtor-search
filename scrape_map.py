#!/usr/bin/env python3
"""
用 OpenStreetMap 获取房源真实位置图片
"""

import csv
import time
import random
import requests
from urllib.parse import quote

# 地址转坐标（用 Nominatim 免费服务）
def geocode(address):
    url = f"https://nominatim.openstreetmap.org/search?q={quote(address)}&format=json&limit=1"
    headers = {'User-Agent': 'NagoyaRealEstate/1.0'}
    
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        data = resp.json()
        if data:
            return float(data[0]['lat']), float(data[0]['lon'])
    except:
        pass
    return None, None

# 用静态地图API（OpenStreetMap）
def get_map_image(lat, lon):
    # 使用静态地图
    zoom = 16
    size = "400,300"
    # OpenStreetMap 静态图
    url = f"https://staticmap.openstreetmap.de/staticmap.php?center={lat},{lon}&zoom={zoom}&size={size}&markers={lat},{lon},red-pushpin"
    return url

# 备用Unsplash
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
    if i >= 50:
        break
    
    print(f"[{i+1}/50] {row.get('title_ja', '')[:25]}...")
    
    address = row.get('address', '')
    
    if address:
        # 转坐标
        lat, lon = geocode(address)
        if lat and lon:
            img_url = get_map_image(lat, lon)
            row['image_url'] = img_url
            success += 1
            print(f"  ✓ 坐标: {lat:.4f},{lon:.4f}")
        else:
            row['image_url'] = random.choice(FALLBACK)
    else:
        row['image_url'] = random.choice(FALLBACK)
    
    time.sleep(1)

with open('nagoya_properties_map.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print(f"\n完成！成功 {success} 张")
