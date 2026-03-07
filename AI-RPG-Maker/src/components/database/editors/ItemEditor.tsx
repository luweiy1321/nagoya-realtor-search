import { useDatabaseStore } from '../../../stores/databaseStore'
import type { Item } from '../../../types/database'

interface ItemEditorProps {
  item: Item | null
}

export default function ItemEditor({ item }: ItemEditorProps) {
  if (!item) return <div>未选择物品</div>

  const { updateItem } = useDatabaseStore()

  return (
    <div className="db-editor-form">
      <div className="form-section">
        <h5>基本信息</h5>
        <div className="form-group">
          <label>名称</label>
          <input type="text" value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>描述</label>
          <textarea value={item.description} onChange={(e) => updateItem(item.id, { description: e.target.value })} rows={2} />
        </div>
        <div className="form-group">
          <label>图标索引</label>
          <input type="number" value={item.iconIndex} onChange={(e) => updateItem(item.id, { iconIndex: parseInt(e.target.value) })} />
        </div>
        <div className="form-group">
          <label>价格</label>
          <input type="number" min="0" value={item.price} onChange={(e) => updateItem(item.id, { price: parseInt(e.target.value) || 0 })} />
        </div>
        <div className="form-group checkbox-group">
          <label>
            <input type="checkbox" checked={item.consumable} onChange={(e) => updateItem(item.id, { consumable: e.target.checked })} />
            消耗品
          </label>
          <label>
            <input type="checkbox" checked={item.keyItem} onChange={(e) => updateItem(item.id, { keyItem: e.target.checked })} />
            关键物品
          </label>
        </div>
      </div>
    </div>
  )
}
