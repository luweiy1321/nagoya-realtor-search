#!/bin/bash
# 名古屋房产爬虫 - 使用curl

echo "=== 名古屋房产爬虫 ==="

# 获取列表页
echo "步骤1: 获取列表页..."
curl -s -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
  "https://suumo.jp/chintai/aichi/nagoya/" > list.html

echo "步骤2: 提取详情链接..."
# 使用egrep
egrep -o 'href="[^"]*detail[^"]*"' list.html | sed 's/href="//' | sed 's/"$//' | head -20 > links.txt

LINK_COUNT=$(wc -l < links.txt)
echo "找到 $LINK_COUNT 个链接"

# 逐个获取详情
for i in $(seq 1 $LINK_COUNT); do
  LINK=$(sed -n "${i}p" links.txt)
  
  if [ -z "$LINK" ]; then
    continue
  fi
  
  echo "获取 $i/$LINK_COUNT"
  
  # 加上域名
  if [[ "$LINK" == /* ]]; then
    LINK="https://suumo.jp$LINK"
  fi
  
  # 获取详情页
  curl -s -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
    -H "Accept-Language: ja,en-US;q=0.9" \
    "$LINK" > "pages/detail_$i.html"
  
  # 随机延时
  sleep 2
  
  echo "  完成"
done

echo "完成!"
