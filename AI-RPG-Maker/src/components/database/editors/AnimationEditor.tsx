import { useDatabaseStore } from '../../../stores/databaseStore'
import type { Animation } from '../../../types/database'

interface AnimationEditorProps {
  animation: Animation | null
}

export default function AnimationEditor({ animation }: AnimationEditorProps) {
  if (!animation) return <div>未选择动画</div>

  const { updateAnimation } = useDatabaseStore()

  return (
    <div className="db-editor-form">
      <div className="form-section">
        <h5>基本信息</h5>
        <div className="form-group">
          <label>名称</label>
          <input type="text" value={animation.name} onChange={(e) => updateAnimation(animation.id, { name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>显示位置</label>
          <select value={animation.position} onChange={(e) => updateAnimation(animation.id, { position: e.target.value as any })}>
            <option value="head">头部</option>
            <option value="center">中心</option>
            <option value="base">脚部</option>
            <option value="screen">屏幕</option>
          </select>
        </div>
      </div>

      <div className="form-section">
        <h5>基础动画</h5>
        <div className="form-group">
          <label>文件名</label>
          <input type="text" value={animation.animation1Name} onChange={(e) => updateAnimation(animation.id, { animation1Name: e.target.value })} />
        </div>
      </div>
    </div>
  )
}
