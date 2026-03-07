import { useState } from 'react'
import './NPCEditor.css'

// NPC类型
interface NPC {
  id: string
  name: string
  sprite: string
  x: number
  y: number
  dialogue: DialogueNode[]
  behavior: Behavior[]
}

// 对话节点
interface DialogueNode {
  id: string
  text: string
  choices: DialogueChoice[]
  condition?: string
}

// 对话选项
interface DialogueChoice {
  id: string
  text: string
  nextNodeId: string | null
  action?: string
}

// 行为类型
interface Behavior {
  id: string
  type: 'move' | 'patrol' | 'wait'
  params: Record<string, any>
}

// 预设sprite
const SPRITE_PALETTE = [
  { id: 'villager_m', name: '村民男', color: '#4a90a4' },
  { id: 'villager_f', name: '村民女', color: '#d4a574' },
  { id: 'merchant', name: '商人', color: '#8b7355' },
  { id: 'guard', name: '守卫', color: '#e94560' },
  { id: 'mage', name: '法师', color: '#9b59b6' },
  { id: 'warrior', name: '战士', color: '#e67e22' },
  { id: 'child', name: '小孩', color: '#3498db' },
  { id: 'elder', name: '老人', color: '#95a5a6' },
]

export default function NPCEditor() {
  const [npcs, setNPCs] = useState<NPC[]>([
    {
      id: '1',
      name: '村长',
      sprite: 'villager_m',
      x: 5,
      y: 5,
      dialogue: [
        {
          id: 'start',
          text: '你好，旅行者。欢迎来到我们的村庄！',
          choices: [
            { id: 'c1', text: '这是哪里？', nextNodeId: 'where' },
            { id: 'c2', text: '有什么任务吗？', nextNodeId: 'quest' },
            { id: 'c3', text: '再见', nextNodeId: null },
          ],
        },
        {
          id: 'where',
          text: '这里是枫叶村，一个安静的小村庄。',
          choices: [
            { id: 'c4', text: '谢谢', nextNodeId: null },
          ],
        },
        {
          id: 'quest',
          text: '村外的森林里有怪物，你能帮我们消灭它们吗？',
          choices: [
            { id: 'c5', text: '没问题！', nextNodeId: null, action: 'accept_quest:1' },
            { id: 'c6', text: '让我想想', nextNodeId: null },
          ],
        },
      ],
      behavior: [
        { id: 'b1', type: 'patrol', params: { points: [{x:5,y:5}, {x:8,y:5}, {x:8,y:8}], speed: 1 } }
      ],
    },
  ])
  
  const [selectedNPC, setSelectedNPC] = useState<string | null>('1')
  const [editingDialogue, setEditingDialogue] = useState<DialogueNode | null>(null)

  const currentNPC = npcs.find(n => n.id === selectedNPC)

  const addNPC = () => {
    const newNPC: NPC = {
      id: crypto.randomUUID(),
      name: '新NPC',
      sprite: 'villager_m',
      x: 0,
      y: 0,
      dialogue: [
        {
          id: 'start',
          text: '你好！',
          choices: [],
        },
      ],
      behavior: [],
    }
    setNPCs([...npcs, newNPC])
    setSelectedNPC(newNPC.id)
  }

  const updateNPC = (id: string, updates: Partial<NPC>) => {
    setNPCs(npcs.map(n => n.id === id ? { ...n, ...updates } : n))
  }

  const deleteNPC = (id: string) => {
    setNPCs(npcs.filter(n => n.id !== id))
    if (selectedNPC === id) setSelectedNPC(null)
  }

  const addDialogueNode = () => {
    if (!currentNPC) return
    const newNode: DialogueNode = {
      id: crypto.randomUUID(),
      text: '新对话',
      choices: [],
    }
    const updated = {
      ...currentNPC,
      dialogue: [...currentNPC.dialogue, newNode],
    }
    updateNPC(currentNPC.id, updated)
  }

  const updateDialogueNode = (nodeId: string, updates: Partial<DialogueNode>) => {
    if (!currentNPC) return
    const updated = {
      ...currentNPC,
      dialogue: currentNPC.dialogue.map(d => 
        d.id === nodeId ? { ...d, ...updates } : d
      ),
    }
    updateNPC(currentNPC.id, updated)
  }

  const deleteDialogueNode = (nodeId: string) => {
    if (!currentNPC) return
    const updated = {
      ...currentNPC,
      dialogue: currentNPC.dialogue.filter(d => d.id !== nodeId),
    }
    updateNPC(currentNPC.id, updated)
  }

  return (
    <div className="npc-editor">
      {/* 左侧：NPC列表 */}
      <aside className="npc-list">
        <div className="npc-list-header">
          <h3>NPC列表</h3>
          <button onClick={addNPC}>+ 添加</button>
        </div>
        <div className="npc-items">
          {npcs.map(npc => (
            <div
              key={npc.id}
              className={`npc-item ${selectedNPC === npc.id ? 'selected' : ''}`}
              onClick={() => setSelectedNPC(npc.id)}
            >
              <div className="npc-icon" style={{ background: SPRITE_PALETTE.find(s => s.id === npc.sprite)?.color }}>
                {npc.name[0]}
              </div>
              <div className="npc-info">
                <div className="npc-name">{npc.name}</div>
                <div className="npc-pos">位置: {npc.x}, {npc.y}</div>
              </div>
              <button className="delete-btn" onClick={(e) => { e.stopPropagation(); deleteNPC(npc.id) }}>×</button>
            </div>
          ))}
        </div>
      </aside>

      {/* 中间：NPC属性 */}
      <div className="npc-properties">
        {currentNPC ? (
          <>
            <div className="property-section">
              <h4>基本属性</h4>
              <label>
                名称
                <input
                  type="text"
                  value={currentNPC.name}
                  onChange={(e) => updateNPC(currentNPC.id, { name: e.target.value })}
                />
              </label>
              <label>
                位置 X
                <input
                  type="number"
                  value={currentNPC.x}
                  onChange={(e) => updateNPC(currentNPC.id, { x: parseInt(e.target.value) })}
                />
              </label>
              <label>
                位置 Y
                <input
                  type="number"
                  value={currentNPC.y}
                  onChange={(e) => updateNPC(currentNPC.id, { y: parseInt(e.target.value) })}
                />
              </label>
              <label>
                外观
                <select
                  value={currentNPC.sprite}
                  onChange={(e) => updateNPC(currentNPC.id, { sprite: e.target.value })}
                >
                  {SPRITE_PALETTE.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="property-section">
              <h4>对话树</h4>
              <div className="dialogue-tree">
                {currentNPC.dialogue.map(node => (
                  <div
                    key={node.id}
                    className={`dialogue-node ${editingDialogue?.id === node.id ? 'editing' : ''}`}
                    onClick={() => setEditingDialogue(node)}
                  >
                    <div className="node-text">{node.text}</div>
                    <div className="node-choices">{node.choices.length} 个选项</div>
                    <button
                      className="delete-node"
                      onClick={(e) => { e.stopPropagation(); deleteDialogueNode(node.id) }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button className="add-node" onClick={addDialogueNode}>+ 添加对话</button>
              </div>
            </div>

            <div className="property-section">
              <h4>行为模式</h4>
              <div className="behavior-list">
                {currentNPC.behavior.map(b => (
                  <div key={b.id} className="behavior-item">
                    {b.type === 'patrol' && `巡逻: ${b.params.points?.length} 个点`}
                    {b.type === 'move' && `移动到: ${b.params.x}, ${b.params.y}`}
                    {b.type === 'wait' && `等待: ${b.params.duration}秒`}
                  </div>
                ))}
                {currentNPC.behavior.length === 0 && <p className="empty">暂无行为</p>}
              </div>
            </div>
          </>
        ) : (
          <div className="no-selection">选择一个NPC</div>
        )}
      </div>

      {/* 右侧：对话编辑 */}
      <div className="dialogue-editor">
        {editingDialogue ? (
          <>
            <h4>编辑对话节点</h4>
            <label>
              对话内容
              <textarea
                value={editingDialogue.text}
                onChange={(e) => updateDialogueNode(editingDialogue.id, { text: e.target.value })}
                rows={4}
              />
            </label>
            
            <div className="choices-section">
              <h5>选项</h5>
              {editingDialogue.choices.map((choice, idx) => (
                <div key={choice.id} className="choice-item">
                  <input
                    type="text"
                    value={choice.text}
                    onChange={(e) => {
                      const newChoices = [...editingDialogue.choices]
                      newChoices[idx] = { ...choice, text: e.target.value }
                      updateDialogueNode(editingDialogue.id, { choices: newChoices })
                    }}
                    placeholder="选项文字"
                  />
                  <select
                    value={choice.nextNodeId || ''}
                    onChange={(e) => {
                      const newChoices = [...editingDialogue.choices]
                      newChoices[idx] = { ...choice, nextNodeId: e.target.value || null }
                      updateDialogueNode(editingDialogue.id, { choices: newChoices })
                    }}
                  >
                    <option value="">结束对话</option>
                    {currentNPC?.dialogue.filter(d => d.id !== editingDialogue.id).map(d => (
                      <option key={d.id} value={d.id}>{d.text.substring(0, 20)}...</option>
                    ))}
                  </select>
                  <button onClick={() => {
                    const newChoices = editingDialogue.choices.filter((_, i) => i !== idx)
                    updateDialogueNode(editingDialogue.id, { choices: newChoices })
                  }}>×</button>
                </div>
              ))}
              <button
                className="add-choice"
                onClick={() => {
                  const newChoices = [...editingDialogue.choices, {
                    id: crypto.randomUUID(),
                    text: '新选项',
                    nextNodeId: null,
                  }]
                  updateDialogueNode(editingDialogue.id, { choices: newChoices })
                }}
              >
                + 添加选项
              </button>
            </div>

            <div className="condition-section">
              <h5>触发条件 (可选)</h5>
              <input
                type="text"
                value={editingDialogue.condition || ''}
                onChange={(e) => updateDialogueNode(editingDialogue.id, { 
                  condition: e.target.value || undefined 
                })}
                placeholder="例如: quest_completed:1"
              />
            </div>
          </>
        ) : (
          <div className="no-selection">选择一个对话节点编辑</div>
        )}
      </div>
    </div>
  )
}
