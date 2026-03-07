import { useDatabaseStore } from '../../../stores/databaseStore'
import type { Class } from '../../../types/database'

interface ClassEditorProps {
  class: Class | null
}

export default function ClassEditor({ class: classData }: ClassEditorProps) {
  if (!classData) return <div>未选择职业</div>

  const { updateClass } = useDatabaseStore()

  return (
    <div className="db-editor-form">
      <div className="form-section">
        <h5>基本信息</h5>
        <div className="form-group">
          <label>名称</label>
          <input
            type="text"
            value={classData.name}
            onChange={(e) => updateClass(classData.id, { name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>描述</label>
          <textarea
            value={classData.description}
            onChange={(e) => updateClass(classData.id, { description: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      <div className="form-section">
        <h5>习得技能</h5>
        {classData.learnings.map((learning, index) => (
          <div key={index} className="learning-item">
            <input
              type="text"
              value={learning.skillId}
              onChange={(e) => {
                const newLearnings = [...classData.learnings]
                newLearnings[index] = { ...learning, skillId: e.target.value }
                updateClass(classData.id, { learnings: newLearnings })
              }}
              placeholder="技能ID"
            />
            <span>等级</span>
            <input
              type="number"
              min="1"
              value={learning.level}
              onChange={(e) => {
                const newLearnings = [...classData.learnings]
                newLearnings[index] = { ...learning, level: parseInt(e.target.value) || 1 }
                updateClass(classData.id, { learnings: newLearnings })
              }}
            />
            <button onClick={() => {
              const newLearnings = classData.learnings.filter((_, i) => i !== index)
              updateClass(classData.id, { learnings: newLearnings })
            }}>×</button>
          </div>
        ))}
        <button onClick={() => updateClass(classData.id, {
          learnings: [...classData.learnings, { skillId: '', level: 1 }]
        })}>+ 添加</button>
      </div>
    </div>
  )
}
