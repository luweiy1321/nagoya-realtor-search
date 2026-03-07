// ============================================================================
// Enhanced Event Editor - With Command Palette Integration
// ============================================================================

import { useState } from 'react'
import CommandPalette, { EventCommand } from './CommandPalette'
import './EventEditorWithPalette.css'

// Event Types
interface GameEvent {
  id: string
  name: string
  trigger: EventTrigger
  pages: EventPage[]
  conditions: string[]
}

interface EventTrigger {
  type: 'collision' | 'talk' | 'auto' | 'parallel' | 'item' | 'time' | 'quest'
  params: Record<string, any>
}

interface EventPage {
  conditions: PageCondition
  list: EventCommandItem[]
  indent: number
}

interface PageCondition {
  switch1: boolean
  switch1Id: string
  switch2: boolean
  switch2Id: string
  variable: boolean
  variableId: string
  variableValue: number
  selfSwitch: boolean
  selfSwitchCh: string
  turnEnding: boolean
  turnValid: boolean
  turnA: number
  turnB: number
  enemyValid: boolean
  enemyHp: number
  enemyIndex: number
  actorValid: boolean
  actorHp: number
  actorId: string
}

interface EventCommandItem {
  id: string
  code: string
  indent: number
  parameters: (string | number | boolean)[]
  commandData?: EventCommand
}

const TRIGGER_TYPES = [
  { id: 'collision', name: '玩家接触', icon: '🚶' },
  { id: 'talk', name: '确定键', icon: '💬' },
  { id: 'auto', name: '自动执行', icon: '⚡' },
  { id: 'parallel', name: '并行处理', icon: '🔄' },
]

// Default page condition for new pages
const DEFAULT_PAGE_CONDITION: PageCondition = {
  switch1: false,
  switch1Id: '',
  switch2: false,
  switch2Id: '',
  variable: false,
  variableId: '',
  variableValue: 0,
  selfSwitch: false,
  selfSwitchCh: '',
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
}

export default function EventEditorWithPalette() {
  const [events, setEvents] = useState<GameEvent[]>([
    {
      id: '1',
      name: '新事件',
      trigger: { type: 'talk', params: {} },
      pages: [
        {
          conditions: {
            switch1: false,
            switch1Id: '',
            switch2: false,
            switch2Id: '',
            variable: false,
            variableId: '',
            variableValue: 0,
            selfSwitch: false,
            selfSwitchCh: '',
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
          },
          list: [],
          indent: 0,
        }
      ],
      conditions: [],
    }
  ])
  const [selectedEvent, setSelectedEvent] = useState<string | null>('1')
  const [selectedPage, setSelectedPage] = useState(0)
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null)
  const [showCommandPalette, setShowCommandPalette] = useState(false)

  const currentEvent = events.find(e => e.id === selectedEvent)
  const currentPage = currentEvent?.pages[selectedPage]

  const addEvent = () => {
    const newEvent: GameEvent = {
      id: crypto.randomUUID(),
      name: `事件 ${events.length + 1}`,
      trigger: { type: 'talk', params: {} },
      pages: [{ conditions: DEFAULT_PAGE_CONDITION, list: [], indent: 0 }],
      conditions: [],
    }
    setEvents([...events, newEvent])
    setSelectedEvent(newEvent.id)
  }

  const updateEvent = (id: string, updates: Partial<GameEvent>) => {
    setEvents(events.map(e => e.id === id ? { ...e, ...updates } : e))
  }

  const addPage = () => {
    if (!currentEvent) return
    const newPages = [...currentEvent.pages, { conditions: DEFAULT_PAGE_CONDITION, list: [], indent: 0 }]
    updateEvent(currentEvent.id, { pages: newPages })
  }

  const addCommand = (command: EventCommand, indent: number = 0) => {
    if (!currentEvent || !currentPage) return

    const newCommand: EventCommandItem = {
      id: crypto.randomUUID(),
      code: command.code,
      indent: indent,
      parameters: [],
      commandData: command,
    }

    const newPages = [...currentEvent.pages]
    newPages[selectedPage] = {
      ...currentPage,
      list: [...currentPage.list, newCommand]
    }

    updateEvent(currentEvent.id, { pages: newPages })
  }

  const deleteCommand = (commandId: string) => {
    if (!currentEvent || !currentPage) return

    const newPages = [...currentEvent.pages]
    newPages[selectedPage] = {
      ...currentPage,
      list: currentPage.list.filter(cmd => cmd.id !== commandId)
    }

    updateEvent(currentEvent.id, { pages: newPages })
  }

  const moveCommand = (commandId: string, direction: 'up' | 'down') => {
    if (!currentEvent || !currentPage) return

    const list = [...currentPage.list]
    const index = list.findIndex(cmd => cmd.id === commandId)

    if (direction === 'up' && index > 0) {
      ;[list[index - 1], list[index]] = [list[index], list[index - 1]]
    } else if (direction === 'down' && index < list.length - 1) {
      ;[list[index], list[index + 1]] = [list[index + 1], list[index]]
    }

    const newPages = [...currentEvent.pages]
    newPages[selectedPage] = { ...currentPage, list }

    updateEvent(currentEvent.id, { pages: newPages })
  }

  return (
    <div className="event-editor-with-palette">
      {/* Left Sidebar - Event List */}
      <aside className="event-list-sidebar">
        <div className="sidebar-header">
          <h3>事件列表</h3>
          <button className="add-btn" onClick={addEvent}>+ 新建</button>
        </div>
        <div className="event-items">
          {events.map(event => (
            <div
              key={event.id}
              className={`event-item ${selectedEvent === event.id ? 'selected' : ''}`}
              onClick={() => setSelectedEvent(event.id)}
            >
              <span className="event-icon">
                {event.trigger.type === 'collision' && '🚶'}
                {event.trigger.type === 'talk' && '💬'}
                {event.trigger.type === 'auto' && '⚡'}
                {event.trigger.type === 'parallel' && '🔄'}
              </span>
              <span className="event-name">{event.name}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Middle - Command List */}
      <div className="event-commands-area">
        {currentEvent ? (
          <>
            <div className="event-header">
              <input
                type="text"
                value={currentEvent.name}
                onChange={(e) => updateEvent(currentEvent.id, { name: e.target.value })}
                className="event-name-input"
              />
              <select
                value={currentEvent.trigger.type}
                onChange={(e) => updateEvent(currentEvent.id, {
                  trigger: { ...currentEvent.trigger, type: e.target.value as any }
                })}
                className="trigger-select"
              >
                {TRIGGER_TYPES.map(t => (
                  <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                ))}
              </select>
            </div>

            <div className="page-tabs">
              {currentEvent.pages.map((_, index) => (
                <button
                  key={index}
                  className={`page-tab ${selectedPage === index ? 'active' : ''}`}
                  onClick={() => setSelectedPage(index)}
                >
                  页面 {index + 1}
                </button>
              ))}
              <button className="page-tab add-page" onClick={addPage}>+ 新建页面</button>
            </div>

            <div className="commands-list">
              {currentPage?.list.length === 0 ? (
                <div className="empty-commands">
                  <span className="empty-icon">📝</span>
                  <p>此页面没有命令</p>
                  <button className="add-first-command-btn" onClick={() => setShowCommandPalette(true)}>
                    + 添加命令
                  </button>
                </div>
              ) : (
                currentPage?.list.map((command, index) => (
                  <div
                    key={command.id}
                    className={`command-row ${selectedCommand === command.id ? 'selected' : ''}`}
                    onClick={() => setSelectedCommand(command.id)}
                    style={{ paddingLeft: `${12 + command.indent * 20}px` }}
                  >
                    <span className="command-number">{index + 1}</span>
                    {command.commandData && (
                      <>
                        <span className="command-icon">{command.commandData.icon}</span>
                        <span className="command-name">{command.commandData.name}</span>
                      </>
                    )}
                    {!command.commandData && (
                      <span className="command-code">Code: {command.code}</span>
                    )}
                    <div className="command-actions">
                      <button
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          moveCommand(command.id, 'up')
                        }}
                        disabled={index === 0}
                      >↑</button>
                      <button
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          moveCommand(command.id, 'down')
                        }}
                        disabled={index === (currentPage?.list.length ?? 0) - 1}
                      >↓</button>
                      <button
                        className="action-btn delete"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteCommand(command.id)
                        }}
                      >×</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="add-command-fab" onClick={() => setShowCommandPalette(true)}>
              <span>+</span>
            </button>
          </>
        ) : (
          <div className="no-event-selected">
            <span className="empty-icon">📋</span>
            <p>选择一个事件进行编辑</p>
          </div>
        )}
      </div>

      {/* Right - Command Properties */}
      <div className="command-properties">
        {selectedCommand && currentPage?.list.find(c => c.id === selectedCommand) ? (
          <div className="properties-content">
            <h4>命令属性</h4>
            <p>选择命令的参数编辑器即将推出...</p>
          </div>
        ) : (
          <div className="properties-empty">
            <span className="empty-icon">⚙️</span>
            <p>选择一个命令查看属性</p>
          </div>
        )}
      </div>

      {showCommandPalette && (
        <CommandPalette
          onCommandSelect={(cmd) => addCommand(cmd, 0)}
          onClose={() => setShowCommandPalette(false)}
        />
      )}
    </div>
  )
}
