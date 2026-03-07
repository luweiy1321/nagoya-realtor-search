#!/usr/bin/env python3
"""
从SUUMO保存房源截图
"""

import os
import time
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

OUTPUT_DIR = "screenshots"

def setup_driver():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')
    options.binary_location = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    service = Service(os.path.expanduser('~/bin/chromedriver'))
    return webdriver.Chrome(service=service, options=options)

def save_screenshot(driver, url, filename):
    try:
        driver.get(url)
        time.sleep(3)
        
        # 保存截图
        driver.save_screenshot(f"{OUTPUT_DIR}/{filename}")
        print(f"  ✓ 保存: {filename}")
        return True
    except Exception as e:
        print(f"  ✗ 错误: {e}")
        return False

# 创建输出目录
os.makedirs(OUTPUT_DIR, exist_ok=True)

driver = setup_driver()

# 测试几个房源URL
test_urls = [
    ("https://suumo.jp/chintai/aichi/nagoya/ek_01330/", "nagoya_central.png"),
    ("https://suumo.jp/chintai/aichi/nagoya/ek_01290/", "kanayama.png"),
    ("https://suumo.jp/chintai/aichi/nagoya/city/", "nagoya_all.png"),
]

for url, filename in test_urls:
    print(f"访问: {url}")
    save_screenshot(driver, url, filename)
    time.sleep(2)

driver.quit()
print("\n完成！")
