// ============================================================================
// Resource Manager - Asset Browser and Management
// ============================================================================

import { useState } from 'react'
import './ResourceManager.css'

export interface ResourceItem {
  id: string
  name: string
  type: ResourceType
  category: string
  thumbnail?: string
  path: string
  size?: number
}

type ResourceType =
  | 'character'
  | 'battler'
  | 'face'
  | 'picture'
  | 'tileset'
  | 'bgm'
  | 'bgs'
  | 'me'
  | 'se'
  | 'movie'
  | 'other'

const RESOURCE_CATEGORIES = [
  { id: 'character', name: '角色图', icon: '👤' },
  { id: 'battler', name: '战斗图', icon: '⚔️' },
  { id: 'face', name: '脸部图', icon: '😊' },
  { id: 'picture', name: '图片', icon: '🖼️' },
  { id: 'tileset', name: '图块', icon: '🧩' },
  { id: 'bgm', name: 'BGM', icon: '🎵' },
  { id: 'bgs', name: 'BGS', icon: '🌊' },
  { id: 'me', name: 'ME', icon: '🎶' },
  { id: 'se', name: 'SE', icon: '🔊' },
  { id: 'movie', name: '影片', icon: '🎬' },
]

const sampleResources: ResourceItem[] = [
  { id: '1', name: 'Actor1', type: 'character', category: 'character', path: 'img/characters/Actor1.png' },
  { id: '2', name: 'Monster1', type: 'battler', category: 'battler', path: 'img/enemies/Monster1.png' },
  { id: '3', name: 'Field', type: 'tileset', category: 'tileset', path: 'img/tilesets/Field.png' },
]

export default function ResourceManager() {
  const [selectedCategory, setSelectedCategory] = useState<ResourceType>('character')
  const [selectedResource, setSelectedResource] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredResources = sampleResources.filter(
    (r) => r.category === selectedCategory && r.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '*/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        console.log('Importing file:', file.name)
        // TODO: Implement file import
      }
    }
    input.click()
  }

  return (
    <div className="resource-manager">
      <div className="resource-manager-header">
        <h4>资源管理器</h4>
        <button className="import-btn" onClick={handleImport} title="导入资源">
          📥 导入
        </button>
      </div>

      <div className="resource-search">
        <input
          type="text"
          placeholder="搜索资源..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="resource-categories">
        {RESOURCE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id as ResourceType)}
            title={cat.name}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="resource-list">
        {filteredResources.length === 0 ? (
          <div className="resource-empty">
            <span className="empty-icon">📁</span>
            <p>没有找到资源</p>
            <button className="add-first-btn" onClick={handleImport}>
              导入资源
            </button>
          </div>
        ) : (
          filteredResources.map((resource) => (
            <div
              key={resource.id}
              className={`resource-item ${selectedResource === resource.id ? 'selected' : ''}`}
              onClick={() => setSelectedResource(resource.id)}
              onDoubleClick={() => console.log('Open resource:', resource)}
            >
              <div className="resource-thumbnail">
                {resource.thumbnail ? (
                  <img src={resource.thumbnail} alt={resource.name} />
                ) : (
                  <span className="placeholder-icon">📄</span>
                )}
              </div>
              <div className="resource-info">
                <span className="resource-name">{resource.name}</span>
                {resource.size && (
                  <span className="resource-size">{formatFileSize(resource.size)}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="resource-footer">
        <span className="resource-count">{filteredResources.length} 个项目</span>
      </div>
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
