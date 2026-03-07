import { useDatabaseStore } from '../../../stores/databaseStore'
import type { Troop } from '../../../types/database'

interface TroopEditorProps {
  troop: Troop | null
}

export default function TroopEditor({ troop }: TroopEditorProps) {
  if (!troop) return <div>未选择敌群</div>

  const { updateTroop } = useDatabaseStore()

  return (
    <div className="db-editor-form">
      <div className="form-section">
        <h5>基本信息</h5>
        <div className="form-group">
          <label>名称</label>
          <input type="text" value={troop.name} onChange={(e) => updateTroop(troop.id, { name: e.target.value })} />
        </div>
      </div>

      <div className="form-section">
        <h5>敌群成员</h5>
        {troop.members.map((member, index) => (
          <div key={index} className="member-item">
            <input type="text" value={member.enemyId} onChange={(e) => {
              const newMembers = [...troop.members]
              newMembers[index] = { ...member, enemyId: e.target.value }
              updateTroop(troop.id, { members: newMembers })
            }} placeholder="敌人ID" />
            <input type="number" value={member.x} onChange={(e) => {
              const newMembers = [...troop.members]
              newMembers[index] = { ...member, x: parseInt(e.target.value) || 0 }
              updateTroop(troop.id, { members: newMembers })
            }} placeholder="X" />
            <input type="number" value={member.y} onChange={(e) => {
              const newMembers = [...troop.members]
              newMembers[index] = { ...member, y: parseInt(e.target.value) || 0 }
              updateTroop(troop.id, { members: newMembers })
            }} placeholder="Y" />
            <label><input type="checkbox" checked={member.hidden} onChange={(e) => {
              const newMembers = [...troop.members]
              newMembers[index] = { ...member, hidden: e.target.checked }
              updateTroop(troop.id, { members: newMembers })
            }} />隐藏</label>
            <button onClick={() => {
              const newMembers = troop.members.filter((_, i) => i !== index)
              updateTroop(troop.id, { members: newMembers })
            }}>×</button>
          </div>
        ))}
        <button onClick={() => updateTroop(troop.id, {
          members: [...troop.members, { enemyId: '', x: 0, y: 0, hidden: false }]
        })}>+ 添加敌人</button>
      </div>

      <div className="form-section">
        <h5>战斗事件</h5>
        {troop.pages.map((page, index) => (
          <div key={index} className="page-item">
            <h6>页面 {index + 1}</h6>
            <p>条件设置...</p>
            <p>命令列表长度: {page.list.length}</p>
          </div>
        ))}
        <button onClick={() => updateTroop(troop.id, {
          pages: [...troop.pages, {
            conditions: {
              turnEnding: false,
              turnValid: false,
              turnA: 0,
              turnB: 0,
              enemyValid: false,
              enemyHp: 0,
              enemyIndex: 0,
              actorValid: false,
              actorHp: 0,
              actorId: '',
              switchValid: false,
              switchId: '',
            },
            list: []
          }]
        })}>+ 添加页面</button>
      </div>
    </div>
  )
}
