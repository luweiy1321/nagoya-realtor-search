#!/usr/bin/env python3
"""
用地图链接替代图片
"""

import csv

rows = []
with open('nagoya_properties.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

print(f"共 {len(rows)} 条")

# 改用Google Maps链接
for row in rows:
    address = row.get('address', '')
    if address:
        # Google Maps搜索链接
        row['image_url'] = f"https://www.google.com/maps/search/{address.replace(' ', '+')}"
    else:
        row['image_url'] = "https://www.google.com/maps"

with open('nagoya_properties_maplink.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print("完成！")
