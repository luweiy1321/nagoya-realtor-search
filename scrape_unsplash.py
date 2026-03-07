#!/usr/bin/env python3
"""
用 Unsplash API 搜索免费图片
"""

import csv
import time
import random
import requests

UNSPLASH_ACCESS_KEY = "demo"  # 用demo key

def search_unsplash(query):
    """用Unsplash搜索图片"""
    url = f"https://api.unsplash.com/search/photos"
    params = {
        'query': query,
        'per_page': 1,
        'orientation': 'horizontal'
    }
    headers = {
        'Authorization': f'Client-ID {UNSPLASH_ACCESS_KEY}'
    }
    
    try:
        resp = requests.get(url, params=params, headers=headers, timeout=10)
        data = resp.json()
        
        if 'results' in data and len(data['results']) > 0:
            return data['results'][0]['urls']['regular']
    except:
        pass
    
    return ""

# 备用图片
FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
    "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800",
]

# 读取CSV
input_file = 'nagoya_properties.csv'
output_file = 'nagoya_properties_unsplash.csv'

rows = []
with open(input_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

print(f"共 {len(rows)} 条房源")

# 处理每条
success = 0
for i, row in enumerate(rows):
    if i >= 100:  # 处理100条
        break
    
    if i % 10 == 0:
        print(f"[{i+1}/100]...")
    
    # 如果有图片就跳过
    if row.get('image_url') and len(row.get('image_url', '')) > 20:
        continue
    
    address = row.get('address', '')
    
    if address:
        # 尝试Unsplash
        image_url = search_unsplash(f"{address} Japan apartment")
        if image_url:
            row['image_url'] = image_url
            success += 1
        else:
            # 用随机备用图片
            row['image_url'] = random.choice(FALLBACK_IMAGES)
            success += 1
    else:
        row['image_url'] = random.choice(FALLBACK_IMAGES)
    
    time.sleep(0.3)

# 保存
with open(output_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print(f"\n完成！处理 {len(rows[:100])} 条")
print(f"保存到 {output_file}")
