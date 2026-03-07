import { useState } from 'react'
import './MainLayout.css'

export default function ConsolePanel() {
  const [logs, setLogs] = useState<Array<{ time: string; type: string; message: string }>>([])

  return (
    <div className="console-panel">
      <div className="console-logs">
        {logs.length === 0 ? (
          <p className="console-empty">控制台为空</p>
        ) : (
          logs.map((log, i) => (
            <div key={i} className={`log-entry log-${log.type}`}>
              <span className="log-time">{log.time}</span>
              <span className="log-message">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
