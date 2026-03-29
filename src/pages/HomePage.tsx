import { useCallback, useMemo } from 'react'
import { GlassCard } from '../components/GlassCard'
import { useRemoteData } from '../hooks/useRemoteData'
import { api } from '../lib/api'
import { useI18n } from '../lib/i18n'

const initialData = {
  hero: {
    heroTitle: '',
    heroSubtitle: '',
    heroVideoUrl: '',
    announcement: '',
    faq: [],
  },
  stats: [],
  execution: [],
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
  const { locale, messages, formatCurrency, formatDaysShort } = useI18n()
  const loadDashboard = useCallback(() => api.getDashboard(locale), [locale])
  const { data } = useRemoteData(loadDashboard, initialData)
  const totalHighlights = useMemo(() => data.stats.slice(0, 4), [data.stats])

  return (
    <div className="stack">
      <div className="page-header">
        <p className="eyebrow">NUR</p>
        <h1 className="screen-title">{data.hero.heroTitle}</h1>
        <p className="screen-subtitle">{data.hero.heroSubtitle}</p>
      </div>

      <GlassCard className="hero-card">
        <div className="eyebrow">{messages.home.notice}</div>
        <div className="hero-value">{data.hero.announcement}</div>
        <div className="hero-actions">
          <button className="primary-button" type="button">
            {messages.home.unlockAccess}
          </button>
          <button className="secondary-button" type="button">
            {messages.home.viewRoutes}
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
        <div className="eyebrow">{messages.home.liveRouteFlow}</div>
        <div className="stack" style={{ marginTop: 16 }}>
          {data.execution.map((item) => (
            <div key={item.title} className="line-item glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <strong>{item.title}</strong>
                <span className="soft-label">Live rule</span>
              </div>
              <div className="soft-label">{item.detail}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="route-card">
        <div className="eyebrow">{messages.home.featuredOrder}</div>
        <div className="detail-grid" style={{ marginTop: 16 }}>
          <div>
            <div className="soft-label">{messages.home.orderId}</div>
            <div className="stat-value">{data.featuredOrder.id || 'N/A'}</div>
          </div>
          <div>
            <div className="soft-label">{messages.home.subscription}</div>
            <div className="stat-value">{formatCurrency(data.featuredOrder.amountUsd)}</div>
          </div>
          <div>
            <div className="soft-label">{messages.home.confirmedCycle}</div>
            <div className="stat-value">{formatDaysShort(data.featuredOrder.routeCycleDays)}</div>
          </div>
          <div>
            <div className="soft-label">{messages.home.userSettlement}</div>
            <div className="stat-value">{formatCurrency(data.featuredOrder.userSettlement)}</div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
