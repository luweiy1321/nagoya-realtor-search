import { useState, useRef, useEffect, useCallback } from 'react'
import * as PIXI from 'pixi.js'
import './TileMapEditor.css'

// Tile类型定义
interface Tile {
  id: string
  x: number
  y: number
  layer: number
  tileId: number
}

// 图块预设
const TILE_PALETTE = [
  { id: 1, color: '#4a7c59', name: '草地' },
  { id: 2, color: '#8b7355', name: '土地' },
  { id: 3, color: '#4a90a4', name: '水' },
  { id: 4, color: '#6b6b6b', name: '石头' },
  { id: 5, color: '#8b4513', name: '木头' },
  { id: 6, color: '#c0c0c0', name: '金属' },
  { id: 7, color: '#2d5a27', name: '森林' },
  { id: 8, color: '#d4a574', name: '沙地' },
  { id: 9, color: '#fff', name: '雪地' },
  { id: 10, color: '#e94560', name: '墙壁' },
]

// 默认地图尺寸
const MAP_WIDTH = 32
const MAP_HEIGHT = 32
const TILE_SIZE = 32

export default function TileMapEditor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [app, setApp] = useState<PIXI.Application | null>(null)
  const [tiles, setTiles] = useState<Tile[]>([])
  const [selectedTile, setSelectedTile] = useState<number>(1)
  const [currentLayer, setCurrentLayer] = useState<number>(0)
  const [zoom, setZoom] = useState<number>(1)
  const [isPanning, setIsPanning] = useState<boolean>(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  // 初始化PixiJS
  useEffect(() => {
    if (!containerRef.current) return

    const pixiApp = new PIXI.Application()
    
    pixiApp.init({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      backgroundColor: 0x1a1a2e,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    }).then(() => {
      if (containerRef.current && canvasRef.current) {
        containerRef.current.appendChild(pixiApp.canvas)
        setApp(pixiApp)
      }
    })

    return () => {
      pixiApp.destroy(true)
    }
  }, [])

  // 渲染地图
  useEffect(() => {
    if (!app) return

    // 清除现有内容
    app.stage.removeChildren()

    // 创建容器用于缩放和平移
    const mapContainer = new PIXI.Container()
    mapContainer.x = offset.x
    mapContainer.y = offset.y
    mapContainer.scale.set(zoom)
    app.stage.addChild(mapContainer)

    // 绘制网格背景
    const grid = new PIXI.Graphics()
    for (let x = 0; x <= MAP_WIDTH; x++) {
      grid.moveTo(x * TILE_SIZE, 0)
      grid.lineTo(x * TILE_SIZE, MAP_HEIGHT * TILE_SIZE)
    }
    for (let y = 0; y <= MAP_HEIGHT; y++) {
      grid.moveTo(0, y * TILE_SIZE)
      grid.lineTo(MAP_WIDTH * TILE_SIZE, y * TILE_SIZE)
    }
    grid.stroke({ width: 1, color: 0x333333 })
    mapContainer.addChild(grid)

    // 绘制每个图块
    tiles.filter(t => t.layer === currentLayer).forEach(tile => {
      const tileData = TILE_PALETTE.find(t => t.id === tile.tileId)
      if (tileData) {
        const graphics = new PIXI.Graphics()
        graphics.rect(tile.x * TILE_SIZE + 1, tile.y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2)
        graphics.fill(tileData.color)
        mapContainer.addChild(graphics)
      }
    })

    // 绘制碰撞层（半透明红色）
    if (currentLayer === 2) {
      const collisionLayer = new PIXI.Graphics()
      tiles.filter(t => t.layer === 2).forEach(tile => {
        collisionLayer.rect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
        collisionLayer.fill({ color: 0xff0000, alpha: 0.3 })
      })
      mapContainer.addChild(collisionLayer)
    }

  }, [app, tiles, currentLayer, zoom, offset])

  // 鼠标事件处理
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true)
      setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
    } else if (e.button === 0 && app) {
      // 放置图块
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      
      const x = Math.floor((e.clientX - rect.left - offset.x) / (TILE_SIZE * zoom))
      const y = Math.floor((e.clientY - rect.top - offset.y) / (TILE_SIZE * zoom))
      
      if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
        if (currentLayer === 2) {
          // 碰撞层 - 切换碰撞状态
          setTiles(prev => {
            const existing = prev.find(t => t.x === x && t.y === y && t.layer === 2)
            if (existing) {
              return prev.filter(t => t !== existing)
            }
            return [...prev, { id: crypto.randomUUID(), x, y, layer: 2, tileId: 1 }]
          })
        } else {
          // 普通图层 - 放置图块
          setTiles(prev => {
            const filtered = prev.filter(t => !(t.x === x && t.y === y && t.layer === currentLayer))
            return [...filtered, { id: crypto.randomUUID(), x, y, layer: currentLayer, tileId: selectedTile }]
          })
        }
      }
    }
  }, [app, offset, zoom, currentLayer, selectedTile])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      })
    }
  }, [isPanning, panStart])

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  // 滚轮缩放
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom(prev => Math.max(0.25, Math.min(4, prev + delta)))
  }, [])

  // 橡皮擦
  const handleEraser = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    
    // 获取鼠标位置需要在实际事件中传递，这里简化处理
  }, [])

  // 保存地图
  const handleSave = useCallback(() => {
    const mapData = {
      width: MAP_WIDTH,
      height: MAP_HEIGHT,
      tileSize: TILE_SIZE,
      tiles: tiles
    }
    const json = JSON.stringify(mapData, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'map.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [tiles])

  // 加载地图
  const handleLoad = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        if (data.tiles) {
          setTiles(data.tiles)
        }
      } catch (err) {
        console.error('Failed to load map:', err)
      }
    }
    reader.readAsText(file)
  }, [])

  return (
    <div className="tile-map-editor">
      {/* 左侧工具栏 */}
      <aside className="toolbar">
        <div className="toolbar-section">
          <h3>图块选择</h3>
          <div className="tile-palette">
            {TILE_PALETTE.map(tile => (
              <button
                key={tile.id}
                className={`tile-button ${selectedTile === tile.id ? 'selected' : ''}`}
                style={{ backgroundColor: tile.color }}
                onClick={() => setSelectedTile(tile.id)}
                title={tile.name}
              >
                {tile.id}
              </button>
            ))}
          </div>
        </div>

        <div className="toolbar-section">
          <h3>图层</h3>
          <div className="layer-buttons">
            <button 
              className={currentLayer === 0 ? 'active' : ''} 
              onClick={() => setCurrentLayer(0)}
            >
              🏞️ 地面
            </button>
            <button 
              className={currentLayer === 1 ? 'active' : ''} 
              onClick={() => setCurrentLayer(1)}
            >
              🏗️ 建筑
            </button>
            <button 
              className={currentLayer === 2 ? 'active' : ''} 
              onClick={() => setCurrentLayer(2)}
            >
              🚫 碰撞
            </button>
          </div>
        </div>

        <div className="toolbar-section">
          <h3>缩放</h3>
          <input 
            type="range" 
            min="0.25" 
            max="4" 
            step="0.25" 
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
          />
          <span>{Math.round(zoom * 100)}%</span>
        </div>

        <div className="toolbar-section">
          <h3>操作</h3>
          <button onClick={handleSave}>💾 保存地图</button>
          <label className="load-button">
            📂 加载地图
            <input type="file" accept=".json" onChange={handleLoad} hidden />
          </label>
          <button onClick={() => setTiles([])}>🗑️ 清空地图</button>
        </div>

        <div className="toolbar-section info">
          <p>Alt+拖拽: 平移</p>
          <p>滚轮: 缩放</p>
          <p>点击: 放置图块</p>
        </div>
      </aside>

      {/* 地图画布 */}
      <div 
        ref={containerRef}
        className="canvas-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isPanning ? 'grabbing' : 'crosshair' }}
      />
    </div>
  )
}
