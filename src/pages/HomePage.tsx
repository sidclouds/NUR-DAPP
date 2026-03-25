import { useMemo } from 'react'
import { GlassCard } from '../components/GlassCard'
import { useRemoteData } from '../hooks/useRemoteData'
import { api } from '../lib/api'

const initialData = {
  hero: {
    heroTitle: '',
    heroSubtitle: '',
    heroVideoUrl: '',
    announcement: '',
    faq: [],
  },
  stats: [],
  aisRoutes: [],
  featuredOrder: {
    id: '',
    amountUsd: 0,
    routeCycleDays: 0,
    userSettlement: 0,
    tokenRewardAmount: 0,
    status: '',
  },
}

export function HomePage() {
  const { data } = useRemoteData(api.getDashboard, initialData)
  const totalHighlights = useMemo(() => data.stats.slice(0, 4), [data.stats])

  return (
    <div className="stack">
      <div className="page-header">
        <p className="eyebrow">NUR</p>
        <h1 className="screen-title">{data.hero.heroTitle}</h1>
        <p className="screen-subtitle">{data.hero.heroSubtitle}</p>
      </div>

      <GlassCard className="hero-card">
        <div className="eyebrow">Project Notice</div>
        <div className="hero-value">{data.hero.announcement}</div>
        <div className="hero-actions">
          <button className="primary-button" type="button">
            Unlock Access
          </button>
          <button className="secondary-button" type="button">
            View Routes
          </button>
        </div>
      </GlassCard>

      <div className="stats-grid">
        {totalHighlights.map((item) => (
          <GlassCard key={item.label} className="stat-card">
            <div className="stat-label">{item.label}</div>
            <div className="stat-value">{item.value}</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="route-card">
        <div className="eyebrow">Live Route Flow</div>
        <div className="stack" style={{ marginTop: 16 }}>
          {data.aisRoutes.map((route) => (
            <div key={route.name} className="line-item glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <strong>{route.name}</strong>
                <span className="soft-label">{route.status}</span>
              </div>
              <div className="progress">
                <span style={{ width: `${route.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="route-card">
        <div className="eyebrow">Featured Order</div>
        <div className="detail-grid" style={{ marginTop: 16 }}>
          <div>
            <div className="soft-label">Order ID</div>
            <div className="stat-value">{data.featuredOrder.id || 'N/A'}</div>
          </div>
          <div>
            <div className="soft-label">Subscription</div>
            <div className="stat-value">${data.featuredOrder.amountUsd}</div>
          </div>
          <div>
            <div className="soft-label">Confirmed Cycle</div>
            <div className="stat-value">{data.featuredOrder.routeCycleDays}D</div>
          </div>
          <div>
            <div className="soft-label">User Settlement</div>
            <div className="stat-value">${data.featuredOrder.userSettlement}</div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
