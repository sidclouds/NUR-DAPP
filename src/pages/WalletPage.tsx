import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { GlassCard } from '../components/GlassCard'
import { useRemoteData } from '../hooks/useRemoteData'
import { api } from '../lib/api'

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
  const { address, isConnected } = useAccount()
  const { data } = useRemoteData(api.getToken, initialData)

  return (
    <div className="stack">
      <div className="page-header">
        <p className="eyebrow">Vault</p>
        <h1 className="screen-title">Wallet & Token</h1>
        <p className="screen-subtitle">
          NUR runs on Polygon and powers 60-day rewards, market profit tax routing, and node-side value flow.
        </p>
      </div>

      <GlassCard className="hero-card">
        <ConnectButton />
        <div style={{ marginTop: 18 }} className="soft-label">
          {isConnected ? `Connected wallet: ${address}` : 'Connect your wallet to access the Polygon NUR vault.'}
        </div>
      </GlassCard>

      <div className="stats-grid">
        <GlassCard className="wallet-item">
          <div className="soft-label">Network</div>
          <div className="stat-value">{data.network}</div>
        </GlassCard>
        <GlassCard className="wallet-item">
          <div className="soft-label">Total Supply</div>
          <div className="stat-value">{data.totalSupply}</div>
        </GlassCard>
        <GlassCard className="wallet-item">
          <div className="soft-label">Sell Profit Tax</div>
          <div className="stat-value">{data.profitTax * 100}%</div>
        </GlassCard>
        <GlassCard className="wallet-item">
          <div className="soft-label">Sell Cooldown</div>
          <div className="stat-value">{data.sellCooldownMinutes} min</div>
        </GlassCard>
      </div>

      <GlassCard className="route-card">
        <div className="eyebrow">Token Rules</div>
        <div className="detail-grid" style={{ marginTop: 16 }}>
          <div>
            <div className="soft-label">Reward Trigger</div>
            <div className="stat-value">{data.rewardTrigger}</div>
          </div>
          <div>
            <div className="soft-label">Reward Inventory</div>
            <div className="stat-value">{data.rewardInventory}</div>
          </div>
          <div>
            <div className="soft-label">Issued Rewards</div>
            <div className="stat-value">{data.issuedRewards}</div>
          </div>
          <div>
            <div className="soft-label">Node Threshold</div>
            <div className="stat-value">${data.nodeThreshold}</div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
