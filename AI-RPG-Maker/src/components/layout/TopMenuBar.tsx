// ============================================================================
// Top Menu Bar - RPG Maker MZ Style Menu Bar
// ============================================================================

import { useState } from 'react'
import { useLayoutStore } from '../../stores/layoutStore'
import { useDatabaseStore } from '../../stores/databaseStore'
import KeyboardShortcutsDialog from './KeyboardShortcutsDialog'
import './MainLayout.css'

export default function TopMenuBar() {
  const { currentMode, setMode, toggleLeftPanel, toggleRightPanel, toggleBottomPanel, resetLayout } = useLayoutStore()
  const { dirty, exportDatabase, loadDatabase } = useDatabaseStore()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [showShortcuts, setShowShortcuts] = useState(false)

  const handleFileAction = (action: string) => {
    switch (action) {
      case 'new':
        if (confirm('确定要新建项目吗？未保存的更改将丢失。')) {
          // Import the reset function to properly reset the database
          import('../../stores/databaseStore').then(({ useDatabaseStore }) => {
            useDatabaseStore.getState().clearDatabase()
          })
        }
        break
      case 'save':
        const data = exportDatabase()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${data.system.gameTitle || 'project'}.json`
        a.click()
        URL.revokeObjectURL(url)
        break
      case 'load':
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json'
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0]
          if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
              try {
                const data = JSON.parse(e.target?.result as string)
                loadDatabase(data)
              } catch (err) {
                alert('加载文件失败：无效的JSON格式')
              }
            }
            reader.readAsText(file)
          }
        }
        input.click()
        break
    }
    setActiveMenu(null)
  }

  const handleViewAction = (action: string) => {
    switch (action) {
      case 'left': toggleLeftPanel(); break
      case 'right': toggleRightPanel(); break
      case 'bottom': toggleBottomPanel(); break
      case 'reset': resetLayout(); break
    }
    setActiveMenu(null)
  }

  const handleToolAction = (mode: string) => {
    setMode(mode as any)
    setActiveMenu(null)
  }

  return (
    <header className="top-menu-bar">
      <div className="menu-bar-left">
        <h1 className="app-title">🎮 AI RPG Maker</h1>
        {dirty && <span className="unsaved-indicator">● 未保存</span>}
      </div>

      <nav className="menu-bar-center">
        <MenuButton
          label="文件"
          isActive={activeMenu === 'file'}
          onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
        >
          {activeMenu === 'file' && (
            <div className="dropdown-menu">
              <button onClick={() => handleFileAction('new')}>新建项目</button>
              <button onClick={() => handleFileAction('load')}>打开项目</button>
              <button onClick={() => handleFileAction('save')}>保存项目</button>
            </div>
          )}
        </MenuButton>

        <MenuButton
          label="视图"
          isActive={activeMenu === 'view'}
          onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}
        >
          {activeMenu === 'view' && (
            <div className="dropdown-menu">
              <button onClick={() => handleViewAction('left')}>切换左面板</button>
              <button onClick={() => handleViewAction('right')}>切换右面板</button>
              <button onClick={() => handleViewAction('bottom')}>切换底部面板</button>
              <hr />
              <button onClick={() => handleViewAction('reset')}>重置布局</button>
            </div>
          )}
        </MenuButton>

        <MenuButton
          label="工具"
          isActive={activeMenu === 'tools'}
          onClick={() => setActiveMenu(activeMenu === 'tools' ? null : 'tools')}
        >
          {activeMenu === 'tools' && (
            <div className="dropdown-menu">
              <div className="menu-section">核心编辑器</div>
              <button onClick={() => handleToolAction('map')}>🗺️ 地图编辑器</button>
              <button onClick={() => handleToolAction('database')}>📊 数据库</button>
              <button onClick={() => handleToolAction('event')}>⚡ 事件编辑器</button>
              <div className="menu-section">扩展工具</div>
              <button onClick={() => handleToolAction('npc')}>👤 NPC编辑器</button>
              <button onClick={() => handleToolAction('quest')}>📜 任务编辑器</button>
              <button onClick={() => handleToolAction('battle')}>⚔️ 战斗设置</button>
              <button onClick={() => handleToolAction('resources')}>📁 资源管理</button>
              <button onClick={() => handleToolAction('animation')}>🎬 动画</button>
              <div className="menu-section">AI 工具</div>
              <button onClick={() => handleToolAction('ai')}>🤖 AI世界生成</button>
              <button onClick={() => handleToolAction('music')}>🎵 AI音乐生成</button>
              <div className="menu-section">其他</div>
              <button onClick={() => handleToolAction('runtime')}>🎮 游戏预览</button>
              <button onClick={() => handleToolAction('multiplayer')}>🌐 多人游戏</button>
              <button onClick={() => handleToolAction('market')}>🏪 资源市场</button>
              <button onClick={() => handleToolAction('cloud')}>☁️ 云同步</button>
              <button onClick={() => handleToolAction('settings')}>⚙️ 设置</button>
            </div>
          )}
        </MenuButton>

        <MenuButton
          label="帮助"
          isActive={activeMenu === 'help'}
          onClick={() => setActiveMenu(activeMenu === 'help' ? null : 'help')}
        >
          {activeMenu === 'help' && (
            <div className="dropdown-menu">
              <button>📖 文档</button>
              <button onClick={() => { setShowShortcuts(true); setActiveMenu(null); }}>⌨️ 快捷键</button>
              <button>ℹ️ 关于</button>
            </div>
          )}
        </MenuButton>
      </nav>

      <div className="menu-bar-right">
        <span className="current-mode-display">
          {getModeDisplayName(currentMode)}
        </span>
      </div>

      {activeMenu && (
        <div className="menu-overlay" onClick={() => setActiveMenu(null)} />
      )}

      {showShortcuts && (
        <KeyboardShortcutsDialog onClose={() => setShowShortcuts(false)} />
      )}
    </header>
  )
}

function MenuButton({
  label,
  isActive,
  onClick,
  children,
}: {
  label: string
  isActive: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <div className={`menu-button ${isActive ? 'active' : ''}`}>
      <button onClick={onClick}>{label}</button>
      {children}
    </div>
  )
}

function getModeDisplayName(mode: string): string {
  const names: Record<string, string> = {
    map: '🗺️ 地图编辑器',
    database: '📊 数据库',
    event: '⚡ 事件编辑器',
    battle: '⚔️ 战斗设置',
    resources: '📁 资源管理',
    animation: '🎬 动画编辑器',
    script: '📝 脚本编辑器',
    npc: '👤 NPC编辑器',
    quest: '📜 任务编辑器',
    runtime: '🎮 游戏预览',
    ai: '🤖 AI世界生成',
    music: '🎵 AI音乐生成',
    multiplayer: '🌐 多人游戏',
    market: '🏪 资源市场',
    cloud: '☁️ 云同步',
    settings: '⚙️ 设置',
  }
  return names[mode] || mode
}
