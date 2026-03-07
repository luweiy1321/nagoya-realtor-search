// ============================================================================
// Database List - Shows items in the currently selected section
// ============================================================================

import { useDatabaseStore } from '../../stores/databaseStore'
import { useItemList } from '../../stores/databaseStore'
import { DATABASE_SECTION_NAMES } from '../../constants/database'
import './DatabaseEditor.css'

export default function DatabaseList() {
  const { selectedSection, setSelectedId, selectedId, database } = useDatabaseStore()
  const items = useItemList(selectedSection)

  // Get the add function based on section
  const getAddFunction = () => {
    const store = useDatabaseStore.getState()
    switch (selectedSection) {
      case 'actors': return store.addActor
      case 'classes': return store.addClass
      case 'skills': return store.addSkill
      case 'items': return store.addItem
      case 'weapons': return store.addWeapon
      case 'armors': return store.addArmor
      case 'enemies': return store.addEnemy
      case 'troops': return store.addTroop
      case 'states': return store.addState
      case 'animations': return store.addAnimation
      case 'tilesets': return store.addTileset
      case 'commonEvents': return store.addCommonEvent
      default: return null
    }
  }

  // Get the delete function based on section
  const getDeleteFunction = (id: string) => {
    const store = useDatabaseStore.getState()
    switch (selectedSection) {
      case 'actors': return () => store.deleteActor(id)
      case 'classes': return () => store.deleteClass(id)
      case 'skills': return () => store.deleteSkill(id)
      case 'items': return () => store.deleteItem(id)
      case 'weapons': return () => store.deleteWeapon(id)
      case 'armors': return () => store.deleteArmor(id)
      case 'enemies': return () => store.deleteEnemy(id)
      case 'troops': return () => store.deleteTroop(id)
      case 'states': return () => store.deleteState(id)
      case 'animations': return () => store.deleteAnimation(id)
      case 'tilesets': return () => store.deleteTileset(id)
      case 'commonEvents': return () => store.deleteCommonEvent(id)
      default: return null
    }
  }

  // Get item name helper
  const getItemName = (item: any): string => {
    if (!item) return ''
    if (selectedSection === 'system') {
      return database.system.gameTitle || '系统设置'
    }
    return item.name || item.id || '未命名'
  }

  const addItem = getAddFunction()
  const sectionName = DATABASE_SECTION_NAMES[selectedSection as keyof typeof DATABASE_SECTION_NAMES] || selectedSection

  return (
    <div className="db-list-container">
      <div className="db-list-header">
        <h4>{sectionName}列表</h4>
        {addItem && (
          <button className="add-btn" onClick={addItem}>
            + 新建
          </button>
        )}
      </div>

      <div className="db-list-items">
        {selectedSection === 'system' ? (
          <div
            className={`db-list-item ${selectedId === 'system' ? 'selected' : ''}`}
            onClick={() => setSelectedId('system')}
          >
            <span className="item-icon">⚙️</span>
            <span className="item-name">{database.system.gameTitle || '系统设置'}</span>
          </div>
        ) : items.length === 0 ? (
          <div className="db-empty">
            <p>暂无{sectionName}</p>
            {addItem && (
              <button className="add-first-btn" onClick={addItem}>
                创建第一个{sectionName}
              </button>
            )}
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`db-list-item ${selectedId === item.id ? 'selected' : ''}`}
              onClick={() => setSelectedId(item.id)}
            >
              <span className="item-id">#{items.indexOf(item) + 1}</span>
              <span className="item-name">{getItemName(item)}</span>
              <button
                className="delete-item-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  const deleteFn = getDeleteFunction(item.id)
                  if (deleteFn && confirm(`确定要删除"${getItemName(item)}"吗？`)) {
                    deleteFn()
                  }
                }}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      <div className="db-list-footer">
        <span className="item-count">
          {selectedSection === 'system' ? 1 : items.length} 个项目
        </span>
      </div>
    </div>
  )
}
