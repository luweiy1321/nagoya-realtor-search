import { useState } from 'react'
import './AIWorldGenerator.css'

// AI生成配置
interface AIConfig {
  worldType: string
  theme: string
  difficulty: string
  size: string
  npcCount: number
  questCount: number
}

// 生成结果
interface GeneratedWorld {
  name: string
  description: string
 地图: any[]
  npcs: any[]
  quests: any[]
  story: string
}

const WORLD_TYPES = [
  { id: 'fantasy', name: '奇幻世界', icon: '🏰' },
  { id: 'scifi', name: '科幻世界', icon: '🚀' },
  { id: 'modern', name: '现代都市', icon: '🏙️' },
  { id: 'postapocalypse', name: '末日废土', icon: '🧟' },
  { id: 'steampunk', name: '蒸汽朋克', icon: '⚙️' },
  { id: 'historical', name: '古代历史', icon: '🏛️' },
]

const THEMES = [
  '魔法与龙',
  '武侠江湖',
  '赛博朋克',
  '黑帮都市',
  '探险寻宝',
  '王国战争',
]

const DIFFICULTIES = [
  { id: 'easy', name: '简单' },
  { id: 'normal', name: '普通' },
  { id: 'hard', name: '困难' },
  { id: 'nightmare', name: '噩梦' },
]

export default function AIWorldGenerator() {
  const [config, setConfig] = useState<AIConfig>({
    worldType: 'fantasy',
    theme: '魔法与龙',
    difficulty: 'normal',
    size: 'medium',
    npcCount: 5,
    questCount: 3,
  })
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<GeneratedWorld | null>(null)
  const [activeTab, setActiveTab] = useState<'world' | 'npc' | 'quest' | 'story'>('world')

  // 模拟AI生成
  const generateWorld = async () => {
    setGenerating(true)
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const worldData: GeneratedWorld = {
      name: `${config.theme}世界`,
      description: `一个充满${config.theme}的${WORLD_TYPES.find(w => w.id === config.worldType)?.name}，适合${config.difficulty}难度冒险。`,
      地图: generateMap(),
      npcs: generateNPCs(),
      quests: generateQuests(),
      story: generateStory(),
    }
    
    setResult(worldData)
    setGenerating(false)
  }

  const generateMap = () => {
    const tiles = []
    const size = config.size === 'small' ? 16 : config.size === 'medium' ? 24 : 32
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // 随机生成地形
        const rand = Math.random()
        let tileId = 1 // 草地
        if (rand > 0.7) tileId = 2 // 土地
        if (rand > 0.85) tileId = 3 // 水
        if (rand > 0.92) tileId = 4 // 石头
        if (rand > 0.95) tileId = 5 // 木头
        
        tiles.push({ x, y, tileId })
      }
    }
    return tiles
  }

  const generateNPCs = () => {
    const npcTemplates = [
      { name: '村长', role: '领袖', personality: '智慧' },
      { name: '铁匠', role: '工匠', personality: '勤劳' },
      { name: '商人', role: '商贩', personality: '精明' },
      { name: '法师', role: '术士', personality: '神秘' },
      { name: '骑士', role: '战士', personality: '勇敢' },
      { name: '药师', role: '治疗', personality: '善良' },
      { name: '盗贼', role: '潜行', personality: '机敏' },
      { name: '吟游诗人', role: '艺人', personality: '开朗' },
    ]
    
    return npcTemplates.slice(0, config.npcCount).map((template, idx) => ({
      id: crypto.randomUUID(),
      name: template.name,
      role: template.role,
      personality: template.personality,
      x: Math.floor(Math.random() * 10) + 5,
      y: Math.floor(Math.random() * 10) + 5,
      dialogue: [
        { id: '1', text: `你好，旅行者。我是${template.name}。`, choices: [] }
      ]
    }))
  }

  const generateQuests = () => {
    const questTemplates = [
      { name: '消灭怪物', type: 'main', objective: '击杀', target: '哥布林', amount: 5 },
      { name: '寻找草药', type: 'side', objective: '收集', target: '草药', amount: 3 },
      { name: '保护村民', type: 'main', objective: '防守', target: '村庄', amount: 1 },
      { name: '送信任务', type: 'side', objective: '对话', target: '铁匠', amount: 1 },
      { name: '探索遗迹', type: 'main', objective: '到达', target: '遗迹', amount: 1 },
    ]
    
    return questTemplates.slice(0, config.questCount).map(template => ({
      id: crypto.randomUUID(),
      name: template.name,
      type: template.type as 'main' | 'side',
      description: `${template.objective}${template.amount}个${template.target}`,
      requirements: [],
      objectives: [{
        id: crypto.randomUUID(),
        type: template.objective.toLowerCase() as any,
        target: template.target,
        amount: template.amount,
        progress: 0,
      }],
      rewards: [
        { type: 'exp', amount: Math.floor(Math.random() * 100) + 50 },
        { type: 'gold', amount: Math.floor(Math.random() * 50) + 20 },
      ],
    }))
  }

  const generateStory = () => {
    const stories = {
      fantasy: '在遥远的古代，龙族统治着这片土地...',
      scifi: '公元2500年，人类已经殖民了多个星球...',
      modern: '这座城市表面上平静，暗流涌动...',
      postapocalypse: '核战争结束后，幸存者们艰难求生...',
      steampunk: '蒸汽机驱动着巨大的机械城市...',
      historical: '群雄并起，天下三分...',
    }
    
    return stories[config.worldType as keyof typeof stories] || stories.fantasy
  }

  return (
    <div className="ai-generator">
      {/* 左侧：配置 */}
      <aside className="config-panel">
        <h3>🤖 AI 世界生成器</h3>
        
        <div className="config-section">
          <label>世界类型</label>
          <div className="world-types">
            {WORLD_TYPES.map(type => (
              <button
                key={type.id}
                className={config.worldType === type.id ? 'active' : ''}
                onClick={() => setConfig({ ...config, worldType: type.id })}
              >
                <span className="icon">{type.icon}</span>
                <span className="name">{type.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="config-section">
          <label>主题</label>
          <select
            value={config.theme}
            onChange={(e) => setConfig({ ...config, theme: e.target.value })}
          >
            {THEMES.map(theme => (
              <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>
        </div>

        <div className="config-section">
          <label>难度</label>
          <div className="difficulty-buttons">
            {DIFFICULTIES.map(diff => (
              <button
                key={diff.id}
                className={config.difficulty === diff.id ? 'active' : ''}
                onClick={() => setConfig({ ...config, difficulty: diff.id })}
              >
                {diff.name}
              </button>
            ))}
          </div>
        </div>

        <div className="config-section">
          <label>地图大小</label>
          <select
            value={config.size}
            onChange={(e) => setConfig({ ...config, size: e.target.value })}
          >
            <option value="small">小 (16x16)</option>
            <option value="medium">中 (24x24)</option>
            <option value="large">大 (32x32)</option>
          </select>
        </div>

        <div className="config-section">
          <label>NPC数量: {config.npcCount}</label>
          <input
            type="range"
            min="3"
            max="10"
            value={config.npcCount}
            onChange={(e) => setConfig({ ...config, npcCount: parseInt(e.target.value) })}
          />
        </div>

        <div className="config-section">
          <label>任务数量: {config.questCount}</label>
          <input
            type="range"
            min="1"
            max="5"
            value={config.questCount}
            onChange={(e) => setConfig({ ...config, questCount: parseInt(e.target.value) })}
          />
        </div>

        <button 
          className="generate-btn" 
          onClick={generateWorld}
          disabled={generating}
        >
          {generating ? '🤔 生成中...' : '✨ AI 生成世界'}
        </button>
      </aside>

      {/* 右侧：结果 */}
      <div className="result-panel">
        {result ? (
          <>
            <div className="result-header">
              <h3>{result.name}</h3>
              <p>{result.description}</p>
            </div>

            <div className="result-tabs">
              <button
                className={activeTab === 'world' ? 'active' : ''}
                onClick={() => setActiveTab('world')}
              >
                🗺️ 地图
              </button>
              <button
                className={activeTab === 'npc' ? 'active' : ''}
                onClick={() => setActiveTab('npc')}
              >
                👥 NPC ({result.npcs.length})
              </button>
              <button
                className={activeTab === 'quest' ? 'active' : ''}
                onClick={() => setActiveTab('quest')}
              >
                📜 任务 ({result.quests.length})
              </button>
              <button
                className={activeTab === 'story' ? 'active' : ''}
                onClick={() => setActiveTab('story')}
              >
                📖 剧情
              </button>
            </div>

            <div className="result-content">
              {activeTab === 'world' && (
                <div className="map-preview">
                  <div className="mini-map">
                    {result.地图.slice(0, 100).map((tile, idx) => (
                      <div
                        key={idx}
                        className={`tile tile-${tile.tileId}`}
                        style={{
                          left: `${(tile.x % 10) * 20}px`,
                          top: `${Math.floor(tile.x / 10) * 20 + tile.y * 2}px`,
                        }}
                      />
                    ))}
                  </div>
                  <p>地图大小: {config.size} ({config.size === 'small' ? '16x16' : config.size === 'medium' ? '24x24' : '32x32'})</p>
                </div>
              )}

              {activeTab === 'npc' && (
                <div className="npc-list">
                  {result.npcs.map(npc => (
                    <div key={npc.id} className="npc-card">
                      <div className="npc-avatar">👤</div>
                      <div className="npc-info">
                        <div className="npc-name">{npc.name}</div>
                        <div className="npc-role">{npc.role} - {npc.personality}</div>
                        <div className="npc-pos">位置: {npc.x}, {npc.y}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'quest' && (
                <div className="quest-list">
                  {result.quests.map(quest => (
                    <div key={quest.id} className={`quest-card ${quest.type}`}>
                      <div className="quest-header">
                        <span className="quest-type">{quest.type === 'main' ? '主线' : '支线'}</span>
                        <span className="quest-name">{quest.name}</span>
                      </div>
                      <p className="quest-desc">{quest.description}</p>
                      <div className="quest-rewards">
                        {quest.rewards.map((r: any, idx: number) => (
                          <span key={idx}>
                            {r.type === 'exp' && `经验 +${r.amount}`}
                            {r.type === 'gold' && `金币 +${r.amount}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'story' && (
                <div className="story-content">
                  <p>{result.story}</p>
                  <div className="story-hint">
                    <p>💡 AI会根据这个世界设定自动生成更多剧情内容...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="result-actions">
              <button className="save-btn">💾 保存到项目</button>
              <button className="export-btn">📤 导出JSON</button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🤖</div>
            <h4>AI 世界生成器</h4>
            <p>选择配置，点击生成，让AI为你创建完整的游戏世界</p>
            <ul className="features">
              <li>🎲 智能地图生成</li>
              <li>👥 自动NPC创建</li>
              <li>📜 任务系统设计</li>
              <li>📖 世界剧情设定</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
