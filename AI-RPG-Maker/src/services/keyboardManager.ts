// ============================================================================
// Keyboard Shortcuts Manager - Global Keyboard Shortcut System
// ============================================================================

import { useEffect, useCallback } from 'react'
import { useLayoutStore } from '../stores/layoutStore'
import { useDatabaseStore } from '../stores/databaseStore'

// ============================================================================
// Shortcut Definitions
// ============================================================================

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  description: string
  action: () => void
  category: 'global' | 'editor' | 'database' | 'panel' | 'tools'
}

const SHORTCUTS: KeyboardShortcut[] = [
  // Global Shortcuts
  {
    key: 's',
    ctrl: true,
    description: '保存项目',
    action: () => {
      const data = useDatabaseStore.getState().exportDatabase()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${data.system.gameTitle || 'project'}.json`
      a.click()
      URL.revokeObjectURL(url)
    },
    category: 'global',
  },
  {
    key: 'o',
    ctrl: true,
    description: '打开项目',
    action: () => {
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
              useDatabaseStore.getState().loadDatabase(data)
            } catch (err) {
              alert('加载文件失败：无效的JSON格式')
            }
          }
          reader.readAsText(file)
        }
      }
      input.click()
    },
    category: 'global',
  },
  {
    key: 'n',
    ctrl: true,
    description: '新建项目',
    action: () => {
      if (confirm('确定要新建项目吗？未保存的更改将丢失。')) {
        useDatabaseStore.getState().clearDatabase()
      }
    },
    category: 'global',
  },

  // Editor Mode Shortcuts
  {
    key: '1',
    alt: true,
    description: '地图编辑器',
    action: () => useLayoutStore.getState().setMode('map'),
    category: 'tools',
  },
  {
    key: '2',
    alt: true,
    description: '数据库',
    action: () => useLayoutStore.getState().setMode('database'),
    category: 'tools',
  },
  {
    key: '3',
    alt: true,
    description: '事件编辑器',
    action: () => useLayoutStore.getState().setMode('event'),
    category: 'tools',
  },
  {
    key: '4',
    alt: true,
    description: '战斗设置',
    action: () => useLayoutStore.getState().setMode('battle'),
    category: 'tools',
  },
  {
    key: '5',
    alt: true,
    description: '资源管理',
    action: () => useLayoutStore.getState().setMode('resources'),
    category: 'tools',
  },

  // Panel Shortcuts
  {
    key: '1',
    ctrl: true,
    alt: true,
    description: '切换左侧面板',
    action: () => useLayoutStore.getState().toggleLeftPanel(),
    category: 'panel',
  },
  {
    key: '2',
    ctrl: true,
    alt: true,
    description: '切换右侧面板',
    action: () => useLayoutStore.getState().toggleRightPanel(),
    category: 'panel',
  },
  {
    key: '3',
    ctrl: true,
    alt: true,
    description: '切换底部面板',
    action: () => useLayoutStore.getState().toggleBottomPanel(),
    category: 'panel',
  },

  // Database Shortcuts
  {
    key: 'a',
    ctrl: true,
    description: '新建角色',
    action: () => {
      useLayoutStore.getState().setMode('database')
      useDatabaseStore.getState().setSelectedSection('actors')
      useDatabaseStore.getState().addActor()
    },
    category: 'database',
  },
  {
    key: 'Delete',
    description: '删除选中项',
    action: () => {
      const { selectedId, selectedSection } = useDatabaseStore.getState()
      if (!selectedId) return

      const store = useDatabaseStore.getState()
      switch (selectedSection) {
        case 'actors': store.deleteActor(selectedId); break
        case 'classes': store.deleteClass(selectedId); break
        case 'skills': store.deleteSkill(selectedId); break
        case 'items': store.deleteItem(selectedId); break
        case 'weapons': store.deleteWeapon(selectedId); break
        case 'armors': store.deleteArmor(selectedId); break
        case 'enemies': store.deleteEnemy(selectedId); break
        case 'troops': store.deleteTroop(selectedId); break
        case 'states': store.deleteState(selectedId); break
        case 'animations': store.deleteAnimation(selectedId); break
        case 'tilesets': store.deleteTileset(selectedId); break
        case 'commonEvents': store.deleteCommonEvent(selectedId); break
      }
    },
    category: 'database',
  },

  // View Shortcuts
  {
    key: 'F11',
    description: '全屏模式',
    action: () => useLayoutStore.getState().toggleFullscreen(),
    category: 'panel',
  },
  {
    key: '=',
    ctrl: true,
    description: '放大',
    action: () => {
      const zoom = useLayoutStore.getState().workspaceZoom
      useLayoutStore.getState().setWorkspaceZoom(zoom + 0.1)
    },
    category: 'panel',
  },
  {
    key: '-',
    ctrl: true,
    description: '缩小',
    action: () => {
      const zoom = useLayoutStore.getState().workspaceZoom
      useLayoutStore.getState().setWorkspaceZoom(zoom - 0.1)
    },
    category: 'panel',
  },
  {
    key: '0',
    ctrl: true,
    description: '重置缩放',
    action: () => useLayoutStore.getState().setWorkspaceZoom(1),
    category: 'panel',
  },
]

// ============================================================================
// Keyboard Hook
// ============================================================================

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input, textarea, or contenteditable
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      // Check each shortcut
      for (const shortcut of SHORTCUTS) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase() ||
                        e.code === shortcut.key
        const ctrlMatch = !!shortcut.ctrl === (e.ctrlKey || e.metaKey)
        const altMatch = !!shortcut.alt === e.altKey
        const shiftMatch = !!shortcut.shift === e.shiftKey

        if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
          e.preventDefault()
          shortcut.action()
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}

// ============================================================================
// Get All Shortcuts (for help display)
// ============================================================================

export function getAllShortcuts(): KeyboardShortcut[] {
  return SHORTCUTS.map(s => ({
    ...s,
    action: () => {}, // Remove action for display
  }))
}

export function getShortcutsByCategory(category: KeyboardShortcut['category']): KeyboardShortcut[] {
  return SHORTCUTS.filter(s => s.category === category)
}

// ============================================================================
// Format Shortcut for Display
// ============================================================================

const SPECIAL_KEY_NAMES: Record<string, string> = {
  'F11': 'F11',
  'Delete': 'Delete',
  'Escape': 'Esc',
  ' ': 'Space',
}

export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = []
  if (shortcut.ctrl) parts.push('Ctrl')
  if (shortcut.alt) parts.push('Alt')
  if (shortcut.shift) parts.push('Shift')
  const keyName = SPECIAL_KEY_NAMES[shortcut.key] || (shortcut.key.charAt(0).toUpperCase() + shortcut.key.slice(1))
  parts.push(keyName)
  return parts.join(' + ')
}
