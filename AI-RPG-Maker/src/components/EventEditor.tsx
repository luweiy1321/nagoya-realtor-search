import { useState } from 'react'
import './EventEditor.css'

// 事件类型
interface Event {
  id: string
  name: string
  trigger: EventTrigger
  actions: EventAction[]
  conditions: string[]
}

// 触发条件
interface EventTrigger {
  type: 'collision' | 'talk' | 'auto' | 'item' | 'time' | 'quest'
  params: Record<string, any>
}

// 动作
interface EventAction {
  id: string
  type: 'show_message' | 'change_map' | 'give_item' | 'remove_item' | 
       'change_variable' | 'play_sound' | 'play_animation' | 'teleport' | 
       'start_battle' | 'conditional_branch' | 'wait'
  params: Record<string, any>
}

// 预设事件模板
const EVENT_TEMPLATES = [
  {
    id: 'treasure',
    name: '宝箱',
    trigger: { type: 'collision', params: { x: 0, y: 0 } },
    actions: [
      { id: '1', type: 'show_message', params: { text: '你找到了一个宝箱！' } },
      { id: '2', type: 'give_item', params: { itemId: 'gold', amount: 100 } },
    ],
    conditions: [],
  },
  {
    id: 'warp',
    name: '传送门',
    trigger: { type: 'collision', params: { x: 0, y: 0 } },
    actions: [
      { id: '1', type: 'change_map', params: { mapId: 'dungeon_1', x: 5, y: 5 } },
    ],
    conditions: [],
  },
  {
    id: 'shop',
    name: '商店',
    trigger: { type: 'talk', params: { npcId: '' } },
    actions: [
      { id: '1', type: 'show_message', params: { text: '欢迎光临！' } },
    ],
    conditions: [],
  },
]

// 动作类型配置
const ACTION_TYPES = [
  { id: 'show_message', name: '显示消息', icon: '💬' },
  { id: 'change_map', name: '切换地图', icon: '🗺️' },
  { id: 'give_item', name: '给予物品', icon: '🎁' },
  { id: 'remove_item', name: '移除物品', icon: '🗑️' },
  { id: 'change_variable', name: '变量操作', icon: '🔢' },
  { id: 'play_sound', name: '播放音效', icon: '🔊' },
  { id: 'play_animation', name: '播放动画', icon: '✨' },
  { id: 'teleport', name: '传送', icon: '🌀' },
  { id: 'start_battle', name: '开始战斗', icon: '⚔️' },
  { id: 'conditional_branch', name: '条件分支', icon: '🔀' },
  { id: 'wait', name: '等待', icon: '⏱️' },
]

export default function EventEditor() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      name: '村长对话',
      trigger: { type: 'talk', params: { npcId: '1' } },
      actions: [
        { id: 'a1', type: 'show_message', params: { text: '你好，旅行者！' } },
      ],
      conditions: [],
    },
  ])
  const [selectedEvent, setSelectedEvent] = useState<string | null>('1')
  const [editingAction, setEditingAction] = useState<string | null>(null)

  const currentEvent = events.find(e => e.id === selectedEvent)

  const addEvent = (template?: typeof EVENT_TEMPLATES[0]) => {
    const newEvent: Event = template 
      ? { ...template, id: crypto.randomUUID() }
      : {
          id: crypto.randomUUID(),
          name: '新事件',
          trigger: { type: 'collision', params: { x: 0, y: 0 } },
          actions: [],
          conditions: [],
        }
    setEvents([...events, newEvent])
    setSelectedEvent(newEvent.id)
  }

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(events.map(e => e.id === id ? { ...e, ...updates } : e))
  }

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id))
    if (selectedEvent === id) setSelectedEvent(null)
  }

  const addAction = () => {
    if (!currentEvent) return
    const newAction: EventAction = {
      id: crypto.randomUUID(),
      type: 'show_message',
      params: { text: '新动作' },
    }
    updateEvent(currentEvent.id, { actions: [...currentEvent.actions, newAction] })
  }

  const updateAction = (actionId: string, updates: Partial<EventAction>) => {
    if (!currentEvent) return
    const updated = currentEvent.actions.map(a => 
      a.id === actionId ? { ...a, ...updates } : a
    )
    updateEvent(currentEvent.id, { actions: updated })
  }

  const deleteAction = (actionId: string) => {
    if (!currentEvent) return
    const updated = currentEvent.actions.filter(a => a.id !== actionId)
    updateEvent(currentEvent.id, { actions: updated })
  }

  const moveAction = (actionId: string, direction: 'up' | 'down') => {
    if (!currentEvent) return
    const idx = currentEvent.actions.findIndex(a => a.id === actionId)
    if (idx < 0) return
    
    const newIdx = direction === 'up' ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= currentEvent.actions.length) return
    
    const newActions = [...currentEvent.actions]
    ;[newActions[idx], newActions[newIdx]] = [newActions[newIdx], newActions[idx]]
    updateEvent(currentEvent.id, { actions: newActions })
  }

  return (
    <div className="event-editor">
      {/* 左侧：事件列表 */}
      <aside className="event-list">
        <div className="event-list-header">
          <h3>事件列表</h3>
          <button onClick={() => addEvent()}>+ 新建</button>
        </div>
        
        <div className="templates">
          <h4>模板</h4>
          <div className="template-buttons">
            {EVENT_TEMPLATES.map(t => (
              <button key={t.id} onClick={() => addEvent(t)}>
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="event-items">
          {events.map(event => (
            <div
              key={event.id}
              className={`event-item ${selectedEvent === event.id ? 'selected' : ''}`}
              onClick={() => setSelectedEvent(event.id)}
            >
              <div className="event-icon">
                {event.trigger.type === 'collision' && '🚶'}
                {event.trigger.type === 'talk' && '💬'}
                {event.trigger.type === 'auto' && '⚡'}
                {event.trigger.type === 'item' && '🎁'}
                {event.trigger.type === 'time' && '⏰'}
                {event.trigger.type === 'quest' && '📜'}
              </div>
              <div className="event-info">
                <div className="event-name">{event.name}</div>
                <div className="event-trigger">
                  触发: {event.trigger.type}
                </div>
              </div>
              <button className="delete-btn" onClick={(e) => { 
                e.stopPropagation(); deleteEvent(event.id) 
              }}>×</button>
            </div>
          ))}
        </div>
      </aside>

      {/* 中间：事件属性 */}
      <div className="event-properties">
        {currentEvent ? (
          <>
            <div className="property-section">
              <h4>基本信息</h4>
              <label>
                事件名称
                <input
                  type="text"
                  value={currentEvent.name}
                  onChange={(e) => updateEvent(currentEvent.id, { name: e.target.value })}
                />
              </label>
            </div>

            <div className="property-section">
              <h4>触发条件</h4>
              <div className="trigger-config">
                <select
                  value={currentEvent.trigger.type}
                  onChange={(e) => updateEvent(currentEvent.id, { 
                    trigger: { ...currentEvent.trigger, type: e.target.value as any }
                  })}
                >
                  <option value="collision">碰撞触发</option>
                  <option value="talk">对话触发</option>
                  <option value="auto">自动触发</option>
                  <option value="item">物品触发</option>
                  <option value="time">时间触发</option>
                  <option value="quest">任务触发</option>
                </select>
                
                {currentEvent.trigger.type === 'collision' && (
                  <div className="trigger-params">
                    <label>
                      X坐标
                      <input
                        type="number"
                        value={currentEvent.trigger.params.x || 0}
                        onChange={(e) => updateEvent(currentEvent.id, {
                          trigger: { ...currentEvent.trigger, params: { 
                            ...currentEvent.trigger.params, x: parseInt(e.target.value) 
                          }}
                        })}
                      />
                    </label>
                    <label>
                      Y坐标
                      <input
                        type="number"
                        value={currentEvent.trigger.params.y || 0}
                        onChange={(e) => updateEvent(currentEvent.id, {
                          trigger: { ...currentEvent.trigger, params: { 
                            ...currentEvent.trigger.params, y: parseInt(e.target.value) 
                          }}
                        })}
                      />
                    </label>
                  </div>
                )}
                
                {currentEvent.trigger.type === 'talk' && (
                  <label>
                    NPC ID
                    <input
                      type="text"
                      value={currentEvent.trigger.params.npcId || ''}
                      onChange={(e) => updateEvent(currentEvent.id, {
                        trigger: { ...currentEvent.trigger, params: { 
                          ...currentEvent.trigger.params, npcId: e.target.value 
                        }}
                      })}
                    />
                  </label>
                )}
                
                {currentEvent.trigger.type === 'item' && (
                  <label>
                    物品ID
                    <input
                      type="text"
                      value={currentEvent.trigger.params.itemId || ''}
                      onChange={(e) => updateEvent(currentEvent.id, {
                        trigger: { ...currentEvent.trigger, params: { 
                          ...currentEvent.trigger.params, itemId: e.target.value 
                        }}
                      })}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="property-section">
              <h4>前置条件 (可选)</h4>
              <div className="conditions">
                {currentEvent.conditions.map((cond, idx) => (
                  <div key={idx} className="condition-item">
                    <input
                      type="text"
                      value={cond}
                      onChange={(e) => {
                        const newCond = [...currentEvent.conditions]
                        newCond[idx] = e.target.value
                        updateEvent(currentEvent.id, { conditions: newCond })
                      }}
                      placeholder="例如: quest_completed:1"
                    />
                    <button onClick={() => {
                      const newCond = currentEvent.conditions.filter((_, i) => i !== idx)
                      updateEvent(currentEvent.id, { conditions: newCond })
                    }}>×</button>
                  </div>
                ))}
                <button className="add-condition" onClick={() => {
                  updateEvent(currentEvent.id, { 
                    conditions: [...currentEvent.conditions, ''] 
                  })
                }}>+ 添加条件</button>
              </div>
            </div>

            <div className="property-section">
              <h4>执行动作</h4>
              <div className="action-list">
                {currentEvent.actions.map((action, idx) => (
                  <div key={action.id} className="action-item">
                    <div className="action-header">
                      <span className="action-number">{idx + 1}</span>
                      <select
                        value={action.type}
                        onChange={(e) => updateAction(action.id, { 
                          type: e.target.value as any 
                        })}
                      >
                        {ACTION_TYPES.map(t => (
                          <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                        ))}
                      </select>
                      <div className="action-controls">
                        <button onClick={() => moveAction(action.id, 'up')} disabled={idx === 0}>↑</button>
                        <button onClick={() => moveAction(action.id, 'down')} disabled={idx === currentEvent.actions.length - 1}>↓</button>
                        <button onClick={() => deleteAction(action.id)}>×</button>
                      </div>
                    </div>
                    
                    <div className="action-params">
                      {action.type === 'show_message' && (
                        <textarea
                          value={action.params.text || ''}
                          onChange={(e) => updateAction(action.id, { 
                            params: { ...action.params, text: e.target.value }
                          })}
                          placeholder="消息内容"
                          rows={3}
                        />
                      )}
                      
                      {action.type === 'change_map' && (
                        <>
                          <input
                            type="text"
                            value={action.params.mapId || ''}
                            onChange={(e) => updateAction(action.id, { 
                              params: { ...action.params, mapId: e.target.value }
                            })}
                            placeholder="地图ID"
                          />
                          <input
                            type="number"
                            value={action.params.x || 0}
                            onChange={(e) => updateAction(action.id, { 
                              params: { ...action.params, x: parseInt(e.target.value) }
                            })}
                            placeholder="X坐标"
                          />
                          <input
                            type="number"
                            value={action.params.y || 0}
                            onChange={(e) => updateAction(action.id, { 
                              params: { ...action.params, y: parseInt(e.target.value) }
                            })}
                            placeholder="Y坐标"
                          />
                        </>
                      )}
                      
                      {action.type === 'give_item' && (
                        <>
                          <input
                            type="text"
                            value={action.params.itemId || ''}
                            onChange={(e) => updateAction(action.id, { 
                              params: { ...action.params, itemId: e.target.value }
                            })}
                            placeholder="物品ID"
                          />
                          <input
                            type="number"
                            value={action.params.amount || 1}
                            onChange={(e) => updateAction(action.id, { 
                              params: { ...action.params, amount: parseInt(e.target.value) }
                            })}
                            placeholder="数量"
                          />
                        </>
                      )}
                      
                      {action.type === 'wait' && (
                        <input
                          type="number"
                          value={action.params.duration || 1}
                          onChange={(e) => updateAction(action.id, { 
                            params: { ...action.params, duration: parseFloat(e.target.value) }
                          })}
                          placeholder="等待秒数"
                        />
                      )}
                      
                      {action.type === 'change_variable' && (
                        <>
                          <input
                            type="text"
                            value={action.params.variable || ''}
                            onChange={(e) => updateAction(action.id, { 
                              params: { ...action.params, variable: e.target.value }
                            })}
                            placeholder="变量名"
                          />
                          <select
                            value={action.params.operator || '='}
                            onChange={(e) => updateAction(action.id, { 
                              params: { ...action.params, operator: e.target.value }
                            })}
                          >
                            <option value="=">设为</option>
                            <option value="+">加</option>
                            <option value="-">减</option>
                            <option value="*">乘</option>
                            <option value="/">除</option>
                          </select>
                          <input
                            type="text"
                            value={action.params.value || ''}
                            onChange={(e) => updateAction(action.id, { 
                              params: { ...action.params, value: e.target.value }
                            })}
                            placeholder="值"
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}
                <button className="add-action" onClick={addAction}>
                  + 添加动作
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="no-selection">选择一个事件</div>
        )}
      </div>

      {/* 右侧：预览 */}
      <div className="event-preview">
        <h4>事件预览</h4>
        {currentEvent ? (
          <div className="preview-content">
            <div className="preview-item">
              <span className="label">名称:</span>
              <span>{currentEvent.name}</span>
            </div>
            <div className="preview-item">
              <span className="label">触发:</span>
              <span>{currentEvent.trigger.type}</span>
            </div>
            <div className="preview-item">
              <span className="label">动作数:</span>
              <span>{currentEvent.actions.length}</span>
            </div>
            <div className="preview-flow">
              <h5>流程</h5>
              {currentEvent.actions.map((action, idx) => (
                <div key={action.id} className="flow-step">
                  <span className="step-num">{idx + 1}</span>
                  <span className="step-action">
                    {ACTION_TYPES.find(t => t.id === action.type)?.name}
                  </span>
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
