import { useDatabaseStore } from '../../../stores/databaseStore'
import type { CommonEvent } from '../../../types/database'

interface CommonEventEditorProps {
  commonEvent: CommonEvent | null
}

export default function CommonEventEditor({ commonEvent }: CommonEventEditorProps) {
  if (!commonEvent) return <div>未选择公共事件</div>

  const { updateCommonEvent } = useDatabaseStore()

  return (
    <div className="db-editor-form">
      <div className="form-section">
        <h5>基本信息</h5>
        <div className="form-group">
          <label>名称</label>
          <input type="text" value={commonEvent.name} onChange={(e) => updateCommonEvent(commonEvent.id, { name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>触发条件</label>
          <select value={commonEvent.trigger} onChange={(e) => updateCommonEvent(commonEvent.id, { trigger: e.target.value as any })}>
            <option value="none">无</option>
            <option value="auto_run">自动执行</option>
            <option value="parallel">并行执行</option>
          </select>
        </div>
      </div>

      <div className="form-section">
        <h5>执行内容</h5>
        <div className="event-commands-list">
          {commonEvent.list.length === 0 ? (
            <p className="empty-text">暂无命令</p>
          ) : (
            commonEvent.list.map((cmd, index) => (
              <div key={index} className="command-item">
                <span className="command-code">{cmd.code}</span>
                <span className="command-indent">缩进: {cmd.indent}</span>
                <span className="command-params">{JSON.stringify(cmd.parameters)}</span>
              </div>
            ))
          )}
        </div>
        <p className="info-text">事件命令编辑器将在后续实现</p>
      </div>
    </div>
  )
}
