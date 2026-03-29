import type {
  CommunityResponse,
  CycleItem,
  DashboardResponse,
  NodeResponse,
  OrderPreview,
  TokenResponse,
} from '../types/api'
import { getMessages, type AppLocale } from './i18n'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'
const cache = new Map<string, { expiresAt: number; value?: unknown; promise?: Promise<unknown> }>()

type ApiEnvelope<T> = {
  success: boolean
  data: T
  message?: string
}

function getCached<T>(key: string, ttlMs: number, loader: () => Promise<T>) {
  const now = Date.now()
  const existing = cache.get(key)

  if (existing?.value !== undefined && now < existing.expiresAt) {
    return Promise.resolve(existing.value as T)
  }

  if (existing?.promise) {
    return existing.promise as Promise<T>
  }

  const promise = loader()
    .then((value) => {
      cache.set(key, { value, expiresAt: Date.now() + ttlMs })
      return value
    })
    .catch((error) => {
      cache.delete(key)
      throw error
    })

  cache.set(key, { expiresAt: now + ttlMs, promise })
  return promise
}

async function request<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  })

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || `Request failed with ${response.status}`)
  }

  return payload.data
}

function mapDashboardResponse(payload: any, locale: AppLocale): DashboardResponse {
  const copy = getMessages(locale)

  return {
    hero: payload.hero,
    stats: payload.stats,
    execution: payload.execution ?? [],
    featuredOrder: {
      id: payload.featuredOrder?.id || `NUR-${payload.featuredOrder?.userId || 'route'}`,
      amountUsd: payload.featuredOrder?.amountUsd || 0,
      routeCycleDays: payload.featuredOrder?.cycleDays || 0,
      userSettlement: payload.featuredOrder?.userTake || 0,
      tokenRewardAmount: payload.featuredOrder?.tokenRewardAmount || 0,
      status: payload.featuredOrder?.status || copy.common.statusConfirmed,
    },
  }
}

function mapCyclesResponse(payload: any[]): CycleItem[] {
  return payload.map((cycle) => ({
    cycleDays: cycle.cycleDays,
    multiplier: cycle.multiplier,
    rateLabel: cycle.rateLabel,
    returnRate: cycle.returnRate ?? Math.max(cycle.multiplier - 1, 0),
    randomWeight: cycle.randomWeight,
    isActive: cycle.isActive,
  }))
}

function mapCommunityResponse(payload: any): CommunityResponse {
  return {
    totalMembers: payload.totalMembers,
    directMembers: payload.directMembers,
    activeAmbassadors: payload.directMembers ?? 0,
    totalInviteRewards: payload.teamVolume ?? 0,
    contributionScore: payload.accIn ?? 0,
    levelProgress: payload.currentLevel ? Math.min(payload.currentLevel / 12, 1) : 0,
    ambassadorTable: payload.levelTable ?? [],
  }
}

function mapNodeResponse(payload: any): NodeResponse {
  return {
    activeNodes: payload.activeNodes,
    nodePrice: payload.nodePrice,
    nodeThreshold: payload.nodeThreshold,
    orderShare: payload.orderShare ?? payload.payoutSources?.[0] ?? '',
    marketShare: payload.marketShare ?? payload.payoutSources?.[1] ?? '',
    payoutSources: payload.payoutSources,
    rights: payload.rights ?? [],
  }
}

function mapTokenResponse(payload: any): TokenResponse {
  return {
    symbol: payload.symbol,
    network: 'Polygon',
    totalSupply: payload.totalSupply,
    rewardTrigger: payload.rewardTrigger ?? `1 NUR / ${payload.rewardTokenRate ?? 200} settlement`,
    rewardInventory: payload.rewardInventory,
    issuedRewards: payload.issuedRewards ?? 0,
    profitTax: payload.sellProfitTax,
    sellCooldownMinutes: payload.sellCooldownMinutes,
    nodeThreshold: payload.nodeThreshold,
    rewardTokenRate: payload.rewardTokenRate,
    swapAtAmount: payload.swapAtAmount,
    rewardSource: payload.rewardSource,
    contractAddresses: payload.contractAddresses,
  }
}

function mapPreviewResponse(payload: any): OrderPreview {
  return {
    amountUsd: payload.amountUsd,
    cycleDays: payload.cycleDays,
    multiplier: payload.multiplier,
    grossReturn: payload.grossReturn,
    estimatedReturn: payload.grossReturn,
    userSettlement: payload.userTake,
    teamPool: payload.teamPool,
    nodePool: payload.nodePool,
    supportPool: payload.supportPool,
    tokenRewardAmount: payload.tokenRewardAmount,
    maturityLabel: payload.maturityLabel,
  }
}

export const api = {
  getDashboard: async (locale: AppLocale) =>
    mapDashboardResponse(await getCached('public:dashboard', 15000, () => request('/public/dashboard')), locale),
  getCycles: async () => mapCyclesResponse(await getCached('public:cycles', 60000, () => request('/public/cycles'))),
  getCommunity: async (_locale: AppLocale) =>
    mapCommunityResponse(await getCached('public:community', 15000, () => request('/public/community'))),
  getNodes: async (_locale: AppLocale) =>
    mapNodeResponse(await getCached('public:nodes', 15000, () => request('/public/nodes'))),
  getToken: async (_locale: AppLocale) =>
    mapTokenResponse(await getCached('public:token', 15000, () => request('/public/token'))),
  previewOrder: async (amountUsd: number, _locale: AppLocale) =>
    mapPreviewResponse(
      await getCached(`public:preview:${amountUsd}`, 5000, () =>
        request('/public/orders/preview', {
          method: 'POST',
          body: JSON.stringify({ amountUsd }),
        }),
      ),
    ),
}
