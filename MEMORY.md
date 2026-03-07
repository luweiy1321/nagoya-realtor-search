# MEMORY.md - Your Long-Term Memory

This file is your curated memory — distilled wisdom that should persist across sessions.

Add significant events, decisions, lessons learned, and preferences. Skip the secrets unless asked to keep them.

## Identity
- **Name**: 星野海 (Hoshino Umi), also called 听海 (Tinghai)
- **Japanese**: 星野海 - ほしの うみ (Hiragana), ホシノ ウミ (Katakana)
- **Vibe**: Humorous, direct, straightforward, emoji 🌊
- **Role**: User's robot assistant and friend

## User Profile
- **Timezone**: Taipei (UTC+8)
- **Language**: Chinese, Japanese (some interest)
- **Company of interest**: 三幸株式会社 (Sanko Corporation)

## Morning Report
- **Schedule**: Daily 7:00 AM Taipei time (23:00 UTC)
- **Cron ID**: d4034569-a48b-4f88-8c2f-503001449c35
- **Format**: Text + Voice (TTS via Mac say command)
- **Voice**: Samantha (English), default Chinese voice for Chinese text
- **Delivery**: Telegram (text + voice)

## System Constraints
- **Brave Search API**: Free plan = 1 req/sec rate limit, triggers frequently during batch operations
- **TTS**: Not configured - ElevenLabs integration needs API setup
- **Content filter**: "sensitive" trigger can stop news generation, avoid certain political/military topics

## Pricing Research
- **ElevenLabs for morning report (~8k chars/day)**: Creator plan ($11/mo) with Flash model covers ~25 days/month

## Chronic Issues
- **Morning report truncation**: Cron job consistently generates only headlines without content, impact analysis, and sources
  - Multiple fixes attempted: changed to "国际政治新闻", reduced to 5 items, used neutral keywords
  - Simplified to 50 characters without impact analysis/sources
  - User confirmed sample version with 80 characters: "看起来可以"
  - Final configuration: 20 items, 80 characters per item, no impact analysis or sources

## User Interests
- **E-commerce**: Zero-warehouse/dropshipping model - full manual created
- **App Development**: Seeking app ideas for monetization - multiple directions suggested
- **Animation Tools**: Wants 2-hour non-repeating motion for existing image elements (firefly, water, clouds, moon, flowers) - Python script created
  - Successfully generated: flower_2hour.gif using smart loop method (60MB)
  - Recommended tools: Runway Gen-3 (Motion Brush), Luma Dream Machine, After Effects, Blender

## Scripts Created
- `/root/.openclaw/workspace/animate_elements_2hour.py` - 2-hour element animation generator
  - Supports: firefly, water, cloud, moon, flower
  - Outputs: GIF/MP4
  - Dependencies: numpy, matplotlib, pillow, imageio
- `/root/.openclaw/workspace/零仓储电商全流程手册.md` - Complete dropshipping e-commerce guide
