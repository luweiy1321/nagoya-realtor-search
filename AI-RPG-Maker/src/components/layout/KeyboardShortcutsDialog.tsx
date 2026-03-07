// ============================================================================
// Keyboard Shortcuts Dialog - Help Display for Shortcuts
// ============================================================================

import { useState } from 'react'
import { getAllShortcuts, formatShortcut, getShortcutsByCategory } from '../../services/keyboardManager'
import './KeyboardShortcutsDialog.css'

interface KeyboardShortcutsDialogProps {
  onClose: () => void
}

const CATEGORY_NAMES: Record<string, string> = {
  global: '全局快捷键',
  editor: '编辑器',
  database: '数据库',
  panel: '面板',
  tools: '工具',
}

export default function KeyboardShortcutsDialog({ onClose }: KeyboardShortcutsDialogProps) {
  const shortcuts = getAllShortcuts()

  return (
    <div className="shortcuts-dialog-overlay" onClick={onClose}>
      <div className="shortcuts-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-dialog-header">
          <h2>⌨️ 键盘快捷键</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="shortcuts-dialog-content">
          {['global', 'tools', 'database', 'panel'].map((category) => {
            const categoryShortcuts = getShortcutsByCategory(category as any)
            return (
              <div key={category} className="shortcut-category">
                <h3>{CATEGORY_NAMES[category]}</h3>
                <div className="shortcuts-list">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div key={index} className="shortcut-item">
                      <span className="shortcut-keys">{formatShortcut(shortcut)}</span>
                      <span className="shortcut-desc">{shortcut.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="shortcuts-dialog-footer">
          <button className="close-btn-primary" onClick={onClose}>关闭</button>
        </div>
      </div>
    </div>
  )
}
