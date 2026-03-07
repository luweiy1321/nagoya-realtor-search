import { useDatabaseStore } from '../../../stores/databaseStore'
import type { SystemSettings } from '../../../types/database'

export default function SystemEditor() {
  const { database, updateSystem } = useDatabaseStore()

  return (
    <div className="db-editor-form">
      <div className="form-section">
        <h5>游戏信息</h5>
        <div className="form-group">
          <label>游戏标题</label>
          <input type="text" value={database.system.gameTitle} onChange={(e) => updateSystem({ gameTitle: e.target.value })} />
        </div>
      </div>

      <div className="form-section">
        <h5>术语设置</h5>
        <div className="form-group">
          <label>等级</label>
          <input type="text" value={database.system.terms.level} onChange={(e) => updateSystem({
            terms: { ...database.system.terms, level: e.target.value }
          })} />
        </div>
        <div className="form-group">
          <label>HP</label>
          <input type="text" value={database.system.terms.hp} onChange={(e) => updateSystem({
            terms: { ...database.system.terms, hp: e.target.value }
          })} />
        </div>
        <div className="form-group">
          <label>MP</label>
          <input type="text" value={database.system.terms.mp} onChange={(e) => updateSystem({
            terms: { ...database.system.terms, mp: e.target.value }
          })} />
        </div>
        <div className="form-group">
          <label>货币单位</label>
          <input type="text" value={database.system.currencyUnit} onChange={(e) => updateSystem({ currencyUnit: e.target.value })} />
        </div>
      </div>

      <div className="form-section">
        <h5>系统设置</h5>
        <div className="form-group">
          <label>存档槽位数</label>
          <input type="number" min="1" max="99" value={database.system.saveSlots} onChange={(e) => updateSystem({ saveSlots: parseInt(e.target.value) || 20 })} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>画面宽度</label>
            <input type="number" step="8" value={database.system.screenWidth} onChange={(e) => updateSystem({ screenWidth: parseInt(e.target.value) || 816 })} />
          </div>
          <div className="form-group">
            <label>画面高度</label>
            <input type="number" step="8" value={database.system.screenHeight} onChange={(e) => updateSystem({ screenHeight: parseInt(e.target.value) || 624 })} />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h5>初始队伍</h5>
        <div className="form-group">
          <label>初始角色ID (逗号分隔)</label>
          <input type="text" value={database.system.partyMembers.join(',')} onChange={(e) => updateSystem({
            partyMembers: e.target.value.split(',').filter(Boolean)
          })} />
        </div>
      </div>
    </div>
  )
}
