package main

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"time"
	
	"github.com/chromedp/chromedp"
)

func main() {
	// 创建带延时的浏览器上下文
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("disable-blink-features", "Automation"),
		chromedp.UserAgent(getRandomUserAgent()),
		chromedp.Headless(false), // 先用有头模式调试
		chromedp.NoSandbox,
	)
	
	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel()
	
	// 创建context
	taskCtx, cancel := chromedp.NewContext(allocCtx)
	defer cancel()
	
	// 设置超时
	taskCtx, cancel = context.WithTimeout(taskCtx, 180*time.Second)
	defer cancel()
	
	// 模拟人类行为：随机等待
	randomDelay(2, 5)
	
	// 访问页面
	log.Println("访问SUUMO...")
	if err := chromedp.Run(taskCtx,
		chromedp.Navigate("https://suumo.jp/chintai/aichi/nagoya/"),
		chromedp.Sleep(3*time.Second), // 等待页面加载
	); err != nil {
		log.Fatalf("访问失败: %v", err)
	}
	
	// 模拟滚动（人类行为）
	log.Println("模拟滚动...")
	simulateHumanScroll(taskCtx)
	
	// 获取房源列表
	log.Println("获取房源数据...")
	var results []string
	if err := chromedp.Run(taskCtx,
		chromedp.Evaluate(`
			Array.from(document.querySelectorAll('.propertyCassette-item')).map(item => {
				const title = item.querySelector('.propertyCassette-title')?.textContent || '';
				const price = item.querySelector('.propertyCassette-price')?.textContent || '';
				const address = item.querySelector('.propertyCassette-address')?.textContent || '';
				return {title, price, address};
			})
		`, &results),
	); err != nil {
		log.Fatalf("获取数据失败: %v", err)
	}
	
	log.Printf("获取到 %d 条房源\n", len(results))
	
	// 访问详情页
	log.Println("访问第一个详情页...")
	simulateHumanClick(taskCtx, ".propertyCassette-item a")
	
	// 等待
	randomDelay(3, 7)
	
	// 获取详情
	var detailData map[string]string
	if err := chromedp.Run(taskCtx,
		chromedp.Evaluate(`
			({
				address: document.querySelector('.propertyDetail-info-address')?.textContent,
				contact: document.querySelector('.propertyDetail-contact-name')?.textContent,
				phone: document.querySelector('.propertyDetail-contact-tel')?.textContent
			})
		`, &detailData),
	); err != nil {
		log.Printf("获取详情失败: %v", err)
	}
	
	log.Printf("详情: %+v\n", detailData)
}

// 随机用户代理
func getRandomUserAgent() string {
	agents := []string{
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
	}
	return agents[rand.Intn(len(agents))]
}

// 随机延时
func randomDelay(min, max int) {
	delay := time.Duration(rand.Intn(max-min)+min) * time.Second
	log.Printf("等待 %v...\n", delay)
	time.Sleep(delay)
}

// 模拟人类滚动
func simulateHumanScroll(ctx context.Context) {
	// 分几次滚动，每次随机位置
	for i := 0; i < 3; i++ {
		scrollPos := rand.Intn(500) + 200
		chromedp.Run(ctx,
			chromedp.Evaluate(fmt.Sprintf("window.scrollBy(0, %d)", scrollPos), nil),
		)
		randomDelay(1, 2)
	}
}

// 模拟人类点击
func simulateHumanClick(ctx context.Context, selector string) {
	// 先移动到元素上方（模拟鼠标移动）
	chromedp.Run(ctx,
		chromedp.Evaluate(fmt.Sprintf(`
			const el = document.querySelector('%s');
			if(el) {
				const rect = el.getBoundingClientRect();
				const x = rect.left + rect.width/2 + (Math.random() - 0.5) * 20;
				const y = rect.top + rect.height/2 + (Math.random() - 0.5) * 20;
				// 创建鼠标移动事件
				const event = new MouseEvent('mousemove', {
					'bubbles': true,
					'cancelable': true,
					'clientX': x,
					'clientY': y
				});
				document.elementFromPoint(x, y)?.dispatchEvent(event);
			}
		`, selector), nil),
	)
	
	randomDelay(0, 1)
	
	// 点击
	chromedp.Run(ctx,
		chromedp.Click(selector),
	)
}
