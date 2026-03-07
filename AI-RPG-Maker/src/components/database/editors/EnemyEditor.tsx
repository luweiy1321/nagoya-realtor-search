import { useDatabaseStore } from '../../../stores/databaseStore'
import type { Enemy } from '../../../types/database'

interface EnemyEditorProps {
  enemy: Enemy | null
}

export default function EnemyEditor({ enemy }: EnemyEditorProps) {
  if (!enemy) return <div>未选择敌人</div>

  const { updateEnemy } = useDatabaseStore()

  return (
    <div className="db-editor-form">
      <div className="form-section">
        <h5>基本信息</h5>
        <div className="form-group">
          <label>名称</label>
          <input type="text" value={enemy.name} onChange={(e) => updateEnemy(enemy.id, { name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>战斗图</label>
          <input type="text" value={enemy.battlerImage} onChange={(e) => updateEnemy(enemy.id, { battlerImage: e.target.value })} />
        </div>
      </div>

      <div className="form-section">
        <h5>参数</h5>
        <div className="form-row">
          <div className="form-group"><label>攻击</label><input type="number" value={enemy.params.atk} onChange={(e) => updateEnemy(enemy.id, { params: { ...enemy.params, atk: parseInt(e.target.value) || 0 } })} /></div>
          <div className="form-group"><label>防御</label><input type="number" value={enemy.params.def} onChange={(e) => updateEnemy(enemy.id, { params: { ...enemy.params, def: parseInt(e.target.value) || 0 } })} /></div>
        </div>
      </div>

      <div className="form-section">
        <h5>掉落物品</h5>
        {enemy.dropItems.map((drop, index) => (
          <div key={index} className="drop-item">
            <select value={drop.kind} onChange={(e) => {
              const newDrops = [...enemy.dropItems]
              newDrops[index] = { ...drop, kind: e.target.value as any }
              updateEnemy(enemy.id, { dropItems: newDrops })
            }}>
              <option value="none">无</option>
              <option value="item">物品</option>
              <option value="weapon">武器</option>
              <option value="gold">金币</option>
            </select>
            {drop.kind !== 'none' && drop.kind !== 'gold' && (
              <input type="text" value={drop.dataId} onChange={(e) => {
                const newDrops = [...enemy.dropItems]
                newDrops[index] = { ...drop, dataId: e.target.value }
                updateEnemy(enemy.id, { dropItems: newDrops })
              }} placeholder="ID" />
            )}
            <input type="number" value={drop.denominator} onChange={(e) => {
              const newDrops = [...enemy.dropItems]
              newDrops[index] = { ...drop, denominator: parseInt(e.target.value) || 1 }
              updateEnemy(enemy.id, { dropItems: newDrops })
            }} placeholder="1/x" />
          </div>
        ))}
      </div>
    </div>
  )
}
