#!/usr/bin/env python3
"""
名古屋房产爬虫 - 模拟真人操作
"""

import csv
import time
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
import os

def get_driver():
    """创建浏览器"""
    options = Options()
    options.add_argument('--disable-blink-features=Automation')
    options.add_argument('--headless=new')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--start-maximized')
    # 随机User-Agent
    options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    options.binary_location = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    service = Service(os.path.expanduser('~/bin/chromedriver'))
    return webdriver.Chrome(service=service, options=options)

def human_delay(min_sec=2, max_sec=5):
    """模拟人类随机延时"""
    time.sleep(random.uniform(min_sec, max_sec))

def human_scroll(driver):
    """模拟人类滚动"""
    for _ in range(random.randint(2, 4)):
        scroll_amount = random.randint(200, 500)
        driver.execute_script(f"window.scrollBy(0, {scroll_amount})")
        human_delay(1, 2)

def main():
    print("=== 名古屋房产爬虫 ===")
    
    driver = get_driver()
    
    try:
        # 访问SUUMO
        print("访问SUUMO...")
        driver.get("https://suumo.jp/chintai/aichi/nagoya/")
        human_delay(5, 8)
        
        # 模拟滚动
        print("模拟滚动...")
        human_scroll(driver)
        
        # 获取房源链接
        links = driver.find_elements(By.CSS_SELECTOR, 'a[href*="detail"]')
        property_links = [l.get_attribute('href') for l in links[:15] if l.get_attribute('href') and 'detail' in l.get_attribute('href')]
        
        print(f"找到 {len(property_links)} 个房源")
        
        properties = []
        
        for i, link in enumerate(property_links[:5]):  # 先测试5个
            print(f"访问 {i+1}/{len(property_links[:5])}")
            
            driver.get(link)
            human_delay(3, 6)
            
            # 获取页面信息
            try:
                title = driver.title
                
                # 尝试获取价格
                try:
                    price_elem = driver.find_element(By.CSS_SELECTOR, '[class*="price"]')
                    price = price_elem.text
                except:
                    price = "N/A"
                
                # 获取文本内容
                body_text = driver.find_element(By.TAG_NAME, 'body').text
                
                # 提取价格
                import re
                price_match = re.search(r'[\d,.]+万円', body_text)
                if price_match:
                    price = price_match.group()
                
                properties.append({
                    'ID': str(i+1),
                    'Source': 'suumo',
                    'Title': title[:100],
                    'Price': price,
                    'DetailURL': link,
                    'ScrapedAt': time.strftime('%Y-%m-%d %H:%M:%S')
                })
                
                print(f"  ✓ {price}")
                
            except Exception as e:
                print(f"  ✗ {e}")
            
            # 返回列表页
            driver.get("https://suumo.jp/chintai/aichi/nagoya/")
            human_delay(3, 7)
        
        # 保存
        with open('properties.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=['ID', 'Source', 'Title', 'Price', 'DetailURL', 'ScrapedAt'])
            writer.writeheader()
            writer.writerows(properties)
        
        print(f"\n完成! 共 {len(properties)} 条")
        
    finally:
        driver.quit()

if __name__ == '__main__':
    main()
