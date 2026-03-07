#!/usr/bin/env python3
"""
Selenium图片爬虫 - 从SUUMO获取真实房源图片
需要: brew install chromedriver
"""

import csv
import time
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

def get_driver():
    """配置Chrome驱动"""
    options = Options()
    options.add_argument('--headless')  # 无头模式
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    options.binary_location = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    from selenium.webdriver.chrome.service import Service
    service = Service('/opt/homebrew/bin/chromedriver')
    return webdriver.Chrome(service=service, options=options)

def scrape_from_suumo(address):
    """从SUUMO搜索获取图片"""
    driver = get_driver()
    image_url = ""
    
    try:
        # 构造搜索URL - 名古屋+地址
        query = address.replace('愛知県', '').replace('名古屋市', '名古屋')
        url = f"https://suumo.jp/chintai/aichi/{query}/"
        
        driver.get(url)
        time.sleep(3)
        
        # 等待页面加载
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "img"))
            )
        except:
            pass
        
        # 找图片
        images = driver.find_elements(By.CSS_SELECTOR, "img[src*='suumo.jp']")
        for img in images[:3]:  # 取前3张
            src = img.get_attribute('src')
            if src and 'jpg' in src.lower():
                image_url = src
                break
        
        if image_url:
            print(f"  ✓ 找到: {image_url[:50]}...")
        else:
            print("  ✗ 没找到图片")
            
    except Exception as e:
        print(f"  错误: {e}")
    finally:
        driver.quit()
    
    return image_url

# 备用图片
FALLBACK = [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
]

# 读取CSV
input_file = 'nagoya_properties.csv'
output_file = 'nagoya_properties_real_images.csv'

rows = []
with open(input_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

print(f"共 {len(rows)} 条房源")

# 处理
success = 0
for i, row in enumerate(rows):
    if i >= 20:  # 先测试20条
        break
    
    print(f"[{i+1}/20] {row.get('title_ja', '')[:30]}...")
    
    # 如果有图片就跳过
    if row.get('image_url') and len(row.get('image_url', '')) > 20:
        if 'unsplash' not in row.get('image_url', ''):
            success += 1
            continue
    
    address = row.get('address', '')
    
    if address:
        # 尝试从SUUMO获取
        img = scrape_from_suumo(address)
        if img:
            row['image_url'] = img
            success += 1
        else:
            # 用备用
            row['image_url'] = random.choice(FALLBACK)
    else:
        row['image_url'] = random.choice(FALLBACK)
    
    time.sleep(random.uniform(2, 4))

# 保存
with open(output_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print(f"\n完成！成功获取 {success} 张真实图片")
print(f"保存到 {output_file}")
