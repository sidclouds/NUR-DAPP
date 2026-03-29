import { useCallback, useEffect, useState } from 'react'
import { FeedbackDialog, type FeedbackTone } from '../components/FeedbackDialog'
import { useAccount } from 'wagmi'
import { GlassCard } from '../components/GlassCard'
import { useDappChain } from '../hooks/useDappChain'
import { useRemoteData } from '../hooks/useRemoteData'
import { api } from '../lib/api'
import { contractAddresses, formatSettlementValue, nodeAbi, stakeAbi } from '../lib/contracts'
import { useI18n } from '../lib/i18n'
import { formatUiText, getUiText } from '../lib/uiText'

const initialData = {
  activeNodes: 0,
  nodeThreshold: 0,
  orderShare: '',
  marketShare: '',
  rights: [],
}

export function NodePage() {
  const { locale, messages, formatCurrency, formatNumber } = useI18n()
  const uiText = (key: Parameters<typeof getUiText>[1]) => getUiText(locale, key)
  const loadNodes = useCallback(() => api.getNodes(locale), [locale])
  const { data } = useRemoteData(loadNodes, initialData)
  const { address, isConnected } = useAccount()
  const { pendingLabel, readContract, writeContract, isWrongNetwork } = useDappChain()
  const [walletNodeState, setWalletNodeState] = useState({
    nodeThreshold: 0,
    accumulatedAmount: 0,
    isNode: false,
    totalNodes: 0,
    totalOrderIncome: 0,
    totalMarketIncome: 0,
  })
  const [dialog, setDialog] = useState<{ open: boolean; title: string; message: string; tone: FeedbackTone }>({
    open: false,
    title: '',
    message: '',
    tone: 'info',
  })

  function openDialog(title: string, message: string, tone: FeedbackTone = 'info') {
    setDialog({ open: true, title, message, tone })
  }

  const refreshNodeState = useCallback(async () => {
    if (!isConnected || !address) {
      setWalletNodeState({
        nodeThreshold: 0,
        accumulatedAmount: 0,
        isNode: false,
        totalNodes: 0,
        totalOrderIncome: 0,
        totalMarketIncome: 0,
      })
      return
    }

    try {
      const [settlementDecimals, nodeThreshold, accumulatedAmount, isNode, totalNodes, totalOrderIncome, totalMarketIncome] =
        await Promise.all([
          readContract<number>({
            address: contractAddresses.stake as `0x${string}`,
            abi: stakeAbi,
            functionName: 'settlementDecimals',
          }),
          readContract<bigint>({
            address: contractAddresses.node as `0x${string}`,
            abi: nodeAbi,
            functionName: 'NODE_THRESHOLD',
          }),
          readContract<bigint>({
            address: contractAddresses.stake as `0x${string}`,
            abi: stakeAbi,
            functionName: 'accin',
            args: [address],
          }),
          readContract<boolean>({
            address: contractAddresses.node as `0x${string}`,
            abi: nodeAbi,
            functionName: 'isNode',
            args: [address],
          }),
          readContract<bigint>({
            address: contractAddresses.node as `0x${string}`,
            abi: nodeAbi,
            functionName: 'totalNodes',
          }),
          readContract<bigint>({
            address: contractAddresses.node as `0x${string}`,
            abi: nodeAbi,
            functionName: 'totalOrderIncome',
          }),
          readContract<bigint>({
            address: contractAddresses.node as `0x${string}`,
            abi: nodeAbi,
            functionName: 'totalMarketIncome',
          }),
        ])

      setWalletNodeState({
        nodeThreshold: formatSettlementValue(nodeThreshold, Number(settlementDecimals)),
        accumulatedAmount: formatSettlementValue(accumulatedAmount, Number(settlementDecimals)),
        isNode,
        totalNodes: Number(totalNodes),
        totalOrderIncome: formatSettlementValue(totalOrderIncome, Number(settlementDecimals)),
        totalMarketIncome: formatSettlementValue(totalMarketIncome, Number(settlementDecimals)),
      })
    } catch (error) {
      openDialog(
        uiText('nodeStateUnavailableTitle'),
        error instanceof Error ? error.message : uiText('nodeStateUnavailableMessage'),
        'error',
      )
    }
  }, [address, isConnected, readContract])

  useEffect(() => {
    void refreshNodeState()
  }, [refreshNodeState])

  const nodeThreshold = walletNodeState.nodeThreshold || data.nodeThreshold
  const needsMoreToNode = Math.max(nodeThreshold - walletNodeState.accumulatedAmount, 0)

  async function runAction(label: string, action: () => Promise<unknown>) {
    try {
      await action()
      openDialog(uiText('actionCompletedTitle'), `${label} confirmed on-chain.`, 'success')
      await refreshNodeState()
    } catch (error) {
      openDialog(uiText('actionFailedTitle'), error instanceof Error ? error.message : `${label} failed.`, 'error')
    }
  }

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
          <button
            className="primary-button"
            type="button"
            disabled={pendingLabel === 'Apply for node'}
            onClick={() =>
              (!isConnected
                ? openDialog(uiText('walletRequiredTitle'), uiText('walletRequiredNodeMessage'), 'warning')
                : isWrongNetwork
                  ? openDialog(uiText('wrongNetworkTitle'), uiText('wrongNetworkNodeMessage'), 'warning')
                  : walletNodeState.isNode
                    ? openDialog(uiText('nodeAlreadyActiveTitle'), uiText('nodeAlreadyActiveMessage'), 'info')
                    : needsMoreToNode > 0
                      ? openDialog(
                        uiText('nodeThresholdNotReachedTitle'),
                        formatUiText(locale, 'nodeThresholdNotReachedMessage', {
                          current: formatCurrency(walletNodeState.accumulatedAmount),
                          threshold: formatCurrency(nodeThreshold),
                          remaining: formatCurrency(needsMoreToNode),
                        }),
                        'warning',
                      )
                      : runAction('Apply for node', async () => {
                        await writeContract({
                          address: contractAddresses.stake as `0x${string}`,
                          abi: stakeAbi,
                          functionName: 'becomeNode',
                          label: 'Apply for node',
                        })
                      }))
            }
          >
            {pendingLabel === 'Apply for node' ? 'Submitting...' : messages.node.applyForNode}
          </button>
          <button className="secondary-button" type="button" onClick={() => void refreshNodeState()}>
            {messages.node.viewRights}
          </button>
        </div>
        {!walletNodeState.isNode && needsMoreToNode > 0 ? (
          <div className="soft-label" style={{ marginTop: 12 }}>
            {formatUiText(locale, 'nodeThresholdNotReachedMessage', {
              current: formatCurrency(walletNodeState.accumulatedAmount),
              threshold: formatCurrency(nodeThreshold),
              remaining: formatCurrency(needsMoreToNode),
            })}
          </div>
        ) : null}
        {isWrongNetwork ? <div className="soft-label" style={{ marginTop: 12 }}>{uiText('switchPolygon')}</div> : null}
      </GlassCard>

      <div className="stats-grid">
        <GlassCard className="stat-card">
          <div className="stat-label">{uiText('walletNodeThreshold')}</div>
          <div className="stat-value">{formatCurrency(nodeThreshold)}</div>
        </GlassCard>
        <GlassCard className="stat-card">
          <div className="stat-label">{uiText('walletAccumulated')}</div>
          <div className="stat-value">{formatCurrency(walletNodeState.accumulatedAmount)}</div>
        </GlassCard>
        <GlassCard className="stat-card">
          <div className="stat-label">{uiText('remainingToNode')}</div>
          <div className="stat-value">{formatCurrency(needsMoreToNode)}</div>
        </GlassCard>
        <GlassCard className="stat-card">
          <div className="stat-label">{uiText('walletNodeStatus')}</div>
          <div className="stat-value">{walletNodeState.isNode ? uiText('active') : uiText('notYet')}</div>
        </GlassCard>
        <GlassCard className="stat-card">
          <div className="stat-label">{uiText('nodeOrderIncome')}</div>
          <div className="stat-value">{formatCurrency(walletNodeState.totalOrderIncome)}</div>
        </GlassCard>
        <GlassCard className="stat-card">
          <div className="stat-label">{uiText('nodeMarketIncome')}</div>
          <div className="stat-value">{formatCurrency(walletNodeState.totalMarketIncome)}</div>
        </GlassCard>
      </div>

      <GlassCard className="route-card">
        <div className="eyebrow">{messages.node.rights}</div>
        <ul className="muted-list">
          {data.rights.map((right: string) => (
            <li key={right}>{right}</li>
          ))}
        </ul>
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
