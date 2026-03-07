import { useState } from 'react'
import './Marketplace.css'

// 素材项
interface Asset {
  id: string
  name: string
  type: 'sprite' | 'music' | 'map' | 'script' | 'avatar'
  price: number
  author: string
  downloads: number
  rating: number
  image: string
}

// 分类
const CATEGORIES = [
  { id: 'all', name: '全部', icon: '🏪' },
  { id: 'sprite', name: '角色', icon: '👤' },
  { id: 'music', name: '音乐', icon: '🎵' },
  { id: 'map', name: '地图', icon: '🗺️' },
  { id: 'script', name: '脚本', icon: '📜' },
  { id: 'avatar', name: '头像', icon: '😀' },
]

// 素材数据
const MOCK_ASSETS: Asset[] = [
  { id: '1', name: '像素剑士', type: 'sprite', price: 0, author: 'PixelMaster', downloads: 1234, rating: 4.5, image: '⚔️' },
  { id: '2', name: '森林主题曲', type: 'music', price: 99, author: 'SoundWave', downloads: 567, rating: 4.8, image: '🎵' },
  { id: '3', name: '冰雪城堡地图', type: 'map', price: 199, author: 'MapMaker', downloads: 234, rating: 4.2, image: '🏰' },
  { id: '4', name: '商店系统脚本', type: 'script', price: 0, author: 'CodeWizard', downloads: 890, rating: 4.0, image: '💰' },
  { id: '5', name: '萌系头像包', type: 'avatar', price: 49, author: 'CuteArt', downloads: 456, rating: 4.7, image: '😀' },
  { id: '6', name: '火焰法师', type: 'sprite', price: 150, author: 'PixelMaster', downloads: 345, rating: 4.3, image: '🔥' },
  { id: '7', name: 'Boss战音乐', type: 'music', price: 199, author: 'SoundWave', downloads: 234, rating: 4.9, image: '👹' },
  { id: '8', name: '水下宫殿', type: 'map', price: 299, author: 'MapMaker', downloads: 123, rating: 4.6, image: '🌊' },
]

export default function Marketplace() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [cart, setCart] = useState<string[]>([])
  const [userPoints, setUserPoints] = useState(500)

  const filteredAssets = MOCK_ASSETS.filter(asset => {
    const matchesCategory = category === 'all' || asset.type === category
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase()) ||
                         asset.author.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    if (sortBy === 'popular') return b.downloads - a.downloads
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  const addToCart = (assetId: string) => {
    if (!cart.includes(assetId)) {
      setCart([...cart, assetId])
    }
  }

  const removeFromCart = (assetId: string) => {
    setCart(cart.filter(id => id !== assetId))
  }

  const cartTotal = cart.reduce((sum, id) => {
    const asset = MOCK_ASSETS.find(a => a.id === id)
    return sum + (asset?.price || 0)
  }, 0)

  return (
    <div className="marketplace">
      {/* 左侧边栏 */}
      <aside className="market-sidebar">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索素材..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="categories">
          <h4>分类</h4>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={category === cat.id ? 'active' : ''}
              onClick={() => setCategory(cat.id)}
            >
              <span className="icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        <div className="my-assets">
          <h4>我的素材</h4>
          <button>📦 已购买</button>
          <button>❤️ 收藏</button>
          <button>⬆️ 上传</button>
        </div>
      </aside>

      {/* 主内容 */}
      <div className="market-main">
        <div className="market-header">
          <h2>🏪 素材市场</h2>
          <div className="header-actions">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="popular">最受欢迎</option>
              <option value="price-low">价格从低到高</option>
              <option value="price-high">价格从高到低</option>
              <option value="rating">评分最高</option>
            </select>
            <div className="points">
              💰 {userPoints} 积分
            </div>
          </div>
        </div>

        <div className="asset-grid">
          {sortedAssets.map(asset => (
            <div key={asset.id} className="asset-card">
              <div className="asset-image">{asset.image}</div>
              <div className="asset-info">
                <div className="asset-name">{asset.name}</div>
                <div className="asset-author">by {asset.author}</div>
                <div className="asset-stats">
                  <span>⬇️ {asset.downloads}</span>
                  <span>⭐ {asset.rating}</span>
                </div>
              </div>
              <div className="asset-footer">
                <span className="asset-price">
                  {asset.price === 0 ? '免费' : `${asset.price}💰`}
                </span>
                {cart.includes(asset.id) ? (
                  <button className="in-cart">已加入</button>
                ) : (
                  <button onClick={() => addToCart(asset.id)}>加入购物车</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧购物车 */}
      <aside className="cart-panel">
        <div className="cart-header">
          <h3>🛒 购物车</h3>
          <span className="item-count">{cart.length} 件</span>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <p>购物车是空的</p>
            </div>
          ) : (
            cart.map(id => {
              const asset = MOCK_ASSETS.find(a => a.id === id)
              if (!asset) return null
              return (
                <div key={id} className="cart-item">
                  <div className="cart-item-info">
                    <div className="cart-item-name">{asset.name}</div>
                    <div className="cart-item-price">
                      {asset.price === 0 ? '免费' : `${asset.price}💰`}
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(id)}>×</button>
                </div>
              )
            })
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>总计:</span>
            <span>{cartTotal === 0 ? '免费' : `${cartTotal}💰`}</span>
          </div>
          <button className="checkout-btn" disabled={cart.length === 0}>
            立即购买
          </button>
          <button className="points-btn">
            充值积分
          </button>
        </div>

        {/* 销售统计 */}
        <div className="seller-stats">
          <h4>销售统计</h4>
          <div className="stat-item">
            <span>总收入</span>
            <span>1,234💰</span>
          </div>
          <div className="stat-item">
            <span>销量</span>
            <span>56 件</span>
          </div>
          <div className="stat-item">
            <span>评分</span>
            <span>4.7 ⭐</span>
          </div>
        </div>
      </aside>
    </div>
  )
}
