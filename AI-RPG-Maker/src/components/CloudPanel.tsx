import { useState } from 'react'
import './CloudPanel.css'

// 订阅计划
interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  popular?: boolean
}

const PLANS: Plan[] = [
  { id: 'free', name: '免费版', price: 0, features: ['1个项目', '1MB素材', '基础功能', '社区支持'] },
  { id: 'creator', name: '创作者', price: 9.9, features: ['10个项目', '100MB素材', 'AI生成', '商业授权', '优先支持'], popular: true },
  { id: 'pro', name: '专业版', price: 29.9, features: ['无限项目', '1GB素材', '多人协作', 'API访问', '专属客服', '自定义域名'] },
  { id: 'enterprise', name: '企业版', price: 99.9, features: ['私有部署', 'SLA保障', '定制开发', '专属经理', '培训服务'] },
]

// 使用统计
interface UsageStats {
  projects: number
  storage: number
  aiCredits: number
  members: number
}

export default function CloudPanel() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'subscription' | 'storage' | 'team'>('dashboard')
  const [currentPlan, setCurrentPlan] = useState('creator')
  const [usage, setUsage] = useState<UsageStats>({ projects: 3, storage: 45, aiCredits: 850, members: 1 })

  return (
    <div className="cloud-panel">
      {/* 侧边栏 */}
      <aside className="cloud-sidebar">
        <div className="sidebar-header">
          <h3>☁️ 云服务</h3>
        </div>
        <nav>
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            📊 控制台
          </button>
          <button className={activeTab === 'subscription' ? 'active' : ''} onClick={() => setActiveTab('subscription')}>
            💎 订阅
          </button>
          <button className={activeTab === 'storage' ? 'active' : ''} onClick={() => setActiveTab('storage')}>
            💾 存储
          </button>
          <button className={activeTab === 'team' ? 'active' : ''} onClick={() => setActiveTab('team')}>
            👥 团队
          </button>
        </nav>

        {/* 当前计划 */}
        <div className="current-plan">
          <div className="plan-badge">{PLANS.find(p => p.id === currentPlan)?.name}</div>
          <p>剩余 {usage.aiCredits} AI点数</p>
        </div>
      </aside>

      {/* 主内容 */}
      <div className="cloud-content">
        {activeTab === 'dashboard' && (
          <>
            <div className="content-header">
              <h2>📊 控制台</h2>
              <button className="primary">+ 新建项目</button>
            </div>

            {/* 统计卡片 */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📁</div>
                <div className="stat-info">
                  <div className="stat-value">{usage.projects}</div>
                  <div className="stat-label">项目数</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💾</div>
                <div className="stat-info">
                  <div className="stat-value">{usage.storage}MB</div>
                  <div className="stat-label">存储空间</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🤖</div>
                <div className="stat-info">
                  <div className="stat-value">{usage.aiCredits}</div>
                  <div className="stat-label">AI点数</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <div className="stat-value">{usage.members}</div>
                  <div className="stat-label">团队成员</div>
                </div>
              </div>
            </div>

            {/* 最近项目 */}
            <div className="recent-projects">
              <h3>最近项目</h3>
              <div className="project-list">
                <div className="project-item">
                  <div className="project-icon">🏰</div>
                  <div className="project-info">
                    <div className="project-name">我的奇幻世界</div>
                    <div className="project-meta">修改于 2小时前</div>
                  </div>
                  <button>打开</button>
                </div>
                <div className="project-item">
                  <div className="project-icon">⚔️</div>
                  <div className="project-info">
                    <div className="project-name">战斗系统测试</div>
                    <div className="project-meta">修改于 昨天</div>
                  </div>
                  <button>打开</button>
                </div>
                <div className="project-item">
                  <div className="project-icon">🎮</div>
                  <div className="project-info">
                    <div className="project-name">Demo游戏</div>
                    <div className="project-meta">修改于 3天前</div>
                  </div>
                  <button>打开</button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'subscription' && (
          <>
            <div className="content-header">
              <h2>💎 订阅计划</h2>
            </div>

            <div className="plans-grid">
              {PLANS.map(plan => (
                <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''} ${currentPlan === plan.id ? 'current' : ''}`}>
                  {plan.popular && <div className="popular-badge">最受欢迎</div>}
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    <span className="currency">¥</span>
                    <span className="amount">{plan.price}</span>
                    <span className="period">/月</span>
                  </div>
                  <ul className="plan-features">
                    {plan.features.map((f, idx) => (
                      <li key={idx}>✓ {f}</li>
                    ))}
                  </ul>
                  {currentPlan === plan.id ? (
                    <button className="current-btn">当前计划</button>
                  ) : (
                    <button>{plan.price === 0 ? '免费使用' : '立即订阅'}</button>
                  )}
                </div>
              ))}
            </div>

            {/* AI点数包 */}
            <div className="ai-credits">
              <h3>额外AI点数</h3>
              <div className="credits-options">
                <div className="credit-card">
                  <div className="credit-amount">100点数</div>
                  <div className="credit-price">¥9.9</div>
                  <button>购买</button>
                </div>
                <div className="credit-card">
                  <div className="credit-amount">500点数</div>
                  <div className="credit-price">¥39.9</div>
                  <button>购买</button>
                </div>
                <div className="credit-card">
                  <div className="credit-amount">1000点数</div>
                  <div className="credit-price">¥69.9</div>
                  <button>购买</button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'storage' && (
          <>
            <div className="content-header">
              <h2>💾 存储空间</h2>
            </div>

            <div className="storage-overview">
              <div className="storage-circle">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#0f3460" strokeWidth="10" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e94560" strokeWidth="10" 
                    strokeDasharray={`${(usage.storage / 100) * 251} 251`} strokeLinecap="round" 
                    transform="rotate(-90 50 50)" />
                </svg>
                <div className="storage-text">
                  <div className="used">{usage.storage}MB</div>
                  <div className="total">/ 100MB</div>
                </div>
              </div>
              <div className="storage-details">
                <h4>使用明细</h4>
                <div className="storage-item">
                  <span>项目文件</span>
                  <span>25MB</span>
                </div>
                <div className="storage-item">
                  <span>素材</span>
                  <span>15MB</span>
                </div>
                <div className="storage-item">
                  <span>导出游戏</span>
                  <span>5MB</span>
                </div>
              </div>
            </div>

            <button className="upgrade-storage">扩容存储空间</button>
          </>
        )}

        {activeTab === 'team' && (
          <>
            <div className="content-header">
              <h2>👥 团队管理</h2>
              <button className="primary">+ 邀请成员</button>
            </div>

            <div className="team-members">
              <div className="member-item">
                <div className="member-avatar">👤</div>
                <div className="member-info">
                  <div className="member-name">你 (所有者)</div>
                  <div className="member-email">your@email.com</div>
                </div>
                <div className="member-role">所有者</div>
              </div>
            </div>

            <div className="team-invite">
              <h3>邀请链接</h3>
              <div className="invite-link">
                <input type="text" readOnly value="https://airpgmaker.com/invite/abc123" />
                <button>复制</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
