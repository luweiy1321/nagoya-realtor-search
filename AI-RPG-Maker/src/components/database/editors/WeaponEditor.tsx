import { useDatabaseStore } from '../../../stores/databaseStore'
import type { Weapon } from '../../../types/database'

interface WeaponEditorProps {
  weapon: Weapon | null
}

export default function WeaponEditor({ weapon }: WeaponEditorProps) {
  if (!weapon) return <div>未选择武器</div>

  const { updateWeapon } = useDatabaseStore()

  return (
    <div className="db-editor-form">
      <div className="form-section">
        <h5>基本信息</h5>
        <div className="form-group">
          <label>名称</label>
          <input type="text" value={weapon.name} onChange={(e) => updateWeapon(weapon.id, { name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>描述</label>
          <textarea value={weapon.description} onChange={(e) => updateWeapon(weapon.id, { description: e.target.value })} rows={2} />
        </div>
        <div className="form-group">
          <label>价格</label>
          <input type="number" min="0" value={weapon.price} onChange={(e) => updateWeapon(weapon.id, { price: parseInt(e.target.value) || 0 })} />
        </div>
      </div>

      <div className="form-section">
        <h5>参数加成</h5>
        <div className="form-row">
          <div className="form-group"><label>攻击</label><input type="number" value={weapon.params.atk} onChange={(e) => updateWeapon(weapon.id, { params: { ...weapon.params, atk: parseInt(e.target.value) || 0 } })} /></div>
          <div className="form-group"><label>防御</label><input type="number" value={weapon.params.def} onChange={(e) => updateWeapon(weapon.id, { params: { ...weapon.params, def: parseInt(e.target.value) || 0 } })} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>魔攻</label><input type="number" value={weapon.params.mat} onChange={(e) => updateWeapon(weapon.id, { params: { ...weapon.params, mat: parseInt(e.target.value) || 0 } })} /></div>
          <div className="form-group"><label>魔防</label><input type="number" value={weapon.params.mdf} onChange={(e) => updateWeapon(weapon.id, { params: { ...weapon.params, mdf: parseInt(e.target.value) || 0 } })} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>敏捷</label><input type="number" value={weapon.params.agi} onChange={(e) => updateWeapon(weapon.id, { params: { ...weapon.params, agi: parseInt(e.target.value) || 0 } })} /></div>
          <div className="form-group"><label>幸运</label><input type="number" value={weapon.params.luk} onChange={(e) => updateWeapon(weapon.id, { params: { ...weapon.params, luk: parseInt(e.target.value) || 0 } })} /></div>
        </div>
      </div>
    </div>
  )
}
