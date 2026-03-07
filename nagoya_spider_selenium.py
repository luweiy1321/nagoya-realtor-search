#!/usr/bin/env python3
"""
名古屋不动产公司 Selenium 爬虫
需要安装: pip install selenium webdriver-manager beautifulsoup4
"""

import time
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import sys

def get_driver():
    """获取Chrome driver"""
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
    except:
        driver = webdriver.Chrome(options=options)
    
    return driver

def scrape_suumo():
    """从SUUMO爬取名古屋不动产公司"""
    print("=" * 60)
    print("爬取 SUUMO...")
    print("=" * 60)
    
    driver = get_driver()
    companies = []
    
    try:
        url = "https://suumo.jp/kaisha/aichi/sa_nagoya/"
        driver.get(url)
        
        # 等待页面加载
        time.sleep(3)
        
        # 滚动加载更多
        for _ in range(3):
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)
        
        # 获取页面源码
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        
        # 查找公司列表 (SUUMO的结构)
        items = soup.select('div.cassettefly, div.searchobject, a.linkTenant')
        
        print(f"找到 {len(items)} 个元素")
        
        for item in items[:100]:
            try:
                name_elem = item.select_one('a, div.ui-text--midium, div.title')
                tel_elem = item.select_one('span.telnumber, div.tel')
                
                name = name_elem.get_text(strip=True) if name_elem else ""
                tel = tel_elem.get_text(strip=True) if tel_elem else ""
                
                if name and len(name) < 100:
                    companies.append({
                        'name': name,
                        'phone': tel,
                        'source': 'SUUMO'
                    })
                    print(f"  ✓ {name}")
            except:
                continue
                
    except Exception as e:
        print(f"SUUMO 错误: {e}")
    finally:
        driver.quit()
    
    return companies

def scrape_homes():
    """从HOMES爬取"""
    print("\n" + "=" * 60)
    print("爬取 HOMES...")
    print("=" * 60)
    
    driver = get_driver()
    companies = []
    
    try:
        url = "https://www.homes.co.jp/realtor/aichi/nagoya-mcity/list/"
        driver.get(url)
        time.sleep(3)
        
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        
        # HOMES 结构
        items = soup.select('div.bdlItem, div.shopBox, a.shopItem')
        
        for item in items[:100]:
            name = item.get_text(strip=True)[:100]
            if name:
                companies.append({
                    'name': name,
                    'phone': '',
                    'source': 'HOMES'
                })
                print(f"  ✓ {name}")
                
    except Exception as e:
        print(f"HOMES 错误: {e}")
    finally:
        driver.quit()
    
    return companies

def scrape_atpress():
    """从atpress爬取新闻稿"""
    print("\n" + "=" * 60)
    print("爬取 atpress 新闻稿...")
    print("=" * 60)
    
    import requests
    
    companies = []
    
    # 搜索不动产公司的新闻稿
    keywords = ['名古屋', '不動産', '株式会社']
    
    for keyword in keywords:
        url = f"https://www.atpress.ne.jp/news/search?q={keyword}"
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
            response = requests.get(url, headers=headers, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            items = soup.select('div.newsContent, h3.title, a[href*="/news/"]')
            
            for item in items[:20]:
                title = item.get_text(strip=True)
                if '不動産' in title or '賃貸' in title:
                    print(f"  ✓ {title[:50]}")
                    companies.append({
                        'name': title,
                        'phone': '',
                        'source': 'atpress'
                    })
        except Exception as e:
            print(f"  错误: {e}")
    
    return companies

def save_results(companies):
    """保存结果"""
    # 去重
    seen = set()
    unique = []
    for c in companies:
        key = c['name'][:20]
        if key not in seen:
            seen.add(key)
            unique.append(c)
    
    # 保存JSON
    with open('nagoya_realtor_companies.json', 'w', encoding='utf-8') as f:
        json.dump(unique, f, ensure_ascii=False, indent=2)
    
    # 保存CSV
    import csv
    with open('nagoya_realtor_companies.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['name', 'phone', 'source'])
        writer.writeheader()
        writer.writerows(unique)
    
    print(f"\n✓ 已保存 {len(unique)} 家公司到:")
    print("  - nagoya_realtor_companies.json")
    print("  - nagoya_realtor_companies.csv")
    
    return unique

def main():
    print("名古屋不动产公司爬虫 - Selenium版本")
    print("=" * 60)
    print("开始爬取...")
    print()
    
    all_companies = []
    
    # 爬取各个网站
    all_companies.extend(scrape_suumo())
    all_companies.extend(scrape_homes())
    all_companies.extend(scrape_atpress())
    
    # 保存结果
    if all_companies:
        unique = save_results(all_companies)
        
        print("\n" + "=" * 60)
        print("爬取完成!")
        print("=" * 60)
        print(f"总共获取: {len(unique)} 家公司")
    else:
        print("未能获取到任何数据")
        print("\n可能原因:")
        print("1. 需要安装Chrome浏览器")
        print("2. 需要运行: pip install selenium webdriver-manager")
        print("3. 网站结构可能已变化")

if __name__ == "__main__":
    main()
