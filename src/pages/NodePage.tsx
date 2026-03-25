import { useCallback } from 'react'
import { GlassCard } from '../components/GlassCard'
import { useRemoteData } from '../hooks/useRemoteData'
import { api } from '../lib/api'
import { useI18n } from '../lib/i18n'

const initialData = {
  activeNodes: 0,
  nodeThreshold: 1500,
  orderShare: '',
  marketShare: '',
  rights: [],
}

export function NodePage() {
  const { locale, messages, formatCurrency, formatNumber } = useI18n()
  const loadNodes = useCallback(() => api.getNodes(locale), [locale])
  const { data } = useRemoteData(loadNodes, initialData)

  return (
    <div className="stack">
      <div className="page-header">
        <p className="eyebrow">{messages.node.eyebrow}</p>
        <h1 className="screen-title">{messages.node.title}</h1>
        <p className="screen-subtitle">{messages.node.subtitle}</p>
      </div>

      <GlassCard className="hero-card">
        <div className="detail-grid">
          <div>
            <div className="soft-label">{messages.node.nodeThreshold}</div>
            <div className="stat-value">{formatCurrency(data.nodeThreshold)}</div>
          </div>
          <div>
            <div className="soft-label">{messages.node.activeNodes}</div>
            <div className="stat-value">{formatNumber(data.activeNodes)}</div>
          </div>
          <div>
            <div className="soft-label">{messages.node.routeIncome}</div>
            <div className="stat-value">{data.orderShare}</div>
          </div>
          <div>
            <div className="soft-label">{messages.node.marketTaxFlow}</div>
            <div className="stat-value">{data.marketShare}</div>
          </div>
        </div>
        <div className="hero-actions">
          <button className="primary-button" type="button">
            {messages.node.applyForNode}
          </button>
          <button className="secondary-button" type="button">
            {messages.node.viewRights}
          </button>
        </div>
      </GlassCard>

      <GlassCard className="route-card">
        <div className="eyebrow">{messages.node.rights}</div>
        <ul className="muted-list">
          {data.rights.map((right: string) => (
            <li key={right}>{right}</li>
          ))}
        </ul>
      </GlassCard>
    </div>
  )
}
