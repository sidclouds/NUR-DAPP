import { useCallback, useEffect, useState } from 'react'
import { GlassCard } from '../components/GlassCard'
import { api } from '../lib/api'
import type { CycleItem, OrderPreview } from '../types/api'

const initialPreview: OrderPreview = {
  amountUsd: 200,
  cycleDays: 30,
  multiplier: 1.517535,
  estimatedReturn: 303.51,
  userSettlement: 251.76,
  tokenRewardAmount: 0,
  maturityLabel: '30 day settlement window',
}

export function RoutesPage() {
  const [cycles, setCycles] = useState<CycleItem[]>([])
  const [amount, setAmount] = useState(200)
  const [preview, setPreview] = useState<OrderPreview>(initialPreview)

  useEffect(() => {
    api.getCycles().then(setCycles)
  }, [])

  const refreshPreview = useCallback(() => {
    api.previewOrder(amount).then(setPreview)
  }, [amount])

  useEffect(() => {
    refreshPreview()
  }, [refreshPreview])

  return (
    <div className="stack">
      <div className="page-header">
        <p className="eyebrow">Routes</p>
        <h1 className="screen-title">Route Subscription</h1>
        <p className="screen-subtitle">
          Every order enters the active NUR cycle pool first, then settles by the confirmed route window.
        </p>
      </div>

      <GlassCard className="hero-card">
        <div className="field">
          <label htmlFor="amount">Subscription Amount (1 - 1000 USDT)</label>
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
            Refresh Preview
          </button>
          <button className="secondary-button" type="button">
            Submit Order
          </button>
        </div>
      </GlassCard>

      <GlassCard className="route-card">
        <div className="eyebrow">Preview Result</div>
        <div className="detail-grid" style={{ marginTop: 16 }}>
          <div>
            <div className="soft-label">Random Cycle</div>
            <div className="stat-value">{preview.cycleDays}D</div>
          </div>
          <div>
            <div className="soft-label">Settlement Multiplier</div>
            <div className="stat-value">{preview.multiplier.toFixed(6)}x</div>
          </div>
          <div>
            <div className="soft-label">Gross Return</div>
            <div className="stat-value">${preview.estimatedReturn}</div>
          </div>
          <div>
            <div className="soft-label">User Settlement</div>
            <div className="stat-value">${preview.userSettlement}</div>
          </div>
          <div>
            <div className="soft-label">NUR Reward</div>
            <div className="stat-value">{preview.tokenRewardAmount} NUR</div>
          </div>
          <div>
            <div className="soft-label">Maturity</div>
            <div className="stat-value">{preview.maturityLabel}</div>
          </div>
        </div>
      </GlassCard>

      <div className="table">
        {cycles.map((cycle) => (
          <GlassCard key={cycle.cycleDays} className="table-row">
            <strong>{cycle.cycleDays}D</strong>
            <span className="soft-label">{cycle.multiplier.toFixed(6)}x settlement</span>
            <span className="soft-label">{(cycle.randomWeight * 100).toFixed(0)}% probability</span>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
