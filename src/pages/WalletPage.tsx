import { useCallback } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { GlassCard } from '../components/GlassCard'
import { useRemoteData } from '../hooks/useRemoteData'
import { api } from '../lib/api'
import { useI18n } from '../lib/i18n'

const initialData = {
  symbol: 'NUR',
  network: 'Polygon',
  totalSupply: 10000,
  rewardTrigger: '',
  rewardInventory: 0,
  issuedRewards: 0,
  profitTax: 0,
  sellCooldownMinutes: 0,
  nodeThreshold: 1500,
}

export function WalletPage() {
  const { locale, messages, formatCurrency, formatNumber, formatPercent } = useI18n()
  const { address, isConnected } = useAccount()
  const loadToken = useCallback(() => api.getToken(locale), [locale])
  const { data } = useRemoteData(loadToken, initialData)

  return (
    <div className="stack">
      <div className="page-header">
        <p className="eyebrow">{messages.wallet.eyebrow}</p>
        <h1 className="screen-title">{messages.wallet.title}</h1>
        <p className="screen-subtitle">{messages.wallet.subtitle}</p>
      </div>

      <GlassCard className="hero-card">
        <ConnectButton />
        <div style={{ marginTop: 18 }} className="soft-label">
          {isConnected ? `${messages.common.connectedWallet}: ${address}` : messages.common.connectWalletPrompt}
        </div>
      </GlassCard>

      <div className="stats-grid">
        <GlassCard className="wallet-item">
          <div className="soft-label">{messages.wallet.network}</div>
          <div className="stat-value">{data.network}</div>
        </GlassCard>
        <GlassCard className="wallet-item">
          <div className="soft-label">{messages.wallet.totalSupply}</div>
          <div className="stat-value">{formatNumber(data.totalSupply)}</div>
        </GlassCard>
        <GlassCard className="wallet-item">
          <div className="soft-label">{messages.wallet.sellProfitTax}</div>
          <div className="stat-value">{formatPercent(data.profitTax)}</div>
        </GlassCard>
        <GlassCard className="wallet-item">
          <div className="soft-label">{messages.wallet.sellCooldown}</div>
          <div className="stat-value">
            {formatNumber(data.sellCooldownMinutes)} {messages.common.minutesShort}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="route-card">
        <div className="eyebrow">{messages.wallet.tokenRules}</div>
        <div className="detail-grid" style={{ marginTop: 16 }}>
          <div>
            <div className="soft-label">{messages.wallet.rewardTrigger}</div>
            <div className="stat-value">{data.rewardTrigger}</div>
          </div>
          <div>
            <div className="soft-label">{messages.wallet.rewardInventory}</div>
            <div className="stat-value">{formatNumber(data.rewardInventory)}</div>
          </div>
          <div>
            <div className="soft-label">{messages.wallet.issuedRewards}</div>
            <div className="stat-value">{formatNumber(data.issuedRewards)}</div>
          </div>
          <div>
            <div className="soft-label">{messages.wallet.nodeThreshold}</div>
            <div className="stat-value">{formatCurrency(data.nodeThreshold)}</div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
