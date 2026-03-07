import './MainLayout.css'

export default function EventPanel() {
  return (
    <div className="event-panel">
      <div className="event-panel-header">
        <h4>事件命令</h4>
      </div>
      <div className="event-content">
        <p className="event-empty">选择一个事件以编辑命令</p>
      </div>
    </div>
  )
}
