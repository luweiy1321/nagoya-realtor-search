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
	
	// 先尝试有代理
	proxyUsed := false
	
	// 创建浏览器，使用代理
	allocCtx, _ := chromedp.NewExecAllocator(context.Background(),
		chromedp.NoSandbox,
		chromedp.WindowSize(1920, 1080),
	)
	
	ctx, cancel := chromedp.NewContext(allocCtx)
	defer cancel()
	ctx, cancel = context.WithTimeout(ctx, 300*time.Second)
	defer cancel()
	
	log.Println("尝试访问SUUMO...")
	err := chromedp.Run(ctx,
		chromedp.Navigate(`https://suumo.jp/chintai/aichi/nagoya/`),
	)
	
	if err != nil {
		log.Printf("访问失败: %v", err)
		log.Println("可能需要检查代理设置")
		return
	}
	
	randSleep(5, 8)
	
	log.Println("获取链接...")
	var links []string
	if err := chromedp.Run(ctx,
		chromedp.Evaluate(`Array.from(document.querySelectorAll('a')).filter(a=>a.href&&a.href.includes('detail')&&a.href.includes('chintai')).slice(0,10).map(a=>a.href)`, &links),
	); err != nil {
		log.Fatalf("获取失败: %v", err)
	}
	
	log.Printf("找到 %d 个\n", len(links))
	
	if len(links) == 0 {
		log.Println("未找到链接，页面可能被反爬拦截")
		return
	}
	
	properties := make([]Property, 0)
	
	for i, link := range links {
		log.Printf("访问 %d/%d", i+1, len(links))
		
		if err := chromedp.Run(ctx,
			chromedp.Navigate(link),
			chromedp.Sleep(4*time.Second),
		); err != nil {
			log.Printf("  失败")
			continue
		}
		
		var title string
		chromedp.Run(ctx, chromedp.Title(&title))
		
		price := extractPrice(title)
		
		prop := Property{
			ID:        strconv.Itoa(i + 1),
			Source:    "suumo",
			Title:     truncate(title, 80),
			Price:     price,
			PriceRaw:  extractPriceRaw(price),
			DetailURL: link,
			ScrapedAt: time.Now().Format("2006-01-02 15:04:05"),
		}
		
		properties = append(properties, prop)
		log.Printf("  ✓ %s", price)
		
		chromedp.Run(ctx, chromedp.Navigate(`https://suumo.jp/chintai/aichi/nagoya/`))
		randSleep(4, 10)
	}
	
	saveToCSV(properties, "suumo.csv")
	log.Printf("\n完成! 共 %d 条", len(properties))
	
	if proxyUsed {
		log.Println("使用代理成功!")
	}
}

func extractPrice(s string) string {
	re := regexp.MustCompile(`[\d,]+\.?\d*万円?`)
	m := re.FindString(s)
	if m != "" {
		return m
	}
	return "N/A"
}

func extractPriceRaw(s string) int {
	s = strings.ReplaceAll(s, "万円", "")
	s = strings.ReplaceAll(s, "円", "")
	s = strings.ReplaceAll(s, ",", "")
	if f, _ := strconv.ParseFloat(s, 64); f > 0 {
		return int(f * 10000)
	}
	return 0
}

func truncate(s string, n int) string {
	if len(s) > n {
		return s[:n] + "..."
	}
	return s
}

func randSleep(min, max int) {
	sec := rand.Intn(max-min) + min
	log.Printf("  等%d秒\n", sec)
	time.Sleep(time.Duration(sec) * time.Second)
}

func saveToCSV(props []Property, f string) {
	file, _ := os.Create(f)
	w := csv.NewWriter(file)
	w.Write([]string{"ID", "来源", "标题", "价格", "价格(日元)", "链接", "时间"})
	for i, p := range props {
		w.Write([]string{strconv.Itoa(i+1), p.Source, p.Title, p.Price, strconv.Itoa(p.PriceRaw), p.DetailURL, p.ScrapedAt})
	}
	w.Flush()
	file.Close()
}
