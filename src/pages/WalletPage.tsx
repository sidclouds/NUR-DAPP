import { useCallback, useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { FeedbackDialog, type FeedbackTone } from '../components/FeedbackDialog'
import { GlassCard } from '../components/GlassCard'
import { useDappChain } from '../hooks/useDappChain'
import { useRemoteData } from '../hooks/useRemoteData'
import { api } from '../lib/api'
import {
  contractAddresses,
  erc20Abi,
  formatSettlementValue,
  formatTokenValue,
  nodeAbi,
  stakeAbi,
  tokenAbi,
} from '../lib/contracts'
import { useI18n } from '../lib/i18n'
import { getUiText } from '../lib/uiText'
import type { WalletSnapshot } from '../types/api'

const initialData = {
  symbol: 'NUR',
  network: 'Polygon',
  totalSupply: 0,
  rewardTrigger: '',
  rewardInventory: 0,
  issuedRewards: 0,
  profitTax: 0,
  sellCooldownMinutes: 0,
  nodeThreshold: 0,
}

const initialWalletSnapshot: WalletSnapshot = {
  settlementSymbol: 'USDT',
  settlementDecimals: 6,
  settlementBalance: 0,
  nurBalance: 0,
  shareBalance: 0,
  accumulatedAmount: 0,
  currentLevel: 0,
  isNode: false,
  totalOrders: 0,
}

export function WalletPage() {
  const { locale, messages, formatCurrency, formatNumber, formatPercent } = useI18n()
  const uiText = (key: Parameters<typeof getUiText>[1]) => getUiText(locale, key)
  const { address, isConnected } = useAccount()
  const { readContract, isWrongNetwork } = useDappChain()
  const loadToken = useCallback(() => api.getToken(locale), [locale])
  const { data } = useRemoteData(loadToken, initialData)
  const [snapshot, setSnapshot] = useState(initialWalletSnapshot)
  const [dialog, setDialog] = useState<{ open: boolean; title: string; message: string; tone: FeedbackTone }>({
    open: false,
    title: '',
    message: '',
    tone: 'info',
  })

  function openDialog(title: string, message: string, tone: FeedbackTone = 'info') {
    setDialog({ open: true, title, message, tone })
  }

  useEffect(() => {
    async function loadWalletSnapshot() {
      if (!isConnected || !address) {
        setSnapshot(initialWalletSnapshot)
        return
      }

      try {
        const [settlementDecimals, settlementSymbol, settlementBalance, nurBalance, shareBalance, accumulatedAmount, currentLevel, isNode, totalOrders] =
          await Promise.all([
            readContract<number>({
              address: contractAddresses.settlementToken as `0x${string}`,
              abi: erc20Abi,
              functionName: 'decimals',
            }),
            readContract<string>({
              address: contractAddresses.settlementToken as `0x${string}`,
              abi: erc20Abi,
              functionName: 'symbol',
            }),
            readContract<bigint>({
              address: contractAddresses.settlementToken as `0x${string}`,
              abi: erc20Abi,
              functionName: 'balanceOf',
              args: [address],
            }),
            readContract<bigint>({
              address: contractAddresses.token as `0x${string}`,
              abi: tokenAbi,
              functionName: 'balanceOf',
              args: [address],
            }),
            readContract<bigint>({
              address: contractAddresses.stake as `0x${string}`,
              abi: stakeAbi,
              functionName: 'shareBalance',
              args: [address],
            }),
            readContract<bigint>({
              address: contractAddresses.stake as `0x${string}`,
              abi: stakeAbi,
              functionName: 'accin',
              args: [address],
            }),
            readContract<bigint>({
              address: contractAddresses.stake as `0x${string}`,
              abi: stakeAbi,
              functionName: 'getLevel',
              args: [address],
            }),
            readContract<boolean>({
              address: contractAddresses.node as `0x${string}`,
              abi: nodeAbi,
              functionName: 'isNode',
              args: [address],
            }),
            readContract<bigint>({
              address: contractAddresses.stake as `0x${string}`,
              abi: stakeAbi,
              functionName: 'ordersLength',
              args: [address],
            }),
          ])

        setSnapshot({
          settlementSymbol,
          settlementDecimals: Number(settlementDecimals),
          settlementBalance: formatSettlementValue(settlementBalance, Number(settlementDecimals)),
          nurBalance: formatTokenValue(nurBalance),
          shareBalance: formatSettlementValue(shareBalance, Number(settlementDecimals)),
          accumulatedAmount: formatSettlementValue(accumulatedAmount, Number(settlementDecimals)),
          currentLevel: Number(currentLevel),
          isNode,
          totalOrders: Number(totalOrders),
        })
      } catch (error) {
        openDialog(
          uiText('walletSnapshotUnavailableTitle'),
          error instanceof Error ? error.message : uiText('walletSnapshotUnavailableMessage'),
          'error',
        )
      }
    }

    void loadWalletSnapshot()
  }, [address, isConnected, readContract])

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
        {isWrongNetwork ? <div className="soft-label" style={{ marginTop: 12 }}>{uiText('switchPolygon')}</div> : null}
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
        <div className="eyebrow">{uiText('walletSnapshot')}</div>
        <div className="detail-grid" style={{ marginTop: 16 }}>
          <div>
            <div className="soft-label">{snapshot.settlementSymbol} Balance</div>
            <div className="stat-value">{formatCurrency(snapshot.settlementBalance)}</div>
          </div>
          <div>
            <div className="soft-label">NUR Balance</div>
            <div className="stat-value">{formatNumber(snapshot.nurBalance)}</div>
          </div>
          <div>
            <div className="soft-label">{uiText('activeShares')}</div>
            <div className="stat-value">{formatCurrency(snapshot.shareBalance)}</div>
          </div>
          <div>
            <div className="soft-label">{uiText('walletAccumulated')}</div>
            <div className="stat-value">{formatCurrency(snapshot.accumulatedAmount)}</div>
          </div>
          <div>
            <div className="soft-label">{uiText('currentLevel')}</div>
            <div className="stat-value">V{snapshot.currentLevel}</div>
          </div>
          <div>
            <div className="soft-label">{uiText('walletNodeStatus')}</div>
            <div className="stat-value">{snapshot.isNode ? uiText('activeNode') : uiText('notNode')}</div>
          </div>
          <div>
            <div className="soft-label">{uiText('routeOrders')}</div>
            <div className="stat-value">{formatNumber(snapshot.totalOrders)}</div>
          </div>
        </div>
      </GlassCard>

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
      <FeedbackDialog
        open={dialog.open}
        title={dialog.title}
        message={dialog.message}
        tone={dialog.tone}
        toneLabel={uiText(dialog.tone)}
        confirmLabel={uiText('ok')}
        onClose={() => setDialog((current) => ({ ...current, open: false }))}
      />
    </div>
  )
}
