// ============================================================================
// Right Sidebar - Properties and Database Editor
// ============================================================================

import { useLayoutStore } from '../../stores/layoutStore'
import PropertyPanel from './PropertyPanel'
import DatabaseEditor from '../database/DatabaseEditor'
import EventPanel from './EventPanel'
import ConsolePanel from './ConsolePanel'
import './MainLayout.css'

interface RightSidebarProps {
  width: number
}

export default function RightSidebar({ width }: RightSidebarProps) {
  const { rightPanelTab, setRightPanelTab } = useLayoutStore()

  return (
    <aside className="right-sidebar" style={{ width: `${width}px` }}>
      <div className="sidebar-tabs">
        <TabButton
          icon="⚙️"
          label="属性"
          active={rightPanelTab === 'properties'}
          onClick={() => setRightPanelTab('properties')}
        />
        <TabButton
          icon="📊"
          label="数据库"
          active={rightPanelTab === 'database'}
          onClick={() => setRightPanelTab('database')}
        />
        <TabButton
          icon="⚡"
          label="事件"
          active={rightPanelTab === 'events'}
          onClick={() => setRightPanelTab('events')}
        />
        <TabButton
          icon="💻"
          label="控制台"
          active={rightPanelTab === 'console'}
          onClick={() => setRightPanelTab('console')}
        />
      </div>

      <div className="sidebar-content">
        {rightPanelTab === 'properties' && <PropertyPanel />}
        {rightPanelTab === 'database' && <DatabaseEditor />}
        {rightPanelTab === 'events' && <EventPanel />}
        {rightPanelTab === 'console' && <ConsolePanel />}
      </div>
    </aside>
  )
}

function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button className={`sidebar-tab ${active ? 'active' : ''}`} onClick={onClick}>
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  )
}
