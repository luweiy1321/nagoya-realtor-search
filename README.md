# 名古屋房产搜索爬虫 (合规版)

## 项目目标
通过搜索引擎和网页抓取获取名古屋地区租房信息，合法合规地收集公开数据。

## 法律说明

### ✅ 合规方式
- 使用搜索引擎（Google/Bing）获取网站索引
- 抓取允许爬取的公开网页内容
- 通过网站提供的API获取数据（如有）
- 遵守 robots.txt 规定

### ⚠️ 风险方式（不推荐）
- 绕过反爬措施强行抓取
- 大规模自动化抓取
- 抓取明确禁止爬取的网站
- 使用虚假身份获取数据

## 数据来源

| 网站 | 状态 | 说明 |
|------|------|------|
| CHINTAI (chintai.net) | ✅ 可用 | 需要通过搜索间接获取 |
| Yahoo!不动产 | ✅ 可用 | 页面内容可直接抓取 |
| ホームメイト | ⚠️ 部分 | 主要是搜索条件页 |
| SUUMO | ✅ 可用 | 通过搜索获取URL后直接抓取搜索结果页 |
| HOMES | ❌ 被拦截 | CloudFlare防护 |
| at-home | ❌ 被拦截 | CloudFlare防护 |

## 使用方法

### 1. 直接使用现有数据
```bash
# 查看CSV数据
cat nagoya_properties.csv

# 查看详细文档
cat 房源详情.md
```

### 2. 运行爬虫程序
```bash
# 需要先安装chromedp
go mod tidy
go run main.go
```

## 输出文件

- `nagoya_all_properties.csv` - 合并后的全部数据 (21条)
- `nagoya_properties.csv` - CHINTAI + Yahoo数据
- `nagoya_properties_suumo.csv` - SUUMO数据
- `房源详情.md` - 详细文档

## 技术栈

- Go + chromedp
- web_search (Brave API)
- web_fetch (网页内容提取)

## 更新日期
2026年3月6日
