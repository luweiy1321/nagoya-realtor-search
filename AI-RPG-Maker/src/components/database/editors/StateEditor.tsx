import { useDatabaseStore } from '../../../stores/databaseStore'
import type { State } from '../../../types/database'

interface StateEditorProps {
  state: State | null
}

export default function StateEditor({ state }: StateEditorProps) {
  if (!state) return <div>未选择状态</div>

  const { updateState } = useDatabaseStore()

  return (
    <div className="db-editor-form">
      <div className="form-section">
        <h5>基本信息</h5>
        <div className="form-group">
          <label>名称</label>
          <input type="text" value={state.name} onChange={(e) => updateState(state.id, { name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>图标索引</label>
          <input type="number" value={state.iconIndex} onChange={(e) => updateState(state.id, { iconIndex: parseInt(e.target.value) })} />
        </div>
        <div className="form-group">
          <label>优先级</label>
          <input type="number" min="0" max="100" value={state.priority} onChange={(e) => updateState(state.id, { priority: parseInt(e.target.value) || 50 })} />
        </div>
      </div>

      <div className="form-section">
        <h5>解除设置</h5>
        <div className="form-group checkbox-group">
          <label><input type="checkbox" checked={state.removeAtBattleEnd} onChange={(e) => updateState(state.id, { removeAtBattleEnd: e.target.checked })} />战斗结束时解除</label>
          <label><input type="checkbox" checked={state.removeByWalking} onChange={(e) => updateState(state.id, { removeByWalking: e.target.checked })} />步行一定步数后解除</label>
        </div>
        {state.removeByWalking && (
          <div className="form-group">
            <label>解除步数</label>
            <input type="number" min="1" value={state.stepsToRemove} onChange={(e) => updateState(state.id, { stepsToRemove: parseInt(e.target.value) || 100 })} />
          </div>
        )}
      </div>

      <div className="form-section">
        <h5>消息</h5>
        <div className="form-group">
          <label>施加时</label>
          <input type="text" value={state.message1} onChange={(e) => updateState(state.id, { message1: e.target.value })} />
        </div>
        <div className="form-group">
          <label>持续中</label>
          <input type="text" value={state.message2} onChange={(e) => updateState(state.id, { message2: e.target.value })} />
        </div>
        <div className="form-group">
          <label>解除时</label>
          <input type="text" value={state.message3} onChange={(e) => updateState(state.id, { message3: e.target.value })} />
        </div>
      </div>
    </div>
  )
}
