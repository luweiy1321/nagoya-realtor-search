import { useDatabaseStore } from '../../../stores/databaseStore'
import type { Tileset } from '../../../types/database'

interface TilesetEditorProps {
  tileset: Tileset | null
}

export default function TilesetEditor({ tileset }: TilesetEditorProps) {
  if (!tileset) return <div>未选择图块集</div>

  const { updateTileset } = useDatabaseStore()

  return (
    <div className="db-editor-form">
      <div className="form-section">
        <h5>基本信息</h5>
        <div className="form-group">
          <label>名称</label>
          <input type="text" value={tileset.name} onChange={(e) => updateTileset(tileset.id, { name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>备注</label>
          <textarea value={tileset.note} onChange={(e) => updateTileset(tileset.id, { note: e.target.value })} rows={3} />
        </div>
      </div>

      <div className="form-section">
        <h5>图块图像</h5>
        {tileset.tilesetNames.map((name, index) => (
          <div key={index} className="tileset-image-item">
            <span>图块 {index + 1}</span>
            <input type="text" value={name} onChange={(e) => {
              const newNames = [...tileset.tilesetNames]
              newNames[index] = e.target.value
              updateTileset(tileset.id, { tilesetNames: newNames })
            }} placeholder="图像文件名" />
          </div>
        ))}
        <button onClick={() => updateTileset(tileset.id, {
          tilesetNames: [...tileset.tilesetNames, '']
        })}>+ 添加图块</button>
      </div>
    </div>
  )
}
