// ============================================================================
// Actor Editor - Edit character/hero properties
// ============================================================================

import { useDatabaseStore } from '../../../stores/databaseStore'
import type { Actor } from '../../../types/database'

interface ActorEditorProps {
  actor: Actor | null
}

export default function ActorEditor({ actor }: ActorEditorProps) {
  if (!actor) return <div>未选择角色</div>

  const { updateActor } = useDatabaseStore()

  return (
    <div className="db-editor-form">
      {/* Basic Info */}
      <div className="form-section">
        <h5>基本信息</h5>
        <div className="form-group">
          <label>名称</label>
          <input
            type="text"
            value={actor.name}
            onChange={(e) => updateActor(actor.id, { name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>昵称</label>
          <input
            type="text"
            value={actor.nickname}
            onChange={(e) => updateActor(actor.id, { nickname: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>职业</label>
          <select
            value={actor.classId}
            onChange={(e) => updateActor(actor.id, { classId: e.target.value })}
          >
            <option value="">无职业</option>
            {/* Will be populated with classes */}
          </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>初始等级</label>
            <input
              type="number"
              min="1"
              max="99"
              value={actor.initialLevel}
              onChange={(e) => updateActor(actor.id, { initialLevel: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div className="form-group">
            <label>最大等级</label>
            <input
              type="number"
              min="1"
              max="99"
              value={actor.maxLevel}
              onChange={(e) => updateActor(actor.id, { maxLevel: parseInt(e.target.value) || 99 })}
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="form-section">
        <h5>图像</h5>
        <div className="form-group">
          <label>脸部图像</label>
          <input
            type="text"
            value={actor.faceImage}
            onChange={(e) => updateActor(actor.id, { faceImage: e.target.value })}
            placeholder="filename.png"
          />
        </div>
        <div className="form-group">
          <label>行走图</label>
          <input
            type="text"
            value={actor.characterImage}
            onChange={(e) => updateActor(actor.id, { characterImage: e.target.value })}
            placeholder="filename.png"
          />
        </div>
        <div className="form-group">
          <label>战斗图</label>
          <input
            type="text"
            value={actor.battlerImage}
            onChange={(e) => updateActor(actor.id, { battlerImage: e.target.value })}
            placeholder="filename.png"
          />
        </div>
      </div>

      {/* Description */}
      <div className="form-section">
        <h5>简介</h5>
        <div className="form-group">
          <label>人物介绍</label>
          <textarea
            value={actor.profile}
            onChange={(e) => updateActor(actor.id, { profile: e.target.value })}
            rows={4}
            placeholder="角色背景故事..."
          />
        </div>
      </div>

      {/* Initial Equipment */}
      <div className="form-section">
        <h5>初始装备</h5>
        <div className="form-group">
          <label>武器</label>
          <input
            type="text"
            value={actor.equips.weaponId || ''}
            onChange={(e) => updateActor(actor.id, {
              equips: { ...actor.equips, weaponId: e.target.value || null }
            })}
            placeholder="武器ID"
          />
        </div>
        <div className="form-group">
          <label>盾牌</label>
          <input
            type="text"
            value={actor.equips.shieldId || ''}
            onChange={(e) => updateActor(actor.id, {
              equips: { ...actor.equips, shieldId: e.target.value || null }
            })}
            placeholder="盾牌ID"
          />
        </div>
        <div className="form-group">
          <label>头部</label>
          <input
            type="text"
            value={actor.equips.headId || ''}
            onChange={(e) => updateActor(actor.id, {
              equips: { ...actor.equips, headId: e.target.value || null }
            })}
            placeholder="头部装备ID"
          />
        </div>
        <div className="form-group">
          <label>身体</label>
          <input
            type="text"
            value={actor.equips.bodyId || ''}
            onChange={(e) => updateActor(actor.id, {
              equips: { ...actor.equips, bodyId: e.target.value || null }
            })}
            placeholder="身体装备ID"
          />
        </div>
        <div className="form-group">
          <label>饰品</label>
          <input
            type="text"
            value={actor.equips.accessoryId || ''}
            onChange={(e) => updateActor(actor.id, {
              equips: { ...actor.equips, accessoryId: e.target.value || null }
            })}
            placeholder="饰品ID"
          />
        </div>
      </div>

      {/* Learned Skills */}
      <div className="form-section">
        <h5>习得技能</h5>
        <div className="skills-list">
          {actor.skills.length === 0 ? (
            <p className="empty-text">暂无技能</p>
          ) : (
            actor.skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <input
                  type="text"
                  value={skill.skillId}
                  onChange={(e) => {
                    const newSkills = [...actor.skills]
                    newSkills[index] = { ...skill, skillId: e.target.value }
                    updateActor(actor.id, { skills: newSkills })
                  }}
                  placeholder="技能ID"
                />
                <span className="skill-level-label">Lv.</span>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={skill.level}
                  onChange={(e) => {
                    const newSkills = [...actor.skills]
                    newSkills[index] = { ...skill, level: parseInt(e.target.value) || 1 }
                    updateActor(actor.id, { skills: newSkills })
                  }}
                  className="level-input"
                />
                <button
                  className="remove-btn"
                  onClick={() => {
                    const newSkills = actor.skills.filter((_, i) => i !== index)
                    updateActor(actor.id, { skills: newSkills })
                  }}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
        <button
          className="add-skill-btn"
          onClick={() => {
            updateActor(actor.id, {
              skills: [...actor.skills, { skillId: '', level: 1 }]
            })
          }}
        >
          + 添加技能
        </button>
      </div>
    </div>
  )
}
