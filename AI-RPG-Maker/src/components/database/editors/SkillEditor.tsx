import { useDatabaseStore } from '../../../stores/databaseStore'
import type { Skill } from '../../../types/database'

interface SkillEditorProps {
  skill: Skill | null
}

export default function SkillEditor({ skill }: SkillEditorProps) {
  if (!skill) return <div>未选择技能</div>

  const { updateSkill } = useDatabaseStore()

  return (
    <div className="db-editor-form">
      <div className="form-section">
        <h5>基本信息</h5>
        <div className="form-group">
          <label>名称</label>
          <input type="text" value={skill.name} onChange={(e) => updateSkill(skill.id, { name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>描述</label>
          <textarea value={skill.description} onChange={(e) => updateSkill(skill.id, { description: e.target.value })} rows={2} />
        </div>
        <div className="form-group">
          <label>图标索引</label>
          <input type="number" value={skill.iconIndex} onChange={(e) => updateSkill(skill.id, { iconIndex: parseInt(e.target.value) })} />
        </div>
      </div>

      <div className="form-section">
        <h5>使用条件</h5>
        <div className="form-group">
          <label>作用范围</label>
          <select value={skill.scope} onChange={(e) => updateSkill(skill.id, { scope: e.target.value as any })}>
            <option value="none">无效果</option>
            <option value="one_enemy">敌单体</option>
            <option value="all_enemies">敌全体</option>
            <option value="one_ally">我方单体</option>
            <option value="all_allies">我方全体</option>
            <option value="user">使用者</option>
          </select>
        </div>
        <div className="form-group">
          <label>使用时机</label>
          <select value={skill.occasion} onChange={(e) => updateSkill(skill.id, { occasion: e.target.value as any })}>
            <option value="always">始终</option>
            <option value="battle">仅战斗</option>
            <option value="menu">仅菜单</option>
          </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>MP消耗</label>
            <input type="number" min="0" value={skill.mpCost} onChange={(e) => updateSkill(skill.id, { mpCost: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="form-group">
            <label>TP消耗</label>
            <input type="number" min="0" value={skill.tpCost} onChange={(e) => updateSkill(skill.id, { tpCost: parseInt(e.target.value) || 0 })} />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h5>伤害计算</h5>
        <div className="form-group">
          <label>类型</label>
          <select value={skill.damage.type} onChange={(e) => updateSkill(skill.id, { damage: { ...skill.damage, type: e.target.value as any } })}>
            <option value="none">无伤害</option>
            <option value="hp">HP伤害</option>
            <option value="mp">MP伤害</option>
            <option value="recover_hp">HP恢复</option>
            <option value="recover_mp">MP恢复</option>
          </select>
        </div>
        <div className="form-group">
          <label>计算公式</label>
          <input type="text" value={skill.damage.formula} onChange={(e) => updateSkill(skill.id, { damage: { ...skill.damage, formula: e.target.value } })} placeholder="a.atk * 2 - b.def" />
        </div>
      </div>
    </div>
  )
}
