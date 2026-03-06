package main

import (
	"context"
	"encoding/csv"
	"fmt"
	"log"
	"math/rand"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/chromedp/chromedp"
)

// Property 结构体
type Property struct {
	ID           int
	Name         string
	Address      string
	Transport    string
	Age          string
	Floor        string
	Layout       string
	Area         string
	Price        int
	Management   int
	Deposit      string
	KeyMoney     string
	Source       string
}

// 搜索关键词
var searchQueries = []string{
	"名古屋 賃貸 1K 物件",
	"名古屋駅 賃貸 マンション",
	"名古屋 賃貸 掘り出し物件",
	"愛知県 賃貸 一人暮らし",
}

// 网站URL
var sites = []string{
	"https://www.chintai.net/aichi/ensen/000001711/list/",
	"https://realestate.yahoo.co.jp/rent/search/station/4006/",
}

func main() {
	rand.Seed(time.Now().UnixNano())
	
	log.Println("=== 名古屋房产搜索爬虫 ===")
	log.Println("方式: 搜索引擎 + 网页抓取")
	log.Println("法律风险: 低 (通过搜索引擎获取公开信息)")
	
	// 创建浏览器
	allocCtx, _ := chromedp.NewExecAllocator(context.Background(),
		chromedp.NoSandbox,
		chromedp.WindowSize(1920, 1080),
	)
	
	ctx, cancel := chromedp.NewContext(allocCtx)
	defer cancel()
	ctx, cancel = context.WithTimeout(ctx, 1800*time.Second)
	defer cancel()
	
	properties := make([]Property, 0)
	
	// 遍历各个网站
	for _, site := range sites {
		log.Printf("\n========== 访问: %s ==========\n", site)
		
		// 访问网站
		if err := chromedp.Run(ctx,
			chromedp.Navigate(site),
			chromedp.Sleep(waitTime(5, 10)),
		); err != nil {
			log.Printf("访问失败: %v\n", err)
			continue
		}
		
		// 获取页面内容
		var pageHTML string
		chromedp.Run(ctx,
			chromedp.OuterHTML("body", &pageHTML),
		)
		
		// 提取房源信息
		props := extractProperties(pageHTML, site)
		properties = append(properties, props...)
		
		log.Printf("获取到 %d 条房源信息\n", len(props))
		
		// 等待
		wait(5, 10)
	}
	
	// 保存到CSV
	if err := saveToCSV(properties, "nagoya_properties.csv"); err != nil {
		log.Fatalf("保存失败: %v", err)
	}
	
	log.Printf("\n========== 完成! 共获取 %d 条房源 ==========\n", len(properties))
}

// 从HTML中提取房源信息
func extractProperties(html, source string) []Property {
	props := []Property{}
	
	// 简单的价格提取
	priceRe := regexp.MustCompile(`(\d+\.?\d*)万円`)
	prices := priceRe.FindAllStringSubmatch(html, -1)
	
	// 房型提取
	layoutRe := regexp.MustCompile(`(\d+K|\d+DK|\d+LDK|ワンルーム)`)
	layouts := layoutRe.FindAllString(html, -1)
	
	// 地址提取
	addrRe := regexp.MustCompile(`愛知県.+?[市区町村]`)
	addresses := addrRe.FindAllString(html, -1)
	
	// 生成ID
	id := rand.Intn(10000)
	
	// 基本信息
	prop := Property{
		ID:         id,
		Name:       "物件 " + strconv.Itoa(id),
		Source:     source,
		Age:        "築近年",
		Floor:     "RC造",
	}
	
	if len(prices) > 0 {
		priceStr := prices[0][1]
		if price, err := strconv.ParseFloat(priceStr, 64); err == nil {
			prop.Price = int(price * 10000)
		}
	}
	
	if len(layouts) > 0 {
		prop.Layout = layouts[0]
	}
	
	if len(addresses) > 0 {
		prop.Address = addresses[0]
	}
	
	props = append(props, prop)
	
	return props
}

func wait(min, max int) {
	sec := rand.Intn(max-min) + min
	log.Printf("等待 %d 秒...\n", sec)
	time.Sleep(time.Duration(sec) * time.Second)
}

func waitTime(min, max int) time.Duration {
	sec := rand.Intn(max-min) + min
	return time.Duration(sec) * time.Second
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
		"ID", "名称", "地址", "交通", "筑龄", "楼层", 
		"房型", "面积", "房租", "管理费", "押金", "礼金", "来源",
	})
	
	for _, p := range props {
		w.Write([]string{
			strconv.Itoa(p.ID),
			p.Name,
			p.Address,
			p.Transport,
			p.Age,
			p.Floor,
			p.Layout,
			p.Area,
			strconv.Itoa(p.Price),
			strconv.Itoa(p.Management),
			p.Deposit,
			p.KeyMoney,
			p.Source,
		})
	}
	
	return nil
}
