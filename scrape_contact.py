#!/usr/bin/env python3
"""
从SUUMO获取房源联系人信息
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

def get_contact(address):
    driver = get_driver()
    contact = ""
    phone = ""
    
    try:
        query = address.replace('愛知県', '').replace('名古屋市', 'Nagoya')
        url = f"https://suumo.jp/chintai/aichi/nagoya_{query}/"
        
        driver.get(url)
        time.sleep(3)
        
        # 找房源详情链接
        links = driver.find_elements(By.CSS_SELECTOR, "a[href*='/chintai/']")
        for link in links[:3]:
            href = link.get_attribute('href')
            if href and 'detail' in href:
                driver.get(href)
                time.sleep(3)
                break
        
        # 找电话
        try:
            tel = driver.find_element(By.CSS_SELECTOR, "a[href^='tel:'], span:contains('TEL')")
            phone = tel.get_attribute('href') or tel.text
        except:
            pass
        
        # 找担当姓名
        try:
            name = driver.find_element(By.CSS_SELECTOR, "td:contains('担当者'), .staff-name")
            contact = name.text
        except:
            pass
            
    except Exception as e:
        print(f"  错误: {e}")
    finally:
        driver.quit()
    
    return contact, phone

# 读取CSV
rows = []
with open('nagoya_properties.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

print(f"共 {len(rows)} 条")

# 添加新列
for r in rows:
    if 'contact' not in r:
        r['contact'] = ''
    if 'phone' not in r:
        r['phone'] = ''

success = 0
for i, row in enumerate(rows):
    if i >= 10:
        break
    
    print(f"[{i+1}/10] {row.get('title_ja', '')[:25]}...")
    
    address = row.get('address', '')
    
    if address:
        contact, phone = get_contact(address)
        if contact:
            row['contact'] = contact
            print(f"  ✓ 联系人: {contact}")
        if phone:
            row['phone'] = phone
            print(f"  ✓ 电话: {phone}")
    
    time.sleep(2)

# 保存
with open('nagoya_properties_contact.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print("\n完成！")
