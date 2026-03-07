#!/usr/bin/env python3
"""
Selenium图片爬虫 - 修复版
"""

import csv
import time
import random
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import TimeoutException

def get_driver():
    """配置Chrome驱动"""
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--remote-debugging-port=9222')
    options.add_argument('--user-data-dir=/tmp/chrome-profile')
    options.binary_location = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    
    service = Service(os.path.expanduser('~/bin/chromedriver'), log_path='/tmp/chromedriver.log')
    return webdriver.Chrome(service=service, options=options)

def scrape_from_suumo(address):
    """从SUUMO搜索获取图片"""
    driver = get_driver()
    image_url = ""
    
    try:
        query = address.replace('愛知県', '').replace('名古屋市', '名古屋')
        url = f"https://suumo.jp/chintai/aichi/{query}/"
        
        driver.get(url)
        time.sleep(5)
        
        # 找房源详情图
        thumb_images = driver.find_elements(By.CSS_SELECTOR, "img[src*='Thumbnail']")
        for img in thumb_images[:3]:
            src = img.get_attribute('src')
            if src and ('jpg' in src.lower() or 'png' in src.lower()):
                image_url = src
                break
        
        # 如果没找到，尝试其他选择器
        if not image_url:
            all_imgs = driver.find_elements(By.CSS_SELECTOR, "div.cassette img, section.cassette img")
            for img in all_imgs[:3]:
                src = img.get_attribute('src')
                if src and 'suumo' in src and ('jpg' in src.lower() or 'png' in src.lower()):
                    image_url = src
                    break
        
        if image_url:
            print(f"  ✓ 找到")
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
    
    if row.get('image_url') and len(row.get('image_url', '')) > 20 and 'unsplash' not in row.get('image_url', ''):
        success += 1
        continue
    
    address = row.get('address', '')
    
    if address:
        img = scrape_from_suumo(address)
        if img:
            row['image_url'] = img
            success += 1
        else:
            row['image_url'] = random.choice(FALLBACK)
    else:
        row['image_url'] = random.choice(FALLBACK)
    
    time.sleep(2)

with open('nagoya_properties_suumo.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print(f"\n完成！成功 {success} 张")
