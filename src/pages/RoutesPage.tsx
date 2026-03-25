import { useCallback, useEffect, useState } from 'react'
import { GlassCard } from '../components/GlassCard'
import { api } from '../lib/api'
import { useI18n } from '../lib/i18n'
import type { CycleItem, OrderPreview } from '../types/api'

export function RoutesPage() {
  const { locale, messages, formatCurrency, formatDaysShort, formatPercent, formatDayWindow, formatTemplate } = useI18n()
  const [cycles, setCycles] = useState<CycleItem[]>([])
  const [amount, setAmount] = useState(200)
  const [preview, setPreview] = useState<OrderPreview>({
    amountUsd: 200,
    cycleDays: 30,
    multiplier: 1.517535,
    estimatedReturn: 303.51,
    userSettlement: 251.76,
    tokenRewardAmount: 0,
    maturityLabel: formatDayWindow(30),
  })

  useEffect(() => {
    api.getCycles().then(setCycles)
  }, [])

  const refreshPreview = useCallback(() => {
    api.previewOrder(amount, locale).then(setPreview)
  }, [amount, locale])

  useEffect(() => {
    refreshPreview()
  }, [refreshPreview])

  return (
    <div className="stack">
      <div className="page-header">
        <p className="eyebrow">{messages.routes.eyebrow}</p>
        <h1 className="screen-title">{messages.routes.title}</h1>
        <p className="screen-subtitle">{messages.routes.subtitle}</p>
      </div>

      <GlassCard className="hero-card">
        <div className="field">
          <label htmlFor="amount">{messages.routes.amountLabel}</label>
          <input
            id="amount"
            type="number"
            min={1}
            max={1000}
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
          />
        </div>
        <div className="split-actions">
          <button className="primary-button" type="button" onClick={refreshPreview}>
            {messages.routes.refreshPreview}
          </button>
          <button className="secondary-button" type="button">
            {messages.routes.submitOrder}
          </button>
        </div>
      </GlassCard>

      <GlassCard className="route-card">
        <div className="eyebrow">{messages.routes.previewResult}</div>
        <div className="detail-grid" style={{ marginTop: 16 }}>
          <div>
            <div className="soft-label">{messages.routes.randomCycle}</div>
            <div className="stat-value">{formatDaysShort(preview.cycleDays)}</div>
          </div>
          <div>
            <div className="soft-label">{messages.routes.settlementMultiplier}</div>
            <div className="stat-value">{preview.multiplier.toFixed(6)}x</div>
          </div>
          <div>
            <div className="soft-label">{messages.routes.grossReturn}</div>
            <div className="stat-value">{formatCurrency(preview.estimatedReturn)}</div>
          </div>
          <div>
            <div className="soft-label">{messages.routes.userSettlement}</div>
            <div className="stat-value">{formatCurrency(preview.userSettlement)}</div>
          </div>
          <div>
            <div className="soft-label">{messages.routes.nurReward}</div>
            <div className="stat-value">
              {preview.tokenRewardAmount.toFixed(preview.tokenRewardAmount % 1 === 0 ? 0 : 2)} NUR
            </div>
          </div>
          <div>
            <div className="soft-label">{messages.routes.maturity}</div>
            <div className="stat-value">{preview.maturityLabel}</div>
          </div>
        </div>
      </GlassCard>

      <div className="table">
        {cycles.map((cycle) => (
          <GlassCard key={cycle.cycleDays} className="table-row">
            <strong>{formatDaysShort(cycle.cycleDays)}</strong>
            <span className="soft-label">
              {formatTemplate(messages.common.settlementLabel, {
                value: `${cycle.multiplier.toFixed(6)}x`,
              })}
            </span>
            <span className="soft-label">
              {formatTemplate(messages.common.probabilityLabel, {
                value: formatPercent(cycle.randomWeight),
              })}
            </span>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
