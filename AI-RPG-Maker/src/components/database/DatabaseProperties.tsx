// ============================================================================
// Database Properties - Editor for the selected database item
// ============================================================================

import { useDatabaseStore } from '../../stores/databaseStore'
import ActorEditor from './editors/ActorEditor'
import ClassEditor from './editors/ClassEditor'
import SkillEditor from './editors/SkillEditor'
import ItemEditor from './editors/ItemEditor'
import WeaponEditor from './editors/WeaponEditor'
import ArmorEditor from './editors/ArmorEditor'
import EnemyEditor from './editors/EnemyEditor'
import TroopEditor from './editors/TroopEditor'
import StateEditor from './editors/StateEditor'
import AnimationEditor from './editors/AnimationEditor'
import TilesetEditor from './editors/TilesetEditor'
import CommonEventEditor from './editors/CommonEventEditor'
import SystemEditor from './editors/SystemEditor'
import './DatabaseEditor.css'

export default function DatabaseProperties() {
  const { selectedSection, selectedId, database } = useDatabaseStore()

  if (!selectedId) {
    return (
      <div className="db-properties-container">
        <div className="db-empty-selection">
          <span className="empty-icon">📋</span>
          <p>请选择一个项目进行编辑</p>
        </div>
      </div>
    )
  }

  const renderEditor = () => {
    switch (selectedSection) {
      case 'actors':
        return <ActorEditor actor={database.actors.find(a => a.id === selectedId) || null} />
      case 'classes':
        return <ClassEditor class={database.classes.find(c => c.id === selectedId) || null} />
      case 'skills':
        return <SkillEditor skill={database.skills.find(s => s.id === selectedId) || null} />
      case 'items':
        return <ItemEditor item={database.items.find(i => i.id === selectedId) || null} />
      case 'weapons':
        return <WeaponEditor weapon={database.weapons.find(w => w.id === selectedId) || null} />
      case 'armors':
        return <ArmorEditor armor={database.armors.find(a => a.id === selectedId) || null} />
      case 'enemies':
        return <EnemyEditor enemy={database.enemies.find(e => e.id === selectedId) || null} />
      case 'troops':
        return <TroopEditor troop={database.troops.find(t => t.id === selectedId) || null} />
      case 'states':
        return <StateEditor state={database.states.find(s => s.id === selectedId) || null} />
      case 'animations':
        return <AnimationEditor animation={database.animations.find(a => a.id === selectedId) || null} />
      case 'tilesets':
        return <TilesetEditor tileset={database.tilesets.find(t => t.id === selectedId) || null} />
      case 'commonEvents':
        return <CommonEventEditor commonEvent={database.commonEvents.find(e => e.id === selectedId) || null} />
      case 'system':
        return <SystemEditor />
      default:
        return <div className="db-no-editor">此类型的编辑器尚未实现</div>
    }
  }

  return (
    <div className="db-properties-container">
      <div className="db-properties-header">
        <h4>属性编辑</h4>
        <span className="item-id-display">ID: {selectedId}</span>
      </div>
      <div className="db-properties-content">
        {renderEditor()}
      </div>
    </div>
  )
}
