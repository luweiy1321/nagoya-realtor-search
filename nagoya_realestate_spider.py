#!/usr/bin/env python3
"""
名古屋不动产公司爬虫
需要安装: pip install requests beautifulsoup4 selenium
"""

import requests
from bs4 import BeautifulSoup
import json
import time

def scrape_suumo():
    """从SUUMO爬取名古屋不动产公司"""
    url = "https://suumo.jp/kaisha/aichi/sa_nagoya/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    companies = []
    
    print("正在获取名古屋不动产公司信息...")
    
    # 尝试获取页面
    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.encoding = 'utf-8'
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 查找公司列表 (可能需要JavaScript渲染，建议用Selenium)
        print("注意: SUUMO使用动态加载，建议使用 Selenium 版本")
        
    except Exception as e:
        print(f"请求失败: {e}")
    
    return companies

def scrape_homes():
    """从HOMES爬取"""
    url = "https://www.homes.co.jp/realtor/aichi/nagoya-mcity/list/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
    
    print("\n正在从HOMES获取...")
    
    try:
        response = requests.get(url, headers=headers, timeout=30)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 查找公司信息
        items = soup.select('.buildingListItem, .companyItem, .cassettefly')
        
        for item in items[:20]:  # 先取20个
            name = item.get_text(strip=True)[:100]
            if name:
                print(f"  - {name}")
                
    except Exception as e:
        print(f"HOMES获取失败: {e}")
    
    return []

def scrape_with_selenium():
    """Selenium版本 - 需要安装chromedriver"""
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    
    print("\n使用Selenium版本...")
    
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    
    driver = webdriver.Chrome(options=options)
    
    companies = []
    
    try:
        # 访问SUUMO
        driver.get("https://suumo.jp/kaisha/aichi/sa_nagoya/")
        
        # 等待加载
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "cassettefly"))
        )
        
        # 获取公司元素
        elements = driver.find_elements(By.CSS_SELECTOR, ".cassettefly a")
        
        for elem in elements[:50]:
            try:
                name = elem.text.strip()
                link = elem.get_attribute('href')
                if name and len(name) < 100:
                    companies.append({
                        'name': name,
                        'url': link
                    })
            except:
                continue
        
        print(f"获取到 {len(companies)} 家公司")
        
        for c in companies[:10]:
            print(f"  - {c['name']}")
            
    except Exception as e:
        print(f"Selenium出错: {e}")
    finally:
        driver.quit()
    
    return companies

def save_to_file(companies, filename="nagoya_realestate.json"):
    """保存到文件"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(companies, f, ensure_ascii=False, indent=2)
    print(f"\n已保存到 {filename}")

if __name__ == "__main__":
    print("=" * 50)
    print("名古屋不动产公司爬虫")
    print("=" * 50)
    
    # 简单版本
    scrape_suumo()
    scrape_homes()
    
    # Selenium版本（需要更多依赖）
    # companies = scrape_with_selenium()
    # if companies:
    #     save_to_file(companies)
    
    print("\n完成!")
    print("\n如需更完整的爬取，请安装:")
    print("  pip install selenium")
    print("  并下载 chromedriver")
