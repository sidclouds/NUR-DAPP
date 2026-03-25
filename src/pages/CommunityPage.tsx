import { useCallback } from 'react'
import { GlassCard } from '../components/GlassCard'
import { useRemoteData } from '../hooks/useRemoteData'
import { api } from '../lib/api'
import { useI18n } from '../lib/i18n'

const initialData = {
  totalMembers: 0,
  activeAmbassadors: 0,
  totalInviteRewards: 0,
  contributionScore: 0,
  levelProgress: 0,
  ambassadorTable: [],
}

export function CommunityPage() {
  const { locale, messages, formatCurrency, formatNumber, formatPercent, formatTemplate } = useI18n()
  const loadCommunity = useCallback(() => api.getCommunity(locale), [locale])
  const { data } = useRemoteData(loadCommunity, initialData)

  return (
    <div className="stack">
      <div className="page-header">
        <p className="eyebrow">{messages.community.eyebrow}</p>
        <h1 className="screen-title">{messages.community.title}</h1>
        <p className="screen-subtitle">{messages.community.subtitle}</p>
      </div>

      <div className="stats-grid">
        <GlassCard className="stat-card">
          <div className="stat-label">{messages.community.totalMembers}</div>
          <div className="stat-value">{formatNumber(data.totalMembers)}</div>
        </GlassCard>
        <GlassCard className="stat-card">
          <div className="stat-label">{messages.community.activeAmbassadors}</div>
          <div className="stat-value">{formatNumber(data.activeAmbassadors)}</div>
        </GlassCard>
        <GlassCard className="stat-card">
          <div className="stat-label">{messages.community.inviteRewards}</div>
          <div className="stat-value">{formatCurrency(data.totalInviteRewards)}</div>
        </GlassCard>
        <GlassCard className="stat-card">
          <div className="stat-label">{messages.community.contributionScore}</div>
          <div className="stat-value">{formatNumber(data.contributionScore)}</div>
        </GlassCard>
      </div>

      <GlassCard className="route-card">
        <div className="eyebrow">{messages.community.levelProgress}</div>
        <div className="hero-value">{formatPercent(data.levelProgress)}</div>
        <div className="progress">
          <span style={{ width: `${data.levelProgress * 100}%` }} />
        </div>
      </GlassCard>

      <div className="table">
        {data.ambassadorTable.map((item: { level: string; target: number; ratio: string }) => (
          <GlassCard key={item.level} className="table-row">
            <strong>{item.level}</strong>
            <span className="soft-label">
              {formatTemplate(messages.common.teamTargetLabel, {
                value: formatNumber(item.target),
              })}
            </span>
            <span className="soft-label">
              {formatTemplate(messages.common.cumulativeRatioLabel, {
                value: item.ratio,
              })}
            </span>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
