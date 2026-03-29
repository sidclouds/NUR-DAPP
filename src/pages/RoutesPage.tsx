import { useCallback, useEffect, useMemo, useState } from 'react'
import { zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { FeedbackDialog, type FeedbackTone } from '../components/FeedbackDialog'
import { GlassCard } from '../components/GlassCard'
import { useDappChain } from '../hooks/useDappChain'
import { api } from '../lib/api'
import {
  contractAddresses,
  erc20Abi,
  formatSettlementValue,
  parseSettlementValue,
  stakeAbi,
} from '../lib/contracts'
import { useI18n } from '../lib/i18n'
import { getUiText } from '../lib/uiText'
import type { ChainOrderItem, CycleItem, OrderPreview } from '../types/api'

const initialPreview: OrderPreview = {
  amountUsd: 0,
  cycleDays: 0,
  multiplier: 0,
  grossReturn: 0,
  estimatedReturn: 0,
  userSettlement: 0,
  teamPool: 0,
  nodePool: 0,
  supportPool: 0,
  tokenRewardAmount: 0,
  maturityLabel: '',
}

type RawOrderInfo = {
  isWithdrawn: boolean
  cycleDays: number
  amount: bigint
  startTime: number
  referenceBlock: number
}

export function RoutesPage() {
  const { locale, messages, formatCurrency, formatDaysShort, formatPercent, formatTemplate } = useI18n()
  const uiText = (key: Parameters<typeof getUiText>[1]) => getUiText(locale, key)
  const { address, isConnected } = useAccount()
  const { pendingLabel, readContract, writeContract, isWrongNetwork } = useDappChain()
  const [cycles, setCycles] = useState<CycleItem[]>([])
  const [amount, setAmount] = useState(200)
  const [inviter, setInviter] = useState('')
  const [preview, setPreview] = useState<OrderPreview>(initialPreview)
  const [settlementDecimals, setSettlementDecimals] = useState(6)
  const [settlementAllowance, setSettlementAllowance] = useState(0)
  const [orders, setOrders] = useState<ChainOrderItem[]>([])
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
    api.getCycles().then(setCycles)
  }, [])

  const refreshPreview = useCallback((nextAmount = amount) => {
    api.previewOrder(nextAmount, locale).then(setPreview)
  }, [amount, locale])

  const refreshOrders = useCallback(async () => {
    if (!isConnected || !address || !contractAddresses.stake || !contractAddresses.settlementToken) {
      setOrders([])
      setSettlementAllowance(0)
      return
    }

    try {
      const [decimals, allowance, totalOrders] = await Promise.all([
        readContract<number>({
          address: contractAddresses.settlementToken as `0x${string}`,
          abi: erc20Abi,
          functionName: 'decimals',
        }),
        readContract<bigint>({
          address: contractAddresses.settlementToken as `0x${string}`,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [address, contractAddresses.stake as `0x${string}`],
        }),
        readContract<bigint>({
          address: contractAddresses.stake as `0x${string}`,
          abi: stakeAbi,
          functionName: 'ordersLength',
          args: [address],
        }),
      ])

      setSettlementDecimals(Number(decimals))
      setSettlementAllowance(formatSettlementValue(allowance, Number(decimals)))

      const total = Number(totalOrders)
      const start = Math.max(0, total - 5)
      const items = await Promise.all(
        Array.from({ length: total - start }, (_, index) =>
          readContract<RawOrderInfo>({
            address: contractAddresses.stake as `0x${string}`,
            abi: stakeAbi,
            functionName: 'getOrder',
            args: [address, BigInt(start + index)],
          }),
        ),
      )

      const now = Math.floor(Date.now() / 1000)
      setOrders(
        items
          .map((order, index) => {
            const amountValue = formatSettlementValue(order.amount, Number(decimals))
            let status: ChainOrderItem['status'] = 'pending_confirm'
            if (order.isWithdrawn) {
              status = 'withdrawn'
            } else if (order.cycleDays > 0) {
              const maturityAt = Number(order.startTime) + Number(order.cycleDays) * 24 * 60 * 60
              status = maturityAt <= now ? 'matured' : 'active'
            }

            return {
              index: start + index,
              amount: amountValue,
              cycleDays: Number(order.cycleDays),
              isWithdrawn: order.isWithdrawn,
              startTime: Number(order.startTime),
              referenceBlock: Number(order.referenceBlock),
              status,
            }
          })
          .reverse(),
      )
    } catch (error) {
      openDialog(
        uiText('orderStateUnavailableTitle'),
        error instanceof Error ? error.message : uiText('orderStateUnavailableMessage'),
        'error',
      )
    }
  }, [address, isConnected, readContract])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      refreshPreview(amount)
    }, 400)

    return () => {
      window.clearTimeout(timer)
    }
  }, [amount, refreshPreview])

  useEffect(() => {
    void refreshOrders()
  }, [refreshOrders])

  const amountInUnits = useMemo(
    () => parseSettlementValue(amount || 0, settlementDecimals),
    [amount, settlementDecimals],
  )

  const needsApproval = settlementAllowance + 0.000001 < amount

  async function waitForWalletTransition() {
    await new Promise((resolve) => window.setTimeout(resolve, 400))
  }

  async function runAction(label: string, action: () => Promise<string | void>) {
    try {
      const result = await action()
      openDialog(uiText('actionCompletedTitle'), result || `${label} confirmed on-chain.`, 'success')
      await refreshOrders()
      refreshPreview()
    } catch (error) {
      openDialog(uiText('actionFailedTitle'), error instanceof Error ? error.message : `${label} failed.`, 'error')
    }
  }

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
        <div className="field">
          <label htmlFor="inviter">Inviter address (optional)</label>
          <input
            id="inviter"
            value={inviter}
            onChange={(event) => setInviter(event.target.value)}
            placeholder="0x..."
          />
        </div>
        <div className="hero-actions">
          <button
            className="primary-button"
            type="button"
            disabled={Boolean(pendingLabel)}
            style={{ width: '100%' }}
            onClick={() =>
              (!isConnected
                ? openDialog(uiText('walletRequiredTitle'), uiText('walletRequiredOrderMessage'), 'warning')
                : isWrongNetwork
                  ? openDialog(uiText('wrongNetworkTitle'), uiText('wrongNetworkOrderMessage'), 'warning')
                  : amount < 1 || amount > 1000
                    ? openDialog(uiText('invalidAmountTitle'), uiText('invalidAmountMessage'), 'warning')
                    : runAction('Submit route order', async () => {
                      if (needsApproval) {
                        await writeContract({
                          address: contractAddresses.settlementToken as `0x${string}`,
                          abi: erc20Abi,
                          functionName: 'approve',
                          args: [contractAddresses.stake as `0x${string}`, amountInUnits],
                          label: 'Prepare route order',
                        })

                        await waitForWalletTransition()

                        const refreshedAllowance = await readContract<bigint>({
                          address: contractAddresses.settlementToken as `0x${string}`,
                          abi: erc20Abi,
                          functionName: 'allowance',
                          args: [address as `0x${string}`, contractAddresses.stake as `0x${string}`],
                        })

                        const refreshedAllowanceValue = formatSettlementValue(refreshedAllowance, settlementDecimals)
                        setSettlementAllowance(refreshedAllowanceValue)

                        if (refreshedAllowanceValue + 0.000001 < amount) {
                          throw new Error(uiText('preparationStillInsufficient'))
                        }
                      }

                      await writeContract({
                        address: contractAddresses.stake as `0x${string}`,
                        abi: stakeAbi,
                        functionName: 'stakeWithInviter',
                        args: [
                          amountInUnits,
                          0n,
                          inviter && inviter.startsWith('0x') ? (inviter as `0x${string}`) : zeroAddress,
                        ],
                        label: 'Submit route order',
                      })
                    }))
            }
          >
            {pendingLabel === 'Prepare route order'
              ? 'Preparing...'
              : pendingLabel === 'Submit route order'
                ? 'Submitting...'
                : messages.routes.submitOrder}
          </button>
        </div>
        {isWrongNetwork ? <div className="soft-label" style={{ marginTop: 12 }}>{uiText('switchPolygon')}</div> : null}
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
            <div className="stat-value">{formatCurrency(preview.grossReturn)}</div>
          </div>
          <div>
            <div className="soft-label">{messages.routes.userSettlement}</div>
            <div className="stat-value">{formatCurrency(preview.userSettlement)}</div>
          </div>
          <div>
            <div className="soft-label">Team Pool</div>
            <div className="stat-value">{formatCurrency(preview.teamPool)}</div>
          </div>
          <div>
            <div className="soft-label">Node Pool</div>
            <div className="stat-value">{formatCurrency(preview.nodePool)}</div>
          </div>
          <div>
            <div className="soft-label">Support Pool</div>
            <div className="stat-value">{formatCurrency(preview.supportPool)}</div>
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

      <GlassCard className="route-card">
        <div className="eyebrow">{uiText('recentWalletOrders')}</div>
        <div className="stack" style={{ marginTop: 16 }}>
          {orders.length === 0 ? (
            <div className="soft-label">{isConnected ? uiText('noRouteOrdersForWallet') : uiText('connectWalletToReadOrders')}</div>
          ) : (
            orders.map((order) => (
              <div key={order.index} className="line-item glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <strong>#{order.index}</strong>
                  <span className="soft-label">{order.status}</span>
                </div>
                <div className="detail-grid" style={{ marginTop: 12 }}>
                  <div>
                    <div className="soft-label">{uiText('amount')}</div>
                    <div className="stat-value">{formatCurrency(order.amount)}</div>
                  </div>
                  <div>
                    <div className="soft-label">{uiText('cycle')}</div>
                    <div className="stat-value">
                      {order.cycleDays > 0 ? formatDaysShort(order.cycleDays) : uiText('pending')}
                    </div>
                  </div>
                </div>
                {order.status === 'matured' ? (
                  <div className="hero-actions">
                    <button
                      className="primary-button"
                      type="button"
                      disabled={pendingLabel === `Unstake order ${order.index}`}
                      onClick={() =>
                        runAction(`Unstake order ${order.index}`, async () => {
                          await writeContract({
                            address: contractAddresses.stake as `0x${string}`,
                            abi: stakeAbi,
                            functionName: 'unstake',
                            args: [BigInt(order.index)],
                            label: `Unstake order ${order.index}`,
                          })
                        })
                      }
                    >
                      {pendingLabel === `Unstake order ${order.index}` ? uiText('withdrawing') : uiText('withdraw')}
                    </button>
                  </div>
                ) : null}
              </div>
            ))
          )}
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
