#!/usr/bin/env python3
"""
从SUUMO保存更多房源截图 - 按区域
"""

import os
import time
from selenium import webdriver
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

# 名古屋各区域
areas = [
    ("https://suumo.jp/chintai/aichi/nagoya/ek_01330/", "中区"),
    ("https://suumo.jp/chintai/aichi/nagoya/ek_01290/", "中区栄"),
    ("https://suumo.jp/chintai/aichi/nagoya/ek_01160/", "东区"),
    ("https://suumo.jp/chintai/aichi/nagoya/ek_01180/", "南区"),
    ("https://suumo.jp/chintai/aichi/nagoya/ek_01170/", "西区"),
    ("https://suumo.jp/chintai/aichi/nagoya/ek_01200/", "北区"),
    ("https://suumo.jp/chintai/aichi/nagoya/ek_01190/", "昭和区"),
    ("https://suumo.jp/chintai/aichi/nagoya/ek_01210/", "瑞穂区"),
    ("https://suumo.jp/chintai/aichi/nagoya/ek_01220/", "熱田区"),
    ("https://suumo.jp/chintai/aichi/nagoya/ek_01230/", "港区"),
]

os.makedirs(OUTPUT_DIR, exist_ok=True)
driver = setup_driver()

for url, name in areas:
    print(f"访问 {name}...")
    try:
        driver.get(url)
        time.sleep(3)
        filename = f"{OUTPUT_DIR}/{name}.png"
        driver.save_screenshot(filename)
        print(f"  ✓ 保存: {name}.png")
    except Exception as e:
        print(f"  ✗ 错误: {e}")
    time.sleep(2)

driver.quit()
print("\n完成！")
