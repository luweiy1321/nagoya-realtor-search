#!/usr/bin/env python3
"""
名古屋房产图片爬虫 - 使用Selenium
在Mac上运行: python3 scrape_images.py
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
import requests

def get_chrome_driver():
    """配置Chrome驱动"""
    options = Options()
    options.add_argument('--headless')  # 无头模式
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    options.add_argument('--accept-lang=ja,en-US;q=0.9,en;q=0.8')
    return webdriver.Chrome(options=options)

def search_image_on_google(address, title):
    """用Google图片搜索获取房源图片"""
    search_query = f"{address} {title} apartment"
    search_url = f"https://www.google.com/search?q={requests.utils.quote(search_query)}&tbm=isch"
    
    driver = get_chrome_driver()
    image_url = ""
    
    try:
        driver.get(search_url)
        time.sleep(2)
        
        # 等待图片加载
        images = driver.find_elements(By.CSS_SELECTOR, 'img.Q4LuWd')
        if images:
            # 获取第一张图片的src
            image_url = images[0].get_attribute('src')
            print(f"  找到图片: {image_url[:50]}...")
    except Exception as e:
        print(f"  Google图片搜索失败: {e}")
    finally:
        driver.quit()
    
    return image_url

def scrape_images_from_csv(input_file, output_file):
    """从CSV读取房源信息，尝试爬取图片"""
    print("=" * 60)
    print("开始爬取房源图片...")
    print("=" * 60)
    
    # 读取CSV
    rows = []
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    
    print(f"共 {len(rows)} 条房源")
    
    # 处理每条记录
    for i, row in enumerate(rows):
        if i >= 10:  # 先测试10条
            break
            
        print(f"\n[{i+1}/{min(10, len(rows))}] 处理: {row.get('title_ja', '')[:30]}...")
        
        # 如果已经有图片，跳过
        if row.get('image_url') and row.get('image_url').startswith('http'):
            print("  已有图片，跳过")
            continue
        
        # 获取地址和标题
        address = row.get('address', '')
        title = row.get('title_ja', '')
        
        if address or title:
            # 用Google图片搜索
            image_url = search_image_on_google(address, title)
            row['image_url'] = image_url
        
        # 随机延时，避免被封
        time.sleep(random.uniform(1, 3))
    
    # 保存结果
    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    
    print("\n" + "=" * 60)
    print(f"完成！结果已保存到 {output_file}")
    print("=" * 60)

if __name__ == '__main__':
    scrape_images_from_csv('nagoya_properties.csv', 'nagoya_properties_with_images.csv')
