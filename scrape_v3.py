#!/usr/bin/env python3
"""
SUUMO图片爬虫 - 改进版
"""

import csv
import time
import random
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

def get_driver():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1920,1080')
    options.binary_location = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    service = Service(os.path.expanduser('~/bin/chromedriver'))
    return webdriver.Chrome(service=service, options=options)

def scrape_from_suumo(address):
    driver = get_driver()
    image_url = ""
    
    try:
        # 用地址搜索
        query = address.replace('愛知県', '').replace('名古屋市', 'Nagoya')
        url = f"https://suumo.jp/chintai/aichi/nagoya_{query}/"
        
        driver.get(url)
        time.sleep(3)
        
        # 找房源列表中的图片
        # 方法1: 找cassette内的小图
        cassettes = driver.find_elements(By.CSS_SELECTOR, "div.cassette")
        for cassette in cassettes[:2]:
            imgs = cassette.find_elements(By.CSS_SELECTOR, "img")
            for img in imgs:
                src = img.get_attribute('src')
                if src and 'suumo.jp' in src and ('.jpg' in src.lower() or '.png' in src.lower() or '.jpeg' in src.lower()):
                    if 'logo' not in src.lower() and 'icon' not in src.lower():
                        image_url = src
                        break
            if image_url:
                break
        
        if image_url:
            print(f"  ✓ 找到房源图")
        else:
            print("  ✗ 没找到")
            
    except Exception as e:
        print(f"  错误: {e}")
    finally:
        driver.quit()
    
    return image_url

FALLBACK = [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
]

rows = []
with open('nagoya_properties.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

print(f"共 {len(rows)} 条")

success = 0
for i, row in enumerate(rows):
    if i >= 10:
        break
    
    print(f"[{i+1}/10] {row.get('title_ja', '')[:25]}...")
    
    # 已有真实图片跳过
    if row.get('image_url') and len(row.get('image_url', '')) > 20 and 'suumo' in row.get('image_url', '') and 'logo' not in row.get('image_url', ''):
        print("  已有真实图")
        success += 1
        continue
    
    address = row.get('address', '')
    
    if address:
        img = scrape_from_suumo(address)
        if img and 'logo' not in img.lower():
            row['image_url'] = img
            success += 1
        else:
            row['image_url'] = random.choice(FALLBACK)
    else:
        row['image_url'] = random.choice(FALLBACK)
    
    time.sleep(1)

with open('nagoya_properties_suumo2.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print(f"\n完成！成功 {success} 张")
