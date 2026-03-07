package main

import (
	"context"
	"encoding/csv"
	"log"
	"math/rand"
	"os"
	"strconv"
	"strings"
	"time"
	
	"github.com/chromedp/chromedp"
)

type Property struct {
	ID        string
	Source    string
	Title     string
	Price     string
	PriceRaw  int
	DetailURL string
	ScrapedAt string
}

func main() {
	rand.Seed(time.Now().UnixNano())
	log.Println("=== 名古屋房产爬虫 ===")
	
	// 创建浏览器context
	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(),
		chromedp.NoSandbox,
	)
	defer cancel()
	
	taskCtx, cancel := chromedp.NewContext(allocCtx)
	defer cancel()
	
	taskCtx, cancel = context.WithTimeout(taskCtx, 300*time.Second)
	defer cancel()
	
	// 访问
	log.Println("访问SUUMO...")
	if err := chromedp.Run(taskCtx,
		chromedp.Navigate("https://suumo.jp/chintai/aichi/nagoya/"),
		chromedp.Sleep(5*time.Second),
	); err != nil {
		log.Fatalf("访问失败: %v", err)
	}
	
	// 获取链接
	var links []string
	if err := chromedp.Run(taskCtx,
		chromedp.Evaluate(`Array.from(document.querySelectorAll('a[href*="detail"]')).map(a=>a.href).slice(0,10)`, &links),
	); err != nil {
		log.Fatalf("获取失败: %v", err)
	}
	
	log.Printf("找到 %d 个\n", len(links))
	
	var properties []Property
	
	for i, link := range links {
		log.Printf("访问 %d/%d", i+1, len(links))
		
		if err := chromedp.Run(taskCtx,
			chromedp.Navigate(link),
			chromedp.Sleep(3*time.Second),
		); err != nil {
			log.Printf("  失败")
			continue
		}
		
		var prop Property
		chromedp.Run(taskCtx, chromedp.Evaluate(`({title:document.title,price:document.body.innerText.match(/[0-9,.]+万円/)?.[0]})`, &prop))
		
		prop.Source = "suumo"
		prop.DetailURL = link
		prop.ScrapedAt = time.Now().Format("2006-01-02 15:04:05")
		prop.PriceRaw = extractPrice(prop.Price)
		properties = append(properties, prop)
		
		log.Printf("  ✓ %s", prop.Price)
		
		chromedp.Run(taskCtx, chromedp.Navigate("https://suumo.jp/chintai/aichi/nagoya/"))
		time.Sleep(time.Duration(3+rand.Intn(5)) * time.Second)
	}
	
	saveToCSV(properties, "properties.csv")
	log.Printf("\n完成! 共 %d 条", len(properties))
}

func extractPrice(s string) int {
	s = strings.ReplaceAll(s, "万円", "")
	s = strings.ReplaceAll(s, "円", "")
	s = strings.ReplaceAll(s, ",", "")
	if f, _ := strconv.ParseFloat(s, 64); f > 0 {
		return int(f * 10000)
	}
	return 0
}

func saveToCSV(props []Property, filename string) {
	file, _ := os.Create(filename)
	defer file.Close()
	w := csv.NewWriter(file)
	w.Write([]string{"ID", "来源", "标题", "价格", "价格(日元)", "详情链接", "爬取时间"})
	for i, p := range props {
		w.Write([]string{strconv.Itoa(i+1), p.Source, p.Title, p.Price, strconv.Itoa(p.PriceRaw), p.DetailURL, p.ScrapedAt})
	}
	w.Flush()
}
