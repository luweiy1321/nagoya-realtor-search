import { useState } from 'react'
import './MultiplayerSystem.css'

// 房间
interface Room {
  id: string
  name: string
  map: string
  players: number
  maxPlayers: number
  status: 'waiting' | 'playing'
}

// 玩家
interface Player {
  id: string
  name: string
  status: 'online' | 'ingame' | 'away'
}

export default function MultiplayerSystem() {
  const [activeTab, setActiveTab] = useState<'rooms' | 'friends' | 'settings'>('rooms')
  const [rooms, setRooms] = useState<Room[]>([
    { id: '1', name: '新手村', map: 'village_1', players: 2, maxPlayers: 4, status: 'waiting' },
    { id: '2', name: 'Boss副本', map: 'dungeon_1', players: 3, maxPlayers: 6, status: 'playing' },
    { id: '3', name: 'PvP竞技场', map: 'arena_1', players: 1, maxPlayers: 2, status: 'waiting' },
  ])
  const [friends, setFriends] = useState<Player[]>([
    { id: '1', name: '玩家A', status: 'online' },
    { id: '2', name: '玩家B', status: 'ingame' },
    { id: '3', name: '玩家C', status: 'away' },
  ])
  const [showCreateRoom, setShowCreateRoom] = useState(false)

  return (
    <div className="multiplayer-system">
      {/* 左侧导航 */}
      <aside className="mp-nav">
        <div className="nav-header">
          <h3>🎮 多人系统</h3>
        </div>
        <nav>
          <button 
            className={activeTab === 'rooms' ? 'active' : ''}
            onClick={() => setActiveTab('rooms')}
          >
            🏠 大厅
          </button>
          <button 
            className={activeTab === 'friends' ? 'active' : ''}
            onClick={() => setActiveTab('friends')}
          >
            👥 好友
          </button>
          <button 
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ 设置
          </button>
        </nav>

        {/* 玩家信息 */}
        <div className="player-info">
          <div className="player-avatar">🎮</div>
          <div className="player-name">你的名字</div>
          <div className="player-status">
            <span className="status-dot online"></span>在线
          </div>
        </div>
      </aside>

      {/* 主内容 */}
      <div className="mp-content">
        {activeTab === 'rooms' && (
          <>
            <div className="content-header">
              <h3>游戏大厅</h3>
              <button onClick={() => setShowCreateRoom(true)}>
                ➕ 创建房间
              </button>
            </div>

            <div className="room-list">
              {rooms.map(room => (
                <div key={room.id} className="room-card">
                  <div className="room-icon">
                    {room.status === 'waiting' ? '⏳' : '🎮'}
                  </div>
                  <div className="room-info">
                    <div className="room-name">{room.name}</div>
                    <div className="room-map">地图: {room.map}</div>
                  </div>
                  <div className="room-players">
                    <span className="player-count">{room.players}</span>
                    <span className="separator">/</span>
                    <span className="max-players">{room.maxPlayers}</span>
                  </div>
                  <div className={`room-status ${room.status}`}>
                    {room.status === 'waiting' ? '等待中' : '游戏中'}
                  </div>
                  <button className="join-btn">
                    {room.status === 'waiting' ? '加入' : '观战'}
                  </button>
                </div>
              ))}
            </div>

            {/* 快速加入 */}
            <div className="quick-join">
              <h4>快速加入</h4>
              <div className="quick-buttons">
                <button>🎲 随机匹配</button>
                <button>⚔️ PVP</button>
                <button>👥 副本</button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'friends' && (
          <>
            <div className="content-header">
              <h3>好友列表</h3>
              <button>➕ 添加好友</button>
            </div>

            <div className="friend-list">
              {friends.map(friend => (
                <div key={friend.id} className="friend-item">
                  <div className="friend-avatar">👤</div>
                  <div className="friend-info">
                    <div className="friend-name">{friend.name}</div>
                    <div className={`friend-status ${friend.status}`}>
                      {friend.status === 'online' && '在线'}
                      {friend.status === 'ingame' && '游戏中'}
                      {friend.status === 'away' && '离开'}
                    </div>
                  </div>
                  <div className="friend-actions">
                    <button>💬 消息</button>
                    <button>🎮 邀请</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="settings-panel">
            <h3>多人游戏设置</h3>
            
            <div className="setting-item">
              <label>允许陌生人邀请</label>
              <input type="checkbox" defaultChecked />
            </div>
            
            <div className="setting-item">
              <label>自动接受好友邀请</label>
              <input type="checkbox" />
            </div>
            
            <div className="setting-item">
              <label>麦克风</label>
              <select>
                <option>默认</option>
                <option>禁用</option>
              </select>
            </div>
            
            <div className="setting-item">
              <label>语音聊天</label>
              <select>
                <option>开启</option>
                <option>仅好友</option>
                <option>关闭</option>
              </select>
            </div>

            <div className="setting-item">
              <label>网络模式</label>
              <select>
                <option>自动</option>
                <option>UDP</option>
                <option>TCP</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 创建房间弹窗 */}
      {showCreateRoom && (
        <div className="modal-overlay" onClick={() => setShowCreateRoom(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>创建房间</h3>
            <div className="form-group">
              <label>房间名称</label>
              <input type="text" placeholder="输入房间名称" />
            </div>
            <div className="form-group">
              <label>选择地图</label>
              <select>
                <option>新手村</option>
                <option>森林</option>
                <option>副本</option>
                <option>竞技场</option>
              </select>
            </div>
            <div className="form-group">
              <label>最大玩家数</label>
              <select>
                <option>2人</option>
                <option>4人</option>
                <option>6人</option>
                <option>8人</option>
              </select>
            </div>
            <div className="form-group">
              <label>密码 (可选)</label>
              <input type="password" placeholder="留空则无需密码" />
            </div>
            <div className="modal-buttons">
              <button onClick={() => setShowCreateRoom(false)}>取消</button>
              <button className="primary">创建</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
