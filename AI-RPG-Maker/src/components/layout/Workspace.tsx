// ============================================================================
// Workspace - Main Editor Area
// ============================================================================

import { useLayoutStore } from '../../stores/layoutStore'
import TileMapEditor from '../TileMapEditor'
import NPCEditor from '../NPCEditor'
import EventEditor from '../EventEditor'
import QuestEditor from '../QuestEditor'
import GamePreview from '../GamePreview'
import AIWorldGenerator from '../AIWorldGenerator'
import AIMusicGenerator from '../AIMusicGenerator'
import MultiplayerSystem from '../MultiplayerSystem'
import Marketplace from '../Marketplace'
import CloudPanel from '../CloudPanel'
import Settings from '../Settings'

// Lazy load components that might not exist
// @ts-ignore - Legacy components
const LegacyEditor = ({ type }: { type: string }) => {
  const ComponentMap: Record<string, React.ComponentType> = {
    npc: NPCEditor,
    quest: QuestEditor,
    runtime: GamePreview,
    ai: AIWorldGenerator,
    music: AIMusicGenerator,
    multiplayer: MultiplayerSystem,
    market: Marketplace,
    cloud: CloudPanel,
    settings: Settings,
  }
  const Component = ComponentMap[type]
  return Component ? <Component /> : <div className="workspace-placeholder">编辑器即将推出</div>
}
import './MainLayout.css'

interface WorkspaceProps {
  leftPanel: number
  rightPanel: number
  bottomPanel: number
}

export default function Workspace({ leftPanel, rightPanel, bottomPanel }: WorkspaceProps) {
  const { currentMode } = useLayoutStore()

  const renderEditor = () => {
    switch (currentMode) {
      case 'map':
        return <TileMapEditor />
      case 'database':
        return <div className="workspace-placeholder">请使用右侧面板的数据库编辑器</div>
      case 'event':
        return <EventEditor />
      case 'battle':
        return <div className="workspace-placeholder">战斗设置编辑器 - 即将推出</div>
      case 'resources':
        return <div className="workspace-placeholder">请使用左侧面板的资源管理器</div>
      case 'animation':
        return <div className="workspace-placeholder">动画编辑器 - 即将推出</div>
      case 'script':
        return <div className="workspace-placeholder">脚本编辑器 - 即将推出</div>
      case 'npc':
      case 'quest':
      case 'runtime':
      case 'ai':
      case 'music':
      case 'multiplayer':
      case 'market':
      case 'cloud':
      case 'settings':
        return <LegacyEditor type={currentMode} />
      default:
        return <TileMapEditor />
    }
  }

  return (
    <main
      className="workspace"
      style={{
        marginLeft: `${leftPanel}px`,
        marginRight: `${rightPanel}px`,
        marginBottom: `${bottomPanel}px`,
      }}
    >
      {renderEditor()}
    </main>
  )
}
