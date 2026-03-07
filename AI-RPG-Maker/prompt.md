# AI RPG Maker - 完整开发指南

## 项目概述
创建一个Web RPG Maker平台，使用React + PixiJS + TypeScript + Node.js，支持AI生成多人RPG游戏。

## 技术栈
- 前端: React 18 + TypeScript + PixiJS 7
- 后端: Node.js + Express + Colyseus (多人)
- 状态管理: Zustand
- 构建: Vite

## 12个模块

### 1. 專案架構
- 设计 plugin system（第三方扩展）
- 设计数据结构与状态管理（Zustand）
- 模块化拆分

### 2. Tile Map Editor
- React + PixiJS 拖拽编辑
- tile palette UI
- 碰撞层与可视化
- 自动保存与版本控制
- 大地图性能优化

### 3. NPC 与事件系統
- 对话树、条件分支
- 可视化事件编辑器
- NPC 状态与行为系统
- 可扩展任务触发架构

### 4. 任務與劇情
- 主线与支线任务
- 任务数据模型
- 剧情分支与世界状态

### 5. 遊戲 Runtime
- 角色移动与互动
- 动画与碰撞系统
- UI（背包、装备）
- 存档与载入

### 6. AI 系統
- AI 生成 RPG 世界
- AI NPC 性格与背景生成
- AI 剧情生成
- AI 任务生成
- prompt pipeline

### 7. AI 音樂（重点）
- 动态 BGM 系统（根据场景改变）
- 世界音乐生成
- Boss 音乐与情绪控制

### 8. 多玩家系統
- Colyseus 多人同步
- 角色同步与聊天室
- 副本与世界同步

### 9. Marketplace
- 素材市场架构
- 支付与分成
- 模板与分享
- UGC 生态

### 10. Cloud 與 SaaS
- SaaS 架构与用户系统
- 订阅与 AI 次数管理
- 云端存档

### 11. 性能與工程
- 性能瓶颈分析
- WebGL 优化
- 测试与 CI
- 监控与 logging

### 12. Growth 與創業
- MVP 与 roadmap
- 竞品分析
- Growth strategy
- 用户 onboarding

## 开发顺序
1. 先搭建基础架构
2. 实现 Tile Map Editor（核心）
3. 实现 NPC/事件系统
4. 实现 Runtime
5. 添加 AI 功能
6. 添加多人功能
7. 添加 Marketplace

## 输出要求
- 完整代码结构
- 关键模块实现
- 清晰注释
