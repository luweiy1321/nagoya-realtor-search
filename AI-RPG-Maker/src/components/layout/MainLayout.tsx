// ============================================================================
// Main Layout - RPG Maker MZ Style Multi-Panel Layout
// ============================================================================

import { useLayoutStore } from '../../stores/layoutStore'
import { useKeyboardShortcuts } from '../../services/keyboardManager'
import TopMenuBar from './TopMenuBar'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import BottomPanel from './BottomPanel'
import Workspace from './Workspace'
import './MainLayout.css'

export default function MainLayout() {
  // Initialize keyboard shortcuts
  useKeyboardShortcuts()
  const {
    leftPanelVisible,
    leftPanelWidth,
    rightPanelVisible,
    rightPanelWidth,
    bottomPanelVisible,
    bottomPanelHeight,
    menuBarVisible,
  } = useLayoutStore()

  return (
    <div className="main-layout">
      {/* Top Menu Bar */}
      {menuBarVisible && <TopMenuBar />}

      {/* Main Content Area */}
      <div className="layout-content">
        {/* Left Sidebar */}
        {leftPanelVisible && (
          <LeftSidebar width={leftPanelWidth} />
        )}

        {/* Center Workspace */}
        <Workspace
          leftPanel={leftPanelVisible ? leftPanelWidth : 0}
          rightPanel={rightPanelVisible ? rightPanelWidth : 0}
          bottomPanel={bottomPanelVisible ? bottomPanelHeight : 0}
        />

        {/* Right Sidebar */}
        {rightPanelVisible && (
          <RightSidebar width={rightPanelWidth} />
        )}
      </div>

      {/* Bottom Panel (Console) */}
      {bottomPanelVisible && (
        <BottomPanel height={bottomPanelHeight} />
      )}
    </div>
  )
}
