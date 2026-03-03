#!/bin/bash
# 名古屋房产图片爬虫 - 需要在Mac上运行
# 先安装: brew install chromedriver selenium-server-standalone

echo "========================================"
echo "名古屋房产图片爬虫"
echo "========================================"

# 检查依赖
if ! command -v chromedriver &> /dev/null; then
    echo "请先安装 chromedriver:"
    echo "  brew install chromedriver"
    exit 1
fi

# 安装Python依赖
pip3 install selenium requests pillow > /dev/null 2>&1

python3 << 'PYTHON'
import csv
import time
import random
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def get_driver():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    return webdriver.Chrome(options=options)

# 读取CSV
input_file = 'nagoya_properties.csv'
output_file = 'nagoya_properties_images.csv'

rows = []
with open(input_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

print(f"共 {len(rows)} 条房源")

# 处理每条
for i, row in enumerate(rows[:20]):  # 先处理20条测试
    print(f"[{i+1}/20] {row.get('title_ja', '')[:40]}...")
    
    # 如果有图片就跳过
    if row.get('image_url') and len(row.get('image_url', '')) > 10:
        print("  已有图片")
        continue
    
    address = row.get('address', '')
    title = row.get('title_ja', '')
    
    if not address:
        continue
    
    # 用Google图片搜索
    driver = get_driver()
    try:
        query = f"{address} 物件"
        url = f"https://www.google.com/search?q={requests.utils.quote(query)}&tbm=isch"
        driver.get(url)
        time.sleep(2)
        
        imgs = driver.find_elements(By.CSS_SELECTOR, 'img.Q4LuWd')
        if imgs:
            img_src = imgs[0].get_attribute('src')
            if img_src and img_src.startswith('http'):
                row['image_url'] = img_src
                print(f"  ✓ 获取图片成功")
    except Exception as e:
        print(f"  ✗ 失败: {e}")
    finally:
        driver.quit()
    
    time.sleep(random.uniform(1, 2))

# 保存
with open(output_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print(f"\n完成！保存到 {output_file}")
PYTHON
