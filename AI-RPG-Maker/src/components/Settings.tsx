import { useState } from 'react'
import './Settings.css'

export default function Settings() {
  const [activeSection, setActiveSection] = useState<'general' | 'performance' | 'export' | 'about'>('general')

  return (
    <div className="settings-page">
      <aside className="settings-nav">
        <h3>⚙️ 设置</h3>
        <nav>
          <button className={activeSection === 'general' ? 'active' : ''} onClick={() => setActiveSection('general')}>通用</button>
          <button className={activeSection === 'performance' ? 'active' : ''} onClick={() => setActiveSection('performance')}>性能</button>
          <button className={activeSection === 'export' ? 'active' : ''} onClick={() => setActiveSection('export')}>导出</button>
          <button className={activeSection === 'about' ? 'active' : ''} onClick={() => setActiveSection('about')}>关于</button>
        </nav>
      </aside>

      <div className="settings-content">
        {activeSection === 'general' && (
          <div className="settings-section">
            <h2>通用设置</h2>
            
            <div className="setting-group">
              <h4>界面</h4>
              <div className="setting-item">
                <label>语言</label>
                <select defaultValue="zhCN">
                  <option value="zhCN">简体中文</option>
                  <option value="zhTW">繁體中文</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                </select>
              </div>
              <div className="setting-item">
                <label>主题</label>
                <select defaultValue="dark">
                  <option value="dark">深色</option>
                  <option value="light">浅色</option>
                  <option value="auto">跟随系统</option>
                </select>
              </div>
              <div className="setting-item">
                <label>编辑器网格</label>
                <input type="checkbox" defaultChecked /> 显示网格
              </div>
              <div className="setting-item">
                <label>自动保存</label>
                <input type="checkbox" defaultChecked /> 开启自动保存
              </div>
            </div>

            <div className="setting-group">
              <h4>快捷键</h4>
              <div className="shortcut-item">
                <span>保存项目</span>
                <kbd>Ctrl</kbd> + <kbd>S</kbd>
              </div>
              <div className="shortcut-item">
                <span>撤销</span>
                <kbd>Ctrl</kbd> + <kbd>Z</kbd>
              </div>
              <div className="shortcut-item">
                <span>重做</span>
                <kbd>Ctrl</kbd> + <kbd>Y</kbd>
              </div>
              <div className="shortcut-item">
                <span>运行游戏</span>
                <kbd>F5</kbd>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'performance' && (
          <div className="settings-section">
            <h2>性能设置</h2>
            
            <div className="setting-group">
              <h4>渲染</h4>
              <div className="setting-item">
                <label>帧率目标</label>
                <select defaultValue="60">
                  <option value="30">30 FPS</option>
                  <option value="60">60 FPS</option>
                  <option value="120">120 FPS</option>
                </select>
              </div>
              <div className="setting-item">
                <label>渲染质量</label>
                <select defaultValue="high">
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>
              <div className="setting-item">
                <label>粒子效果</label>
                <input type="checkbox" defaultChecked /> 开启
              </div>
            </div>

            <div className="setting-group">
              <h4>内存</h4>
              <div className="perf-stats">
                <div className="perf-bar">
                  <div className="perf-label">当前内存</div>
                  <div className="bar-container">
                    <div className="bar" style={{width: '45%'}}>45%</div>
                  </div>
                </div>
                <button>清理缓存</button>
              </div>
            </div>

            <div className="setting-group">
              <h4>网络</h4>
              <div className="setting-item">
                <label>延迟补偿</label>
                <input type="checkbox" defaultChecked /> 开启
              </div>
              <div className="setting-item">
                <label>预测移动</label>
                <input type="checkbox" defaultChecked /> 开启
              </div>
            </div>
          </div>
        )}

        {activeSection === 'export' && (
          <div className="settings-section">
            <h2>导出设置</h2>
            
            <div className="setting-group">
              <h4>导出平台</h4>
              <div className="platform-options">
                <label className="platform-card">
                  <input type="checkbox" defaultChecked />
                  <span className="icon">🪟</span>
                  <span>Windows</span>
                </label>
                <label className="platform-card">
                  <input type="checkbox" defaultChecked />
                  <span className="icon">🍎</span>
                  <span>macOS</span>
                </label>
                <label className="platform-card">
                  <input type="checkbox" />
                  <span className="icon">🌐</span>
                  <span>Web</span>
                </label>
                <label className="platform-card">
                  <input type="checkbox" />
                  <span className="icon">📱</span>
                  <span>iOS</span>
                </label>
                <label className="platform-card">
                  <input type="checkbox" />
                  <span className="icon">🤖</span>
                  <span>Android</span>
                </label>
              </div>
            </div>

            <div className="setting-group">
              <h4>导出选项</h4>
              <div className="setting-item">
                <label>压缩资源</label>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="setting-item">
                <label>加密脚本</label>
                <input type="checkbox" />
              </div>
              <div className="setting-item">
                <label>包含调试信息</label>
                <input type="checkbox" />
              </div>
            </div>

            <button className="export-btn">开始导出</button>
          </div>
        )}

        {activeSection === 'about' && (
          <div className="settings-section about">
            <div className="app-logo">🎮</div>
            <h2>AI RPG Maker</h2>
            <p className="version">版本 1.0.0</p>
            <p className="desc">一个强大的AI驱动RPG游戏制作平台</p>
            
            <div className="links">
              <a href="#">📖 文档</a>
              <a href="#">💬 社区</a>
              <a href="#">🐛 反馈</a>
              <a href="#">📧 联系我们</a>
            </div>

            <div className="tech-stack">
              <h4>技术栈</h4>
              <div className="tech-tags">
                <span>React</span>
                <span>PixiJS</span>
                <span>TypeScript</span>
                <span>Node.js</span>
                <span>Colyseus</span>
              </div>
            </div>

            <p className="copyright">© 2026 AI RPG Maker. All rights reserved.</p>
          </div>
        )}
      </div>
    </div>
  )
}
