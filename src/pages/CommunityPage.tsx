import { GlassCard } from '../components/GlassCard'
import { useRemoteData } from '../hooks/useRemoteData'
import { api } from '../lib/api'

const initialData = {
  totalMembers: 0,
  activeAmbassadors: 0,
  totalInviteRewards: 0,
  contributionScore: 0,
  levelProgress: 0,
  ambassadorTable: [],
}

export function CommunityPage() {
  const { data } = useRemoteData(api.getCommunity, initialData)

  return (
    <div className="stack">
      <div className="page-header">
        <p className="eyebrow">Network</p>
        <h1 className="screen-title">Ambassador Network</h1>
        <p className="screen-subtitle">
          Community growth follows the active NUR ambassador ladder, with level-based differential rewards.
        </p>
      </div>

      <div className="stats-grid">
        <GlassCard className="stat-card">
          <div className="stat-label">Total Members</div>
          <div className="stat-value">{data.totalMembers}</div>
        </GlassCard>
        <GlassCard className="stat-card">
          <div className="stat-label">Active Ambassadors</div>
          <div className="stat-value">{data.activeAmbassadors}</div>
        </GlassCard>
        <GlassCard className="stat-card">
          <div className="stat-label">Invite Rewards</div>
          <div className="stat-value">${data.totalInviteRewards.toLocaleString()}</div>
        </GlassCard>
        <GlassCard className="stat-card">
          <div className="stat-label">Contribution Score</div>
          <div className="stat-value">{data.contributionScore}</div>
        </GlassCard>
      </div>

      <GlassCard className="route-card">
        <div className="eyebrow">Level Progress</div>
        <div className="hero-value">{Math.round(data.levelProgress * 100)}%</div>
        <div className="progress">
          <span style={{ width: `${data.levelProgress * 100}%` }} />
        </div>
      </GlassCard>

      <div className="table">
        {data.ambassadorTable.map((item: { level: string; target: number; ratio: string }) => (
          <GlassCard key={item.level} className="table-row">
            <strong>{item.level}</strong>
            <span className="soft-label">Team target {item.target.toLocaleString()}</span>
            <span className="soft-label">Cumulative ratio {item.ratio}</span>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
