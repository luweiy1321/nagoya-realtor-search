// ============================================================================
// Database Editor - Main Database Management Component
// ============================================================================

import { useDatabaseStore } from '../../stores/databaseStore'
import { DATABASE_SECTION_ICONS, DATABASE_SECTION_NAMES, type DatabaseSection } from '../../constants/database'
import DatabaseList from './DatabaseList'
import DatabaseProperties from './DatabaseProperties'
import './DatabaseEditor.css'

const SECTIONS: Array<{ key: DatabaseSection; icon: string; name: string }> = [
  { key: 'actors', icon: '👤', name: '角色' },
  { key: 'classes', icon: '⚔️', name: '职业' },
  { key: 'skills', icon: '✨', name: '技能' },
  { key: 'items', icon: '🎒', name: '物品' },
  { key: 'weapons', icon: '🗡️', name: '武器' },
  { key: 'armors', icon: '🛡️', name: '护甲' },
  { key: 'enemies', icon: '👹', name: '敌人' },
  { key: 'troops', icon: '👾', name: '敌群' },
  { key: 'states', icon: '💊', name: '状态' },
  { key: 'animations', icon: '🎬', name: '动画' },
  { key: 'tilesets', icon: '🧩', name: '图块集' },
  { key: 'commonEvents', icon: '📋', name: '公共事件' },
  { key: 'system', icon: '⚙️', name: '系统' },
]

export default function DatabaseEditor() {
  const { selectedSection, setSelectedSection, dirty } = useDatabaseStore()

  return (
    <div className="database-editor">
      {/* Left Sidebar - Section Navigation */}
      <aside className="db-sidebar">
        <div className="db-sidebar-header">
          <h3>数据库</h3>
          {dirty && <span className="dirty-indicator">●</span>}
        </div>
        <nav className="db-sections">
          {SECTIONS.map((section) => (
            <button
              key={section.key}
              className={`db-section-btn ${selectedSection === section.key ? 'active' : ''}`}
              onClick={() => setSelectedSection(section.key)}
              title={section.name}
            >
              <span className="section-icon">{section.icon}</span>
              <span className="section-name">{section.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Middle - Item List */}
      <DatabaseList />

      {/* Right - Properties Editor */}
      <DatabaseProperties />
    </div>
  )
}
