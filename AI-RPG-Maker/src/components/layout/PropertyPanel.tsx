import './MainLayout.css'

export default function PropertyPanel() {
  return (
    <div className="property-panel">
      <div className="property-panel-header">
        <h4>属性</h4>
      </div>
      <div className="property-content">
        <p className="property-empty">选择一个对象以查看属性</p>
      </div>
    </div>
  )
}
