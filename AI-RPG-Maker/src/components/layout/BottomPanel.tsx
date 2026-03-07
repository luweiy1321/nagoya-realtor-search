// ============================================================================
// Bottom Panel - Console and Output
// ============================================================================

import { useState } from 'react'
import './MainLayout.css'

interface BottomPanelProps {
  height: number
}

export default function BottomPanel({ height }: BottomPanelProps) {
  const [logs, setLogs] = useState<Array<{ time: string; type: string; message: string }>>([
    { time: new Date().toLocaleTimeString(), type: 'info', message: '欢迎使用 AI RPG Maker' },
  ])

  const [activeTab, setActiveTab] = useState<'console' | 'output' | 'problems'>('console')

  return (
    <div className="bottom-panel" style={{ height: `${height}px` }}>
      <div className="bottom-panel-tabs">
        <TabButton
          label="控制台"
          active={activeTab === 'console'}
          onClick={() => setActiveTab('console')}
        />
        <TabButton
          label="输出"
          active={activeTab === 'output'}
          onClick={() => setActiveTab('output')}
        />
        <TabButton
          label="问题"
          active={activeTab === 'problems'}
          onClick={() => setActiveTab('problems')}
        />
        <div className="bottom-panel-actions">
          <button
            className="clear-btn"
            onClick={() => setLogs([])}
            title="清空控制台"
          >
            清空
          </button>
        </div>
      </div>

      <div className="bottom-panel-content">
        {activeTab === 'console' && (
          <div className="console-logs">
            {logs.map((log, index) => (
              <div key={index} className={`log-entry log-${log.type}`}>
                <span className="log-time">{log.time}</span>
                <span className="log-message">{log.message}</span>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="console-empty">控制台已清空</div>
            )}
          </div>
        )}

        {activeTab === 'output' && (
          <div className="output-content">
            <p>构建输出将显示在这里...</p>
          </div>
        )}

        {activeTab === 'problems' && (
          <div className="problems-content">
            <p className="no-problems">✓ 没有检测到问题</p>
          </div>
        )}
      </div>
    </div>
  )
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button className={`bottom-tab ${active ? 'active' : ''}`} onClick={onClick}>
      {label}
    </button>
  )
}
