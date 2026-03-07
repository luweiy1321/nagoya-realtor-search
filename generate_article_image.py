from PIL import Image, ImageDraw, ImageFont

def create_article_image(title, content, output_path):
    lines = content.split('\n')
    height = 700 + len(lines) * 40
    
    # Clean white background
    img = Image.new('RGB', (800, height), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # Use Noto Sans CJK
    title_font = ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc", 40)
    h_font = ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc", 28)
    body_font = ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc", 24)
    small_font = ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc", 18)
    
    y = 60
    
    # Title
    draw.text((50, y), title, font=title_font, fill=(30, 30, 30))
    y += 80
    
    # Line under title
    draw.line([(50, y), (750, y)], fill=(0, 0, 0), width=4)
    y += 50
    
    # Content
    for line in lines:
        if line.strip():
            # Emoji heading
            if line.strip() and (line.strip()[0] in ['⚡', '📈', '🚀', '💡', '🤔', '🔥', '📊', '🧋', '💰', '🎯'] or line.endswith('？') or line.endswith('？')):
                draw.text((50, y), line, font=h_font, fill=(0, 0, 0))
                y += 10
            elif '•' in line or '-' in line[:5]:
                draw.text((70, y), line, font=body_font, fill=(60, 60, 60))
            else:
                draw.text((50, y), line, font=body_font, fill=(50, 50, 50))
        y += 36
    
    # Footer
    y += 30
    draw.line([(50, y), (750, y)], fill=(220, 220, 220), width=1)
    y += 20
    draw.text((50, y), "关注我们 获取更多科技资讯", font=small_font, fill=(150, 150, 150))
    
    img.save(output_path, 'PNG', quality=95)
    print(f"Saved: {output_path}")

# Article 1
title1 = "💰 股价一年暴涨1500%！这家存储芯片公司被AI带飞了"
content1 = """⚡ 闪迪什么来头？
SanDisk（闪迪），做存储芯片的。
以前你觉得它就是个卖U盘的？现在不一样了。

📈 暴涨1500%！
过去一年，闪迪股价从40美元一路涨到650美元！
- 涨幅：1500%
- 季度营收：30.3亿美元
- 利润同比增长：672%

🚀 凭啥涨这么猛？
AI！AI！AI！
- 数据中心对存储需求暴增
- NAND闪存价格大涨
- AI训练需要海量存储空间

💡 对普通人意味着什么？
1. 存储设备可能涨价
2. AI公司成本上升
3. 关注存储板块

AI不只需要算力，还需要存储。
这场盛宴，才刚开始。"""

create_article_image(title1, content1, "/root/.openclaw/workspace/科技文章/文章1-存储芯片.png")

# Article 2
title2 = "🧋 阿里放大招！AI帮你点奶茶，3小时狂赚100万单"
content2 = """⚡ 发生了什么？
2026年2月，阿里旗下千问App推出春节活动"请客计划"
- 投入30亿真金白银
- 送21张无门槛免单卡
- 奶茶、外卖、年货全覆盖

上线3小时，下单量突破100万单！

🤔 怎么玩的？
1. 打开千问App
2. 对手机说："帮我点杯奶茶"
3. AI自动下单 → 自动免单

🔥 背后意味着什么？
AI超级入口争夺战打响了！
- 阿里：我要做你的AI入口
- 抖音：我也想做
- 百度：还有我

💡 未来会怎样？
分析师说："2026年，AI助手将成为最大流量入口。"
以后可能不只是点外卖：叫车、订票、购物都能动嘴完成。

懒人经济的终极形态来了。"""

create_article_image(title2, content2, "/root/.openclaw/workspace/科技文章/文章2-阿里AI.png")

print("Done!")
