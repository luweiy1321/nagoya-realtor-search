import { useState, useEffect, useRef, useCallback } from 'react'
import * as PIXI from 'pixi.js'
import './GamePreview.css'

// 游戏状态
interface GameState {
  player: {
    x: number
    y: number
    direction: 'up' | 'down' | 'left' | 'right'
    moving: boolean
  }
  map: {
    width: number
    height: number
    tiles: any[]
  }
  npcs: any[]
  events: any[]
  variables: Record<string, number>
  items: Record<string, number>
}

// 默认地图数据
const DEFAULT_MAP = {
  width: 32,
  height: 32,
  tiles: [
    { x: 5, y: 5, tileId: 2 },
    { x: 6, y: 5, tileId: 2 },
    { x: 7, y: 5, tileId: 2 },
    { x: 5, y: 6, tileId: 2 },
    { x: 6, y: 6, tileId: 1 },
    { x: 7, y: 6, tileId: 2 },
  ]
}

// 图块颜色
const TILE_COLORS: Record<number, string> = {
  1: '#4a7c59', // 草地
  2: '#8b7355', // 土地
  3: '#4a90a4', // 水
  4: '#6b6b6b', // 石头
  5: '#8b4513', // 木头
  6: '#c0c0c0', // 金属
}

export default function GamePreview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [app, setApp] = useState<PIXI.Application | null>(null)
  const [gameState, setGameState] = useState<GameState>({
    player: { x: 6, y: 6, direction: 'down', moving: false },
    map: DEFAULT_MAP,
    npcs: [
      { id: '1', name: '村长', x: 8, y: 5, sprite: '#e94560' }
    ],
    events: [],
    variables: {},
    items: { gold: 100 },
  })
  const [messages, setMessages] = useState<string[]>([])
  const [showDialog, setShowDialog] = useState<string | null>(null)
  const [inventory, setInventory] = useState<Record<string, number>>({ gold: 100 })

  // 初始化PixiJS
  useEffect(() => {
    if (!containerRef.current) return

    const pixiApp = new PIXI.Application()
    
    pixiApp.init({
      width: 640,
      height: 480,
      backgroundColor: 0x1a1a2e,
      antialias: true,
    }).then(() => {
      if (containerRef.current) {
        containerRef.current.appendChild(pixiApp.canvas)
        setApp(pixiApp)
      }
    })

    return () => {
      pixiApp.destroy(true)
    }
  }, [])

  // 渲染游戏
  useEffect(() => {
    if (!app) return

    app.stage.removeChildren()

    const TILE_SIZE = 32

    // 绘制地图
    const mapContainer = new PIXI.Container()
    app.stage.addChild(mapContainer)

    // 绘制图块
    gameState.map.tiles.forEach(tile => {
      const graphics = new PIXI.Graphics()
      graphics.rect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
      graphics.fill(TILE_COLORS[tile.tileId] || '#000')
      mapContainer.addChild(graphics)
    })

    // 绘制NPC
    gameState.npcs.forEach(npc => {
      const npcGraphics = new PIXI.Graphics()
      npcGraphics.circle(npc.x * TILE_SIZE + 16, npc.y * TILE_SIZE + 16, 12)
      npcGraphics.fill(npc.sprite || '#e94560')
      mapContainer.addChild(npcGraphics)
    })

    // 绘制玩家
    const playerGraphics = new PIXI.Graphics()
    const px = gameState.player.x * TILE_SIZE + 16
    const py = gameState.player.y * TILE_SIZE + 16
    
    // 身体
    playerGraphics.circle(px, py, 10)
    playerGraphics.fill('#3498db')
    
    // 眼睛表示方向
    let eyeOffsetX = 0, eyeOffsetY = 0
    if (gameState.player.direction === 'up') eyeOffsetY = -3
    if (gameState.player.direction === 'down') eyeOffsetY = 3
    if (gameState.player.direction === 'left') eyeOffsetX = -3
    if (gameState.player.direction === 'right') eyeOffsetX = 3
    
    playerGraphics.circle(px - 3 + eyeOffsetX, py + eyeOffsetY, 2)
    playerGraphics.circle(px + 3 + eyeOffsetX, py + eyeOffsetY, 2)
    playerGraphics.fill('#fff')
    
    mapContainer.addChild(playerGraphics)

  }, [app, gameState])

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showDialog) return // 对话时不移动

      const { player } = gameState
      let newX = player.x
      let newY = player.y
      let newDir = player.direction

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          newY = Math.max(0, player.y - 1)
          newDir = 'up'
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          newY = Math.min(gameState.map.height - 1, player.y + 1)
          newDir = 'down'
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          newX = Math.max(0, player.x - 1)
          newDir = 'left'
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          newX = Math.min(gameState.map.width - 1, player.x + 1)
          newDir = 'right'
          break
        case ' ':
        case 'Enter':
          // 互动
          checkInteraction()
          return
        case 'i':
        case 'I':
          // 背包
          toggleInventory()
          return
        default:
          return
      }

      setGameState(prev => ({
        ...prev,
        player: { ...prev.player, x: newX, y: newY, direction: newDir }
      }))
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, showDialog])

  // 检查互动
  const checkInteraction = () => {
    const { player, npcs } = gameState
    const TILE_SIZE = 32

    // 检查附近的NPC
    for (const npc of npcs) {
      const dx = Math.abs(player.x - npc.x)
      const dy = Math.abs(player.y - npc.y)
      if (dx <= 1 && dy <= 1) {
        setShowDialog(`${npc.name}: 你好，旅行者！`)
        return
      }
    }
  }

  // 切换背包
  const toggleInventory = () => {
    // 背包UI切换
  }

  // 关闭对话框
  const closeDialog = () => {
    setShowDialog(null)
  }

  return (
    <div className="game-preview">
      <div className="preview-header">
        <h3>🎮 游戏预览</h3>
        <div className="controls-hint">
          <span>WASD/方向键: 移动</span>
          <span>空格/Enter: 互动</span>
          <span>I: 背包</span>
        </div>
      </div>

      <div className="preview-content">
        <div ref={containerRef} className="game-canvas" />

        <div className="game-ui">
          {/* 状态栏 */}
          <div className="status-bar">
            <div className="status-item">
              <span className="icon">💰</span>
              <span>{inventory.gold}</span>
            </div>
          </div>

          {/* 对话框 */}
          {showDialog && (
            <div className="dialog-box">
              <p>{showDialog}</p>
              <button onClick={closeDialog}>确定</button>
            </div>
          )}
        </div>
      </div>

      <div className="preview-info">
        <p>玩家位置: {gameState.player.x}, {gameState.player.y}</p>
      </div>
    </div>
  )
}
