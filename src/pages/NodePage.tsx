import { GlassCard } from '../components/GlassCard'
import { useRemoteData } from '../hooks/useRemoteData'
import { api } from '../lib/api'

const initialData = {
  activeNodes: 0,
  nodeThreshold: 1500,
  orderShare: '',
  marketShare: '',
  rights: [],
}

export function NodePage() {
  const { data } = useRemoteData(api.getNodes, initialData)

  return (
    <div className="stack">
      <div className="page-header">
        <p className="eyebrow">Node</p>
        <h1 className="screen-title">Co-build Node</h1>
        <p className="screen-subtitle">
          Node qualification starts after 1,500 USDT accumulated participation and connects route profit flow with token tax inflow.
        </p>
      </div>

      <GlassCard className="hero-card">
        <div className="detail-grid">
          <div>
            <div className="soft-label">Node Threshold</div>
            <div className="stat-value">${data.nodeThreshold}</div>
          </div>
          <div>
            <div className="soft-label">Active Nodes</div>
            <div className="stat-value">{data.activeNodes}</div>
          </div>
          <div>
            <div className="soft-label">Route Income</div>
            <div className="stat-value">{data.orderShare}</div>
          </div>
          <div>
            <div className="soft-label">Market Tax Flow</div>
            <div className="stat-value">{data.marketShare}</div>
          </div>
        </div>
        <div className="hero-actions">
          <button className="primary-button" type="button">
            Apply for Node
          </button>
          <button className="secondary-button" type="button">
            View Rights
          </button>
        </div>
      </GlassCard>

      <GlassCard className="route-card">
        <div className="eyebrow">Node Rights</div>
        <ul className="muted-list">
          {data.rights.map((right: string) => (
            <li key={right}>{right}</li>
          ))}
        </ul>
      </GlassCard>
    </div>
  )
}
