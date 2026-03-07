import { useState } from 'react'
import './QuestEditor.css'

// 任务类型
interface Quest {
  id: string
  name: string
  description: string
  type: 'main' | 'side' | 'daily'
  requirements: QuestRequirement[]
  objectives: QuestObjective[]
  rewards: QuestReward[]
  stages: QuestStage[]
}

// 任务条件
interface QuestRequirement {
  id: string
  type: 'level' | 'quest' | 'item' | 'npc'
  params: Record<string, any>
}

// 任务目标
interface QuestObjective {
  id: string
  description: string
  type: 'talk' | 'kill' | 'collect' | 'reach' | 'use'
  target: string
  amount: number
  progress: number
}

// 奖励
interface QuestReward {
  type: 'exp' | 'gold' | 'item' | 'skill'
  amount: number
  itemId?: string
}

// 任务阶段
interface QuestStage {
  id: string
  name: string
  objectives: string[]
  nextStageId?: string
}

export default function QuestEditor() {
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: '1',
      name: '消灭哥布林',
      description: '前往森林消灭10只哥布林',
      type: 'main',
      requirements: [
        { id: 'r1', type: 'level', params: { minLevel: 1 } }
      ],
      objectives: [
        { id: 'o1', description: '消灭哥布林', type: 'kill', target: 'goblin', amount: 10, progress: 0 }
      ],
      rewards: [
        { type: 'exp', amount: 100 },
        { type: 'gold', amount: 50 }
      ],
      stages: [
        { id: 's1', name: '前往森林', objectives: ['o1'] }
      ]
    }
  ])
  const [selectedQuest, setSelectedQuest] = useState<string | null>('1')

  const currentQuest = quests.find(q => q.id === selectedQuest)

  const addQuest = (type: 'main' | 'side' | 'daily' = 'side') => {
    const newQuest: Quest = {
      id: crypto.randomUUID(),
      name: '新任务',
      description: '任务描述',
      type,
      requirements: [],
      objectives: [
        { id: crypto.randomUUID(), description: '新目标', type: 'talk', target: '', amount: 1, progress: 0 }
      ],
      rewards: [
        { type: 'exp', amount: 100 }
      ],
      stages: [
        { id: crypto.randomUUID(), name: '第一阶段', objectives: [] }
      ]
    }
    setQuests([...quests, newQuest])
    setSelectedQuest(newQuest.id)
  }

  const updateQuest = (id: string, updates: Partial<Quest>) => {
    setQuests(quests.map(q => q.id === id ? { ...q, ...updates } : q))
  }

  const deleteQuest = (id: string) => {
    setQuests(quests.filter(q => q.id !== id))
    if (selectedQuest === id) setSelectedQuest(null)
  }

  return (
    <div className="quest-editor">
      {/* 左侧：任务列表 */}
      <aside className="quest-list">
        <div className="quest-list-header">
          <h3>任务列表</h3>
          <div className="add-buttons">
            <button onClick={() => addQuest('main')} title="主线任务">主线</button>
            <button onClick={() => addQuest('side')} title="支线任务">支线</button>
            <button onClick={() => addQuest('daily')} title="日常任务">日常</button>
          </div>
        </div>
        
        <div className="quest-items">
          {quests.map(quest => (
            <div
              key={quest.id}
              className={`quest-item ${selectedQuest === quest.id ? 'selected' : ''}`}
              onClick={() => setSelectedQuest(quest.id)}
            >
              <div className={`quest-type-badge ${quest.type}`}>
                {quest.type === 'main' && '主线'}
                {quest.type === 'side' && '支线'}
                {quest.type === 'daily' && '日常'}
              </div>
              <div className="quest-info">
                <div className="quest-name">{quest.name}</div>
                <div className="quest-desc">{quest.description}</div>
              </div>
              <button className="delete-btn" onClick={(e) => {
                e.stopPropagation(); deleteQuest(quest.id)
              }}>×</button>
            </div>
          ))}
        </div>
      </aside>

      {/* 中间：任务属性 */}
      <div className="quest-properties">
        {currentQuest ? (
          <>
            <div className="property-section">
              <h4>基本信息</h4>
              <label>
                任务名称
                <input
                  type="text"
                  value={currentQuest.name}
                  onChange={(e) => updateQuest(currentQuest.id, { name: e.target.value })}
                />
              </label>
              <label>
                任务描述
                <textarea
                  value={currentQuest.description}
                  onChange={(e) => updateQuest(currentQuest.id, { description: e.target.value })}
                  rows={3}
                />
              </label>
              <label>
                任务类型
                <select
                  value={currentQuest.type}
                  onChange={(e) => updateQuest(currentQuest.id, { type: e.target.value as any })}
                >
                  <option value="main">主线任务</option>
                  <option value="side">支线任务</option>
                  <option value="daily">日常任务</option>
                </select>
              </label>
            </div>

            <div className="property-section">
              <h4>接取条件</h4>
              <div className="requirements">
                {currentQuest.requirements.map((req, idx) => (
                  <div key={req.id} className="requirement-item">
                    <select
                      value={req.type}
                      onChange={(e) => {
                        const newReqs = [...currentQuest.requirements]
                        newReqs[idx] = { ...req, type: e.target.value as any }
                        updateQuest(currentQuest.id, { requirements: newReqs })
                      }}
                    >
                      <option value="level">等级要求</option>
                      <option value="quest">前置任务</option>
                      <option value="item">物品要求</option>
                      <option value="npc">NPC要求</option>
                    </select>
                    {req.type === 'level' && (
                      <input
                        type="number"
                        placeholder="最低等级"
                        value={req.params.minLevel || ''}
                        onChange={(e) => {
                          const newReqs = [...currentQuest.requirements]
                          newReqs[idx] = { ...req, params: { ...req.params, minLevel: parseInt(e.target.value) }}
                          updateQuest(currentQuest.id, { requirements: newReqs })
                        }}
                      />
                    )}
                    {req.type === 'quest' && (
                      <input
                        type="text"
                        placeholder="任务ID"
                        value={req.params.questId || ''}
                        onChange={(e) => {
                          const newReqs = [...currentQuest.requirements]
                          newReqs[idx] = { ...req, params: { ...req.params, questId: e.target.value }}
                          updateQuest(currentQuest.id, { requirements: newReqs })
                        }}
                      />
                    )}
                    {req.type === 'item' && (
                      <>
                        <input
                          type="text"
                          placeholder="物品ID"
                          value={req.params.itemId || ''}
                          onChange={(e) => {
                            const newReqs = [...currentQuest.requirements]
                            newReqs[idx] = { ...req, params: { ...req.params, itemId: e.target.value }}
                            updateQuest(currentQuest.id, { requirements: newReqs })
                          }}
                        />
                        <input
                          type="number"
                          placeholder="数量"
                          value={req.params.amount || ''}
                          onChange={(e) => {
                            const newReqs = [...currentQuest.requirements]
                            newReqs[idx] = { ...req, params: { ...req.params, amount: parseInt(e.target.value) }}
                            updateQuest(currentQuest.id, { requirements: newReqs })
                          }}
                        />
                      </>
                    )}
                    <button onClick={() => {
                      const newReqs = currentQuest.requirements.filter((_, i) => i !== idx)
                      updateQuest(currentQuest.id, { requirements: newReqs })
                    }}>×</button>
                  </div>
                ))}
                <button className="add-btn" onClick={() => {
                  updateQuest(currentQuest.id, { 
                    requirements: [...currentQuest.requirements, { 
                      id: crypto.randomUUID(), type: 'level', params: {} 
                    }] 
                  })
                }}>+ 添加条件</button>
              </div>
            </div>

            <div className="property-section">
              <h4>任务目标</h4>
              <div className="objectives">
                {currentQuest.objectives.map((obj, idx) => (
                  <div key={obj.id} className="objective-item">
                    <select
                      value={obj.type}
                      onChange={(e) => {
                        const newObjs = [...currentQuest.objectives]
                        newObjs[idx] = { ...obj, type: e.target.value as any }
                        updateQuest(currentQuest.id, { objectives: newObjs })
                      }}
                    >
                      <option value="talk">对话</option>
                      <option value="kill">击杀</option>
                      <option value="collect">收集</option>
                      <option value="reach">到达</option>
                      <option value="use">使用</option>
                    </select>
                    <input
                      type="text"
                      placeholder="目标"
                      value={obj.target}
                      onChange={(e) => {
                        const newObjs = [...currentQuest.objectives]
                        newObjs[idx] = { ...obj, target: e.target.value }
                        updateQuest(currentQuest.id, { objectives: newObjs })
                      }}
                    />
                    <input
                      type="number"
                      placeholder="数量"
                      value={obj.amount}
                      onChange={(e) => {
                        const newObjs = [...currentQuest.objectives]
                        newObjs[idx] = { ...obj, amount: parseInt(e.target.value) }
                        updateQuest(currentQuest.id, { objectives: newObjs })
                      }}
                    />
                    <button onClick={() => {
                      const newObjs = currentQuest.objectives.filter((_, i) => i !== idx)
                      updateQuest(currentQuest.id, { objectives: newObjs })
                    }}>×</button>
                  </div>
                ))}
                <button className="add-btn" onClick={() => {
                  updateQuest(currentQuest.id, { 
                    objectives: [...currentQuest.objectives, { 
                      id: crypto.randomUUID(), description: '', type: 'talk', target: '', amount: 1, progress: 0
                    }] 
                  })
                }}>+ 添加目标</button>
              </div>
            </div>

            <div className="property-section">
              <h4>任务奖励</h4>
              <div className="rewards">
                {currentQuest.rewards.map((reward, idx) => (
                  <div key={idx} className="reward-item">
                    <select
                      value={reward.type}
                      onChange={(e) => {
                        const newRewards = [...currentQuest.rewards]
                        newRewards[idx] = { ...reward, type: e.target.value as any }
                        updateQuest(currentQuest.id, { rewards: newRewards })
                      }}
                    >
                      <option value="exp">经验</option>
                      <option value="gold">金币</option>
                      <option value="item">物品</option>
                      <option value="skill">技能</option>
                    </select>
                    <input
                      type="number"
                      placeholder="数量"
                      value={reward.amount}
                      onChange={(e) => {
                        const newRewards = [...currentQuest.rewards]
                        newRewards[idx] = { ...reward, amount: parseInt(e.target.value) }
                        updateQuest(currentQuest.id, { rewards: newRewards })
                      }}
                    />
                    {reward.type === 'item' && (
                      <input
                        type="text"
                        placeholder="物品ID"
                        value={reward.itemId || ''}
                        onChange={(e) => {
                          const newRewards = [...currentQuest.rewards]
                          newRewards[idx] = { ...reward, itemId: e.target.value }
                          updateQuest(currentQuest.id, { rewards: newRewards })
                        }}
                      />
                    )}
                    <button onClick={() => {
                      const newRewards = currentQuest.rewards.filter((_, i) => i !== idx)
                      updateQuest(currentQuest.id, { rewards: newRewards })
                    }}>×</button>
                  </div>
                ))}
                <button className="add-btn" onClick={() => {
                  updateQuest(currentQuest.id, { 
                    rewards: [...currentQuest.rewards, { type: 'exp', amount: 100 }] 
                  })
                }}>+ 添加奖励</button>
              </div>
            </div>
          </>
        ) : (
          <div className="no-selection">选择一个任务</div>
        )}
      </div>

      {/* 右侧：预览 */}
      <div className="quest-preview">
        <h4>任务预览</h4>
        {currentQuest ? (
          <div className="preview-content">
            <div className="preview-header">
              <span className={`type-badge ${currentQuest.type}`}>{currentQuest.type}</span>
              <h5>{currentQuest.name}</h5>
            </div>
            <p className="preview-desc">{currentQuest.description}</p>
            
            <div className="preview-section">
              <h6>目标</h6>
              {currentQuest.objectives.map(obj => (
                <div key={obj.id} className="preview-objective">
                  • {obj.description || `${obj.type}: ${obj.target} x${obj.amount}`}
                </div>
              ))}
            </div>
            
            <div className="preview-section">
              <h6>奖励</h6>
              {currentQuest.rewards.map((r, i) => (
                <div key={i} className="preview-reward">
                  {r.type === 'exp' && `经验 +${r.amount}`}
                  {r.type === 'gold' && `金币 +${r.amount}`}
                  {r.type === 'item' && `物品 ${r.itemId} x${r.amount}`}
                  {r.type === 'skill' && `技能 +${r.amount}`}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="empty">无预览</p>
        )}
      </div>
    </div>
  )
}
