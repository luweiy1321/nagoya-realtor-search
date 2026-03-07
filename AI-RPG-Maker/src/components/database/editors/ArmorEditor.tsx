import { useDatabaseStore } from '../../../stores/databaseStore'
import type { Armor } from '../../../types/database'

interface ArmorEditorProps {
  armor: Armor | null
}

export default function ArmorEditor({ armor }: ArmorEditorProps) {
  if (!armor) return <div>未选择护甲</div>

  const { updateArmor } = useDatabaseStore()

  return (
    <div className="db-editor-form">
      <div className="form-section">
        <h5>基本信息</h5>
        <div className="form-group">
          <label>名称</label>
          <input type="text" value={armor.name} onChange={(e) => updateArmor(armor.id, { name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>描述</label>
          <textarea value={armor.description} onChange={(e) => updateArmor(armor.id, { description: e.target.value })} rows={2} />
        </div>
        <div className="form-group">
          <label>价格</label>
          <input type="number" min="0" value={armor.price} onChange={(e) => updateArmor(armor.id, { price: parseInt(e.target.value) || 0 })} />
        </div>
      </div>

      <div className="form-section">
        <h5>参数加成</h5>
        <div className="form-row">
          <div className="form-group"><label>攻击</label><input type="number" value={armor.params.atk} onChange={(e) => updateArmor(armor.id, { params: { ...armor.params, atk: parseInt(e.target.value) || 0 } })} /></div>
          <div className="form-group"><label>防御</label><input type="number" value={armor.params.def} onChange={(e) => updateArmor(armor.id, { params: { ...armor.params, def: parseInt(e.target.value) || 0 } })} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>魔攻</label><input type="number" value={armor.params.mat} onChange={(e) => updateArmor(armor.id, { params: { ...armor.params, mat: parseInt(e.target.value) || 0 } })} /></div>
          <div className="form-group"><label>魔防</label><input type="number" value={armor.params.mdf} onChange={(e) => updateArmor(armor.id, { params: { ...armor.params, mdf: parseInt(e.target.value) || 0 } })} /></div>
        </div>
      </div>
    </div>
  )
}
