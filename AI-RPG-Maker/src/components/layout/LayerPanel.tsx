import { useState } from 'react'
import './MainLayout.css'

export default function LayerPanel() {
  const [layers, setLayers] = useState([
    { id: 'overlay', name: '上层', visible: true, locked: false },
    { id: 'collision', name: '碰撞', visible: true, locked: false },
    { id: 'ground', name: '地面', visible: true, locked: false },
    { id: 'underlay', name: '底层', visible: true, locked: false },
  ])

  const [selectedLayer, setSelectedLayer] = useState('ground')

  const toggleVisibility = (id: string) => {
    setLayers(layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l))
  }

  const toggleLock = (id: string) => {
    setLayers(layers.map(l => l.id === id ? { ...l, locked: !l.locked } : l))
  }

  return (
    <div className="layer-panel">
      <div className="layer-panel-header">
        <h4>图层</h4>
      </div>
      <div className="layer-list">
        {[...layers].reverse().map((layer) => (
          <div
            key={layer.id}
            className={`layer-item ${selectedLayer === layer.id ? 'selected' : ''}`}
            onClick={() => setSelectedLayer(layer.id)}
          >
            <div className="layer-controls">
              <button
                className={`layer-btn ${layer.visible ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleVisibility(layer.id)
                }}
                title={layer.visible ? '隐藏' : '显示'}
              >
                👁️
              </button>
              <button
                className={`layer-btn ${layer.locked ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleLock(layer.id)
                }}
                title={layer.locked ? '解锁' : '锁定'}
              >
                🔒
              </button>
            </div>
            <span className="layer-name">{layer.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
