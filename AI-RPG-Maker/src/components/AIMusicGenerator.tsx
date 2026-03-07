import { useState } from 'react'
import './AIMusicGenerator.css'

// 音乐配置
interface MusicConfig {
  genre: string
  mood: string
  tempo: number
  duration: number
  instruments: string[]
}

// 生成的轨道
interface Track {
  id: string
  name: string
  type: 'melody' | 'harmony' | 'bass' | 'drums'
  notes: Note[]
}

interface Note {
  time: number
  pitch: number
  duration: number
  velocity: number
}

// 预设
const GENRES = [
  { id: 'fantasy', name: '奇幻', icon: '🏰' },
  { id: 'battle', name: '战斗', icon: '⚔️' },
  { id: 'peaceful', name: '平静', icon: '🌲' },
  { id: 'mysterious', name: '神秘', icon: '🔮' },
  { id: 'joyful', name: '欢乐', icon: '🎉' },
  { id: 'sad', name: '悲伤', icon: '🌧️' },
  { id: 'tension', name: '紧张', icon: '💢' },
  { id: 'boss', name: 'Boss战', icon: '👹' },
]

const MOODS = ['振奋', '舒缓', '紧张', '浪漫', '史诗', '阴暗', '欢快', '庄严']

const INSTRUMENTS = [
  { id: 'piano', name: '钢琴', icon: '🎹' },
  { id: 'violin', name: '小提琴', icon: '🎻' },
  { id: 'flute', name: '长笛', icon: '� flutian' },
  { id: 'guitar', name: '吉他', icon: '🎸' },
  { id: 'drums', name: '鼓', icon: '🥁' },
  { id: 'strings', name: '弦乐', icon: '🎻' },
  { id: 'synth', name: '合成器', icon: '🎛️' },
  { id: 'horn', name: '铜管', icon: '🎺' },
]

export default function AIMusicGenerator() {
  const [config, setConfig] = useState<MusicConfig>({
    genre: 'fantasy',
    mood: '史诗',
    tempo: 120,
    duration: 60,
    instruments: ['piano', 'strings'],
  })
  const [generating, setGenerating] = useState(false)
  const [tracks, setTracks] = useState<Track[]>([])
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  const toggleInstrument = (instId: string) => {
    if (config.instruments.includes(instId)) {
      setConfig({ ...config, instruments: config.instruments.filter(i => i !== instId) })
    } else {
      setConfig({ ...config, instruments: [...config.instruments, instId] })
    }
  }

  const generateMusic = async () => {
    setGenerating(true)
    
    // 模拟生成延迟
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 生成简单的旋律数据
    const newTracks: Track[] = config.instruments.map((inst, idx) => ({
      id: crypto.randomUUID(),
      name: INSTRUMENTS.find(i => i.id === inst)?.name || inst,
      type: idx === 0 ? 'melody' : idx === 1 ? 'harmony' : idx === 2 ? 'bass' : 'drums',
      notes: generateNotes(config.tempo, config.duration, idx),
    }))
    
    setTracks(newTracks)
    setGenerating(false)
  }

  const generateNotes = (tempo: number, duration: number, trackIdx: number): Note[] => {
    const notes: Note[] = []
    const beatDuration = 60 / tempo
    const totalBeats = (duration / beatDuration)
    
    // 根据轨道类型生成不同模式
    for (let beat = 0; beat < totalBeats; beat++) {
      const time = beat * beatDuration
      
      // 主旋律
      if (trackIdx === 0) {
        if (Math.random() > 0.3) {
          notes.push({
            time,
            pitch: 60 + Math.floor(Math.random() * 12), // C大调音阶
            duration: beatDuration * (Math.random() > 0.5 ? 1 : 0.5),
            velocity: 80 + Math.floor(Math.random() * 20),
          })
        }
      }
      // 和弦
      else if (trackIdx === 1) {
        if (beat % 4 === 0) {
          const basePitch = 48 + Math.floor(Math.random() * 12)
          notes.push({ time, pitch: basePitch, duration: beatDuration * 4, velocity: 60 })
          notes.push({ time, pitch: basePitch + 4, duration: beatDuration * 4, velocity: 50 })
          notes.push({ time, pitch: basePitch + 7, duration: beatDuration * 4, velocity: 50 })
        }
      }
      // 贝斯
      else if (trackIdx === 2) {
        if (beat % 2 === 0) {
          notes.push({
            time,
            pitch: 36 + Math.floor(Math.random() * 6),
            duration: beatDuration,
            velocity: 70,
          })
        }
      }
      // 鼓
      else if (trackIdx === 3) {
        if (beat % 2 === 0) {
          notes.push({ time, pitch: 1, duration: 0.1, velocity: 100 }) // 大鼓
        }
        if (beat % 4 === 2) {
          notes.push({ time: time + beatDuration * 0.5, pitch: 2, duration: 0.1, velocity: 80 }) // 小鼓
        }
      }
    }
    
    return notes
  }

  const playMusic = () => {
    setPlaying(true)
    setCurrentTime(0)
    
    // 简单模拟播放
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= config.duration) {
          setPlaying(false)
          clearInterval(interval)
          return 0
        }
        return prev + 0.1
      })
    }, 100)
  }

  const stopMusic = () => {
    setPlaying(false)
    setCurrentTime(0)
  }

  return (
    <div className="ai-music">
      {/* 左侧：配置 */}
      <aside className="music-config">
        <h3>🎵 AI 音乐生成器</h3>
        
        <div className="config-section">
          <label>音乐类型</label>
          <div className="genre-grid">
            {GENRES.map(genre => (
              <button
                key={genre.id}
                className={config.genre === genre.id ? 'active' : ''}
                onClick={() => setConfig({ ...config, genre: genre.id })}
              >
                <span className="icon">{genre.icon}</span>
                <span>{genre.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="config-section">
          <label>情绪</label>
          <select
            value={config.mood}
            onChange={(e) => setConfig({ ...config, mood: e.target.value })}
          >
            {MOODS.map(mood => (
              <option key={mood} value={mood}>{mood}</option>
            ))}
          </select>
        </div>

        <div className="config-section">
          <label>节奏 (BPM): {config.tempo}</label>
          <input
            type="range"
            min="60"
            max="180"
            value={config.tempo}
            onChange={(e) => setConfig({ ...config, tempo: parseInt(e.target.value) })}
          />
        </div>

        <div className="config-section">
          <label>时长 (秒): {config.duration}</label>
          <input
            type="range"
            min="30"
            max="180"
            step="30"
            value={config.duration}
            onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) })}
          />
        </div>

        <div className="config-section">
          <label>乐器选择</label>
          <div className="instrument-grid">
            {INSTRUMENTS.map(inst => (
              <button
                key={inst.id}
                className={config.instruments.includes(inst.id) ? 'active' : ''}
                onClick={() => toggleInstrument(inst.id)}
              >
                <span className="icon">{inst.icon}</span>
                <span>{inst.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          className="generate-btn"
          onClick={generateMusic}
          disabled={generating || config.instruments.length === 0}
        >
          {generating ? '🎵 生成中...' : '🎶 生成音乐'}
        </button>
      </aside>

      {/* 右侧：播放器 */}
      <div className="music-player">
        {tracks.length > 0 ? (
          <>
            <div className="player-header">
              <h3>🎧 {config.genre} - {config.mood}</h3>
              <div className="player-controls">
                {playing ? (
                  <button onClick={stopMusic}>⏹️ 停止</button>
                ) : (
                  <button onClick={playMusic}>▶️ 播放</button>
                )}
              </div>
            </div>

            {/* 进度条 */}
            <div className="progress-bar">
              <div 
                className="progress"
                style={{ width: `${(currentTime / config.duration) * 100}%` }}
              />
              <div className="time-display">
                <span>{Math.floor(currentTime)}s</span>
                <span>{config.duration}s</span>
              </div>
            </div>

            {/* 轨道 */}
            <div className="tracks">
              <h4>轨道</h4>
              {tracks.map(track => (
                <div key={track.id} className="track-item">
                  <div className="track-header">
                    <span className="track-icon">
                      {track.type === 'melody' && '🎵'}
                      {track.type === 'harmony' && '🎹'}
                      {track.type === 'bass' && '🎸'}
                      {track.type === 'drums' && '🥁'}
                    </span>
                    <span className="track-name">{track.name}</span>
                    <span className="track-notes">{track.notes.length} 音符</span>
                  </div>
                  
                  {/* 音符可视化 */}
                  <div className="track-visual">
                    {track.notes.slice(0, 50).map((note, idx) => (
                      <div
                        key={idx}
                        className={`note ${playing && Math.abs(note.time - currentTime) < 0.5 ? 'playing' : ''}`}
                        style={{
                          left: `${(note.time / config.duration) * 100}%`,
                          bottom: `${((note.pitch % 12) / 12) * 100}%`,
                          height: `${(note.duration / config.duration) * 100}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 导出 */}
            <div className="export-buttons">
              <button>💾 保存项目</button>
              <button>📤 导出 WAV</button>
              <button>📤 导出 MIDI</button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🎵</div>
            <h4>AI 音乐生成器</h4>
            <p>选择配置，点击生成，AI为你创作原创游戏音乐</p>
            <ul className="features">
              <li>🎼 多轨道编曲</li>
              <li>🎸 多种乐器</li>
              <li>🎵 智能和声</li>
              <li>🎧 动态BGM</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
