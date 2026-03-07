// ============================================================================
// Command Palette - Visual Event Command Selection
// ============================================================================

import { useState } from 'react'
import './CommandPalette.css'

export interface EventCommand {
  code: string
  name: string
  description: string
  icon: string
  category: string
}

interface CommandPaletteProps {
  onCommandSelect: (command: EventCommand) => void
  onClose: () => void
}

const ALL_COMMANDS: EventCommand[] = [
  // Message Commands
  { code: '101', name: '显示文本', description: '显示一条消息对话框', icon: '💬', category: 'message' },
  { code: '102', name: '显示选项', description: '显示多个选项供玩家选择', icon: '📝', category: 'message' },
  { code: '103', name: '输入数字', description: '让玩家输入数字', icon: '🔢', category: 'message' },
  { code: '104', name: '显示选择项', description: '显示选择列表', icon: '📋', category: 'message' },

  // Flow Control
  { code: '111', name: '条件分支', description: '根据条件执行不同命令', icon: '🔀', category: 'flow' },
  { code: '112', name: '循环', description: '重复执行命令', icon: '🔁', category: 'flow' },
  { code: '113', name: '跳出循环', description: '跳出当前循环', icon: '⤴️', category: 'flow' },
  { code: '115', name: '等待', description: '等待指定帧数', icon: '⏱️', category: 'flow' },
  { code: '117', name: '公共事件', description: '调用公共事件', icon: '📞', category: 'flow' },
  { code: '119', name: '标签', description: '设置标签位置', icon: '🏷️', category: 'flow' },
  { code: '121', name: '跳转标签', description: '跳转到指定标签', icon: '➡️', category: 'flow' },

  // Game Progress
  { code: '122', name: '开关操作', description: '设置游戏开关', icon: '🔘', category: 'progress' },
  { code: '123', name: '变量操作', description: '设置游戏变量', icon: '🔢', category: 'progress' },
  { code: '124', name: '独立开关', description: '设置地图独立开关', icon: '🔲', category: 'progress' },
  { code: '125', name: '增加/减少物品', description: '改变玩家物品数量', icon: '🎒', category: 'progress' },
  { code: '126', name: '改变武器', description: '改变队伍武器', icon: '⚔️', category: 'progress' },
  { code: '127', name: '改变护甲', description: '改变队伍护甲', icon: '🛡️', category: 'progress' },

  // Party
  { code: '201', name: '转移地点', description: '转移玩家到指定位置', icon: '🚪', category: 'movement' },
  { code: '202', name: '设置移动路线', description: '设置角色移动路径', icon: '📍', category: 'movement' },
  { code: '203', name: '设置事件位置', description: '设置事件或角色的位置', icon: '📍', category: 'movement' },
  { code: '204', name: '交换位置', description: '交换两个角色的位置', icon: '🔄', category: 'movement' },
  { code: '205', name: '显示动画', description: '在指定位置显示动画', icon: '✨', category: 'movement' },

  // Character
  { code: '301', name: '角色状态', description: '改变角色的状态', icon: '👤', category: 'character' },
  { code: '302', name: '改变图形', description: '改变角色的行走图', icon: '🖼️', category: 'character' },
  { code: '303', name: '改变透明度', description: '设置角色透明度', icon: '👻', category: 'character' },
  { code: '304', name: '角色合成', description: '合成多个角色的图形', icon: '🔀', category: 'character' },

  // Pictures
  { code: '231', name: '显示图片', description: '在屏幕上显示图片', icon: '🖼️', category: 'picture' },
  { code: '232', name: '移动图片', description: '移动屏幕上的图片', icon: '➡️', category: 'picture' },
  { code: '233', name: '旋转图片', description: '旋转屏幕上的图片', icon: '🔄', category: 'picture' },
  { code: '235', name: '删除图片', description: '删除屏幕上的图片', icon: '🗑️', category: 'picture' },

  // Weather
  { code: '225', name: '设置天气', description: '改变当前天气效果', icon: '🌤️', category: 'screen' },
  { code: '226', name: '画面闪烁', description: '让屏幕闪烁', icon: '⚡', category: 'screen' },
  { code: '223', name: '设置色调', description: '改变画面色调', icon: '🎨', category: 'screen' },
  { code: '224', name: '震动屏幕', description: '震动屏幕效果', icon: '📳', category: 'screen' },

  // Audio
  { code: '241', name: '播放BGM', description: '播放背景音乐', icon: '🎵', category: 'audio' },
  { code: '242', name: '淡出BGM', description: '淡出背景音乐', icon: '🎵', category: 'audio' },
  { code: '243', name: '保存BGM', description: '保存当前BGM位置', icon: '💾', category: 'audio' },
  { code: '244', name: '重播BGM', description: '重新播放保存的BGM', icon: '🔄', category: 'audio' },
  { code: '245', name: '播放BGS', description: '播放背景音效', icon: '🌊', category: 'audio' },
  { code: '249', name: '播放ME', description: '播放音乐效果', icon: '🎶', category: 'audio' },
  { code: '250', name: '播放SE', description: '播放音效', icon: '🔊', category: 'audio' },
  { code: '251', name: '停止SE', description: '停止所有音效', icon: '🔇', category: 'audio' },

  // Battle
  { code: '601', name: '战斗处理', description: '开始战斗', icon: '⚔️', category: 'battle' },
  { code: '602', name: '胜利时', description: '战斗胜利后执行', icon: '🏆', category: 'battle' },
  { code: '603', name: '逃跑时', description: '战斗逃跑后执行', icon: '🏃', category: 'battle' },
  { code: '604', name: '失败时', description: '战斗失败后执行', icon: '💀', category: 'battle' },

  // System
  { code: '311', name: '改变队伍', description: '添加或移除角色', icon: '👥', category: 'system' },
  { code: '312', name: '改变战斗背景', description: '设置战斗背景图', icon: '🖼️', category: 'system' },
  { code: '313', name: '禁止存档', description: '禁止或允许存档', icon: '💾', category: 'system' },
  { code: '314', name: '禁止菜单', description: '禁止或打开菜单', icon: '📋', category: 'system' },
  { code: '315', name: '禁止/允许 encounters', description: '控制随机遭遇', icon: '🎲', category: 'system' },
  { code: '318', name: '改变MP', description: '恢复或减少MP', icon: '💙', category: 'system' },
  { code: '319', name: '改变状态', description: '添加或移除状态', icon: '💊', category: 'system' },
  { code: '320', name: '完全恢复', description: '完全恢复角色状态', icon: '❤️', category: 'system' },
  { code: '321', name: '改变HP', description: '增加或减少HP', icon: '❤️', category: 'system' },
  { code: '322', name: '改变经验值', description: '增加或减少经验', icon: '⭐', category: 'system' },
  { code: '323', name: '改变等级', description: '改变角色等级', icon: '📊', category: 'system' },
  { code: '324', name: '改变能力值', description: '改变角色参数', icon: '📈', category: 'system' },
  { code: '325', name: '改变技能', description: '习得或遗忘技能', icon: '✨', category: 'system' },
  { code: '326', name: '改变装备', description: '更换角色装备', icon: '👕', category: 'system' },
  { code: '327', name: '改变角色名称', description: '修改角色名称', icon: '✏️', category: 'system' },
  { code: '328', name: '改变角色职业', description: '修改角色职业', icon: '⚔️', category: 'system' },
  { code: '329', name: '改变角色图形', description: '修改角色外观', icon: '🖼️', category: 'system' },
  { code: '330', name: '改变载具图形', description: '修改载具外观', icon: '🚗', category: 'system' },
  { code: '331', name: '事件位置接触', description: '处理事件接触', icon: '📍', category: 'system' },
  { code: '332', name: '恢复/禁止战斗', description: '启用/禁用战斗', icon: '⚔️', category: 'system' },
  { code: '333', name: '启用/禁用菜单', description: '控制菜单开关', icon: '📋', category: 'system' },
  { code: '334', name: '改变金钱', description: '增加或减少金钱', icon: '💰', category: 'system' },
  { code: '335', name: '改变武器', description: '改变队伍武器', icon: '⚔️', category: 'system' },
  { code: '336', name: '改变护甲', description: '改变队伍护甲', icon: '🛡️', category: 'system' },
  { code: '337', name: '移除武器/护甲', description: '移除装备', icon: '🗑️', category: 'system' },
  { code: '338', name: '禁用/启用载具', description: '控制载具状态', icon: '🚗', category: 'system' },
  { code: '339', name: '更改载具位置', description: '移动载具位置', icon: '📍', category: 'system' },
  { code: '340', name: '事件处理', description: '处理事件触发', icon: '⚡', category: 'system' },
  { code: '341', name: '获取信息', description: '获取游戏信息', icon: 'ℹ️', category: 'system' },
  { code: '342', name: '敌人HP', description: '改变敌人HP', icon: '❤️', category: 'system' },
  { code: '343', name: '敌人状态', description: '改变敌人状态', icon: '💊', category: 'system' },
  { code: '344', name: '显示/隐藏敌人', description: '控制敌人显示', icon: '👁️', category: 'system' },
  { code: '345', name: '改变敌人MP', description: '改变敌人MP', icon: '💙', category: 'system' },
  { code: '346', name: '改变敌人属性', description: '改变敌人参数', icon: '📊', category: 'system' },
  { code: '351', name: '调用事件', description: '调用其他地图事件', icon: '📞', category: 'system' },
  { code: '355', name: '定时器', description: '设置游戏定时器', icon: '⏰', category: 'system' },
  { code: '356', name: '金币收集', description: '收集战斗金币', icon: '💰', category: 'system' },
]

const CATEGORIES = [
  { id: 'message', name: '消息', icon: '💬' },
  { id: 'flow', name: '流程控制', icon: '🔀' },
  { id: 'progress', name: '游戏进度', icon: '📊' },
  { id: 'movement', name: '移动', icon: '🚶' },
  { id: 'character', name: '角色', icon: '👤' },
  { id: 'picture', name: '图片', icon: '🖼️' },
  { id: 'screen', name: '画面', icon: '🎬' },
  { id: 'audio', name: '音频', icon: '🔊' },
  { id: 'battle', name: '战斗', icon: '⚔️' },
  { id: 'system', name: '系统', icon: '⚙️' },
]

export default function CommandPalette({ onCommandSelect, onClose }: CommandPaletteProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('message')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCommands = ALL_COMMANDS.filter(cmd => {
    const matchesCategory = cmd.category === selectedCategory
    const matchesSearch = cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <div className="command-palette-header">
          <h3>添加事件命令</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="command-palette-search">
          <input
            type="text"
            placeholder="搜索命令..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="command-palette-content">
          {!searchQuery && (
            <div className="command-categories">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          )}

          <div className="command-list">
            {filteredCommands.length === 0 ? (
              <div className="no-results">
                <span>😕</span>
                <p>没有找到匹配的命令</p>
              </div>
            ) : (
              filteredCommands.map(cmd => (
                <button
                  key={cmd.code}
                  className="command-item"
                  onClick={() => {
                    onCommandSelect(cmd)
                    onClose()
                  }}
                >
                  <span className="command-icon">{cmd.icon}</span>
                  <div className="command-info">
                    <span className="command-name">{cmd.name}</span>
                    <span className="command-description">{cmd.description}</span>
                  </div>
                  <span className="command-code">#{cmd.code}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { ALL_COMMANDS }
