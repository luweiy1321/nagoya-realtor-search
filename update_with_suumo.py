#!/usr/bin/env python3
"""
用真实SUUMO截图更新图片
"""

import csv
import random
import os

# 区域截图映射
AREA_SCREENSHOTS = {
    "中区": "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-spider/main/screenshots/%E4%B8%AD%E5%8C%BA.png",
    "东区": "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-spider/main/screenshots/%E4%B8%9C%E5%8C%BA.png",
    "南区": "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-spider/main/screenshots/%E5%8D%97%E5%8C%BA.png",
    "西区": "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-spider/main/screenshots/%E8%A5%BF%E5%8C%BA.png",
    "北区": "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-spider/main/screenshots/%E5%8C%97%E5%8C%BA.png",
    "昭和区": "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-spider/main/screenshots/%E6%98%AD%E5%92%8C%E5%8C%BA.png",
    "瑞穂区": "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-spider/main/screenshots/%E7%91%9E%E7%A9%82%E5%8C%BA.png",
    "熱田区": "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-spider/main/screenshots/%E7%86%8A%E7%94%B0%E5%8C%BA.png",
    "港区": "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-spider/main/screenshots/%E6%B8%AF%E5%8C%BA.png",
    "名东区": "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-spider/main/screenshots/%E5%90%8D%E6%9D%B1%E5%8C%BA.png",
    "守山区": "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-spider/main/screenshots/%E5%AE%88%E5%B1%B1%E5%8C%BA.png",
    "天白区": "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-spider/main/screenshots/%E5%A4%A9%E7%99%BD%E5%8C%BA.png",
    "千種区": "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-spider/main/screenshots/%E5%8D%83%E7%A7%91%E5%8C%BA.png",
    "中村区": "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-spider/main/screenshots/%E4%B8%AD%E6%9D%91%E5%8C%BA.png",
    "中川区": "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-spider/main/screenshots/%E4%B8%AD%E5%B7%9D%E5%8C%BA.png",
}

# 默认截图
DEFAULT_SCREENSHOT = "https://raw.githubusercontent.com/luweiy1321/nagoya-realtor-spider/main/screenshots/nagoya_all.png"

# 读取CSV
rows = []
with open('nagoya_properties.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

print(f"共 {len(rows)} 条")

for row in rows:
    address = row.get('address', '')
    
    # 提取区域
    area = ""
    for key in AREA_SCREENSHOTS:
        if key in address:
            area = key
            break
    
    if area and area in AREA_SCREENSHOTS:
        row['image_url'] = AREA_SCREENSHOTS[area]
    else:
        row['image_url'] = DEFAULT_SCREENSHOT

# 保存
with open('nagoya_properties_suumo.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print("完成！")
