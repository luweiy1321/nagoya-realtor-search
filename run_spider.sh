#!/bin/bash
# 名古屋房产爬虫定时任务脚本

# 进入脚本目录
cd ~/nagoya-realtor-spider

# 激活虚拟环境（如果有）
# source venv/bin/activate

# 运行爬虫
python3 nagoya_property_spider.py

# 提交并推送到GitHub
git add nagoya_properties.csv nagoya_properties.json
git commit -m "Update properties $(date '+%Y-%m-%d %H:%M')"
git push origin main

echo "完成！$(date)"
