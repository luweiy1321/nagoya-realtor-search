// ============================================================================
// Left Sidebar - Resource and Layer Management
// ============================================================================

import { useLayoutStore } from '../../stores/layoutStore'
import ResourceManager from '../resources/ResourceManager'
import LayerPanel from './LayerPanel'
import './MainLayout.css'

interface LeftSidebarProps {
  width: number
}

export default function LeftSidebar({ width }: LeftSidebarProps) {
  const { leftPanelTab, setLeftPanelTab } = useLayoutStore()

  return (
    <aside className="left-sidebar" style={{ width: `${width}px` }}>
      <div className="sidebar-tabs">
        <TabButton
          icon="📁"
          label="资源"
          active={leftPanelTab === 'resources'}
          onClick={() => setLeftPanelTab('resources')}
        />
        <TabButton
          icon="📚"
          label="图层"
          active={leftPanelTab === 'layers'}
          onClick={() => setLeftPanelTab('layers')}
        />
      </div>

      <div className="sidebar-content">
        {leftPanelTab === 'resources' && <ResourceManager />}
        {leftPanelTab === 'layers' && <LayerPanel />}
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
