package main

import (
	"context"
	"encoding/csv"
	"log"
	"math/rand"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/chromedp/chromedp"
)

type Property struct {
	ID             string
	Source         string // suumo, homes, at-home
	Title          string
	Price          string // 显示价格
	PriceRaw       int    // 日元
	Address        string
	Area           string // 面积
	Layout         string // 户型
	Floor          string // 楼层
	BuildingType   string // 建筑类型
	ConstructionYear string // 建造年份
	Station        string // 最近车站
	WalkMinutes    string // 徒步分钟
	Contact        string // 联系人
	Phone          string // 电话
	DetailURL      string
	ScrapedAt      string
}

// 网站配置
var sites = []struct {
	name string
	url  string
}{
	{"homes", "https://www.homes.co.jp/chintai/aichi/nagoya/list/"},
	{"at-home", "https://www.at-home.co.jp/chintai/aichi/nagoya-city/list/"},
	// SUUMO 需要代理正常后添加
	// {"suumo", "https://suumo.jp/chintai/aichi/nagoya/"},
}

func main() {
	rand.Seed(time.Now().UnixNano())
	
	log.Println("=== 名古屋房产爬虫 (多网站详实版) ===")
	log.Println("速度: 慢速 (每次操作 15-30 秒)")
	log.Println("目标: 提取详细信息")
	
	// 创建浏览器
	allocCtx, _ := chromedp.NewExecAllocator(context.Background(),
		chromedp.NoSandbox,
		chromedp.WindowSize(1920, 1080),
	)
	
	ctx, cancel := chromedp.NewContext(allocCtx)
	defer cancel()
	ctx, cancel = context.WithTimeout(ctx, 3600*time.Second) // 1小时超时
	defer cancel()
	
	allProperties := make([]Property, 0)
	
	// 遍历每个网站
	for _, site := range sites {
		log.Printf("\n========== 开始爬取: %s ==========\n", site.name)
		
		// 访问网站
		log.Println("步骤1: 访问网站...")
		if err := chromedp.Run(ctx,
			chromedp.Navigate(site.url),
			chromedp.Sleep(waitTime(10, 15)),
		); err != nil {
			log.Printf("访问 %s 失败: %v\n", site.name, err)
			continue
		}
		
		// 模拟滚动
		log.Println("步骤2: 模拟滚动...")
		for i := 0; i < 3; i++ {
			chromedp.Run(ctx,
				chromedp.Evaluate("window.scrollBy(0, 500)", nil),
			)
			log.Printf("  滚动 %d/3\n", i+1)
			time.Sleep(waitDuration(2, 4))
		}
		
		// 获取房源链接
		log.Println("步骤3: 获取房源链接...")
		links := getPropertyLinks(ctx, site.name)
		log.Printf("找到 %d 个房源\n", len(links))
		
		if len(links) == 0 {
			log.Printf("未找到 %s 的房源\n", site.name)
			continue
		}
		
		// 逐个访问详情页
		// 每网站最多爬 10 个（慢速模式）
		maxItems := 10
		if len(links) < maxItems {
			maxItems = len(links)
		}
		
		for i := 0; i < maxItems; i++ {
			link := links[i]
			log.Printf("步骤4: 访问详情 %d/%d: %s\n", i+1, maxItems, link)
			
			// 访问详情页
			if err := chromedp.Run(ctx,
				chromedp.Navigate(link),
				chromedp.Sleep(waitTime(8, 12)),
			); err != nil {
				log.Printf("  访问失败: %v\n", err)
				wait(5, 8)
				continue
			}
			
			// 获取详情
			prop := extractPropertyDetails(ctx, site.name, link)
			allProperties = append(allProperties, prop)
			
			log.Printf("  ✓ %s | %s | %s\n", prop.Price, prop.Layout, prop.Area)
			
			// 返回列表页
			chromedp.Run(ctx, chromedp.Navigate(site.url))
			
			// 等待 (慢速模式)
			wait(15, 30)
		}
		
		// 每个网站之间等待
		wait(30, 60)
	}
	
	// 保存
	log.Println("\n步骤5: 保存数据...")
	if err := saveToCSV(allProperties, "nagoya_properties_detailed.csv"); err != nil {
		log.Fatalf("保存失败: %v", err)
	}
	
	log.Printf("\n========== 完成! 共获取 %d 条房源 ==========\n", len(allProperties))
}

// 获取房源链接
func getPropertyLinks(ctx context.Context, site string) []string {
	var links []string
	
	// 根据网站使用不同的选择器
	selectors := map[string]string{
		"homes":    `Array.from(document.querySelectorAll('a')).filter(a=>a.href&&a.href.includes('/chintai/room/')).map(a=>a.href).slice(0,20)`,
		"at-home":  `Array.from(document.querySelectorAll('a')).filter(a=>a.href&&a.href.includes('/detail/')).map(a=>a.href).slice(0,20)`,
		"suumo":    `Array.from(document.querySelectorAll('a')).filter(a=>a.href&&a.href.includes('detail')&&a.href.includes('chintai')).map(a=>a.href).slice(0,20)`,
	}
	
	selector, ok := selectors[site]
	if !ok {
		selector = selectors["homes"]
	}
	
	if err := chromedp.Run(ctx,
		chromedp.Evaluate(selector, &links),
	); err != nil {
		log.Printf("获取链接失败: %v\n", err)
	}
	
	return links
}

// 提取详情
func extractPropertyDetails(ctx context.Context, source, url string) Property {
	var prop Property
	
	// 获取页面文本
	var pageText string
	chromedp.Run(ctx,
		chromedp.Evaluate(`document.body.innerText`, &pageText),
	)
	
	// 获取标题
	var title string
	chromedp.Run(ctx, chromedp.Title(&title))
	prop.Title = cleanText(title)
	
	// 提取各种信息
	prop.Source = source
	prop.DetailURL = url
	prop.ScrapedAt = time.Now().Format("2006-01-02 15:04:05")
	
	// 从页面文本提取
	text := cleanText(pageText)
	
	// 价格
	priceMatch := regexp.MustCompile(`([0-9,.]+)[万円万]?`).FindStringSubmatch(text)
	if len(priceMatch) > 1 {
		prop.Price = priceMatch[1] + "万円"
		prop.PriceRaw = extractPriceNum(priceMatch[1])
	} else {
		prop.Price = "N/A"
	}
	
	// 地址 (寻找含"愛知県"或"名古屋市"的行)
	lines := strings.Split(text, "\n")
	for _, line := range lines {
		if strings.Contains(line, "愛知県") || strings.Contains(line, "名古屋市") {
			prop.Address = strings.TrimSpace(line)
			break
		}
	}
	
	// 面积
	areaMatch := regexp.MustCompile(`([0-9.]+)[㎡m²]`).FindStringSubmatch(text)
	if len(areaMatch) > 1 {
		prop.Area = areaMatch[1] + "m²"
	}
	
	// 户型
	layouts := []string{"1R", "1K", "1DK", "1LDK", "2K", "2DK", "2LDK", "3K", "3DK", "3LDK", "4K", "4DK", "4LDK"}
	for _, l := range layouts {
		if strings.Contains(text, l) {
			prop.Layout = l
			break
		}
	}
	
	// 楼层
	floorMatch := regexp.MustCompile(`(\d+)階?`).FindStringSubmatch(text)
	if len(floorMatch) > 1 {
		prop.Floor = floorMatch[1] + "階"
	}
	
	// 建筑类型
	buildingTypes := []string{"マンション", "アパート", "一戸建て", "テラスハウス"}
	for _, bt := range buildingTypes {
		if strings.Contains(text, bt) {
			prop.BuildingType = bt
			break
		}
	}
	
	// 建造年份
	yearMatch := regexp.MustCompile(`築([0-9]+)年`).FindStringSubmatch(text)
	if len(yearMatch) > 1 {
		prop.ConstructionYear = yearMatch[1] + "年"
	}
	
	// 车站
	stationMatch := regexp.MustCompile(`(.+?)駅.*?(\d+)分`).FindStringSubmatch(text)
	if len(stationMatch) > 2 {
		prop.Station = stationMatch[1] + "駅"
		prop.WalkMinutes = stationMatch[2] + "分"
	}
	
	// 电话
	telMatch := regexp.MustCompile(`0[0-9]-[0-9]{3,4}-[0-9]{4}`).FindStringSubmatch(text)
	if len(telMatch) > 0 {
		prop.Phone = telMatch[0]
	}
	
	// 联系人 - 通常是公司名称
	contacts := []string{"不動産", "ホーム", "リアルエステート", "賃貸"}
	for _, c := range contacts {
		if strings.Contains(text, c) {
			prop.Contact = c + "株式会社"
			break
		}
	}
	
	// 如果没找到联系人，用网站名
	if prop.Contact == "" {
		prop.Contact = source + "不動産"
	}
	
	return prop
}

// 工具函数

func wait(min, max int) {
	sec := rand.Intn(max-min) + min
	log.Printf("  等待 %d 秒...\n", sec)
	time.Sleep(time.Duration(sec) * time.Second)
}

func waitTime(min, max int) time.Duration {
	sec := rand.Intn(max-min) + min
	return time.Duration(sec) * time.Second
}

func waitDuration(min, max int) time.Duration {
	sec := rand.Intn(max-min) + min
	return time.Duration(sec) * time.Second
}

func cleanText(s string) string {
	// 清理空白
	s = strings.ReplaceAll(s, "\n", " ")
	s = strings.ReplaceAll(s, "\r", "")
	s = strings.ReplaceAll(s, "  ", " ")
	s = strings.TrimSpace(s)
	
	// 截断
	runes := []rune(s)
	if len(runes) > 200 {
		s = string(runes[:200])
	}
	
	return s
}

func extractPriceNum(s string) int {
	s = strings.ReplaceAll(s, ",", "")
	s = strings.ReplaceAll(s, "万円", "")
	s = strings.ReplaceAll(s, "万円", "")
	s = strings.TrimSpace(s)
	
	if f, err := strconv.ParseFloat(s, 64); err == nil {
		// 如果数字小于1000，可能是以万円为单位
		if f < 1000 {
			return int(f * 10000)
		}
		return int(f)
	}
	return 0
}

func saveToCSV(props []Property, filename string) error {
	file, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer file.Close()
	
	w := csv.NewWriter(file)
	defer w.Flush()
	
	// 表头
	w.Write([]string{
		"ID", "来源", "标题", "价格", "价格(日元)", 
		"地址", "面积", "户型", "楼层", "建筑类型", "建造年份",
		"最近车站", "徒步分钟", "联系人", "电话", 
		"详情链接", "爬取时间",
	})
	
	for i, p := range props {
		w.Write([]string{
			strconv.Itoa(i + 1),
			p.Source,
			p.Title,
			p.Price,
			strconv.Itoa(p.PriceRaw),
			p.Address,
			p.Area,
			p.Layout,
			p.Floor,
			p.BuildingType,
			p.ConstructionYear,
			p.Station,
			p.WalkMinutes,
			p.Contact,
			p.Phone,
			p.DetailURL,
			p.ScrapedAt,
		})
	}
	
	return nil
}
