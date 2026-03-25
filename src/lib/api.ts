import type {
  CommunityResponse,
  CycleItem,
  DashboardResponse,
  NodeResponse,
  OrderPreview,
  TokenResponse,
} from '../types/api'
import { getMessages, type AppLocale } from './i18n'

const DEMO_DELAY_MS = 120

const cyclesFallback: CycleItem[] = [
  { cycleDays: 1, multiplier: 1.006, returnRate: 0.006, randomWeight: 0.05, isActive: true },
  { cycleDays: 5, multiplier: 1.030362, returnRate: 0.030362, randomWeight: 0.05, isActive: true },
  { cycleDays: 10, multiplier: 1.082942, returnRate: 0.082942, randomWeight: 0.05, isActive: true },
  { cycleDays: 15, multiplier: 1.126959, returnRate: 0.126959, randomWeight: 0.05, isActive: true },
  { cycleDays: 20, multiplier: 1.22019, returnRate: 0.22019, randomWeight: 0.05, isActive: true },
  { cycleDays: 25, multiplier: 1.282432, returnRate: 0.282432, randomWeight: 0.1, isActive: true },
  { cycleDays: 30, multiplier: 1.517535, returnRate: 0.517535, randomWeight: 0.2, isActive: true },
  { cycleDays: 40, multiplier: 1.743886, returnRate: 0.743886, randomWeight: 0.25, isActive: true },
  { cycleDays: 60, multiplier: 2.372046, returnRate: 1.372046, randomWeight: 0.2, isActive: true },
]

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function mockRequest<T>(fallback: T): Promise<T> {
  await wait(DEMO_DELAY_MS)
  return fallback
}

function pickWeightedCycle() {
  const seed = Math.random()
  let cumulative = 0

  for (const cycle of cyclesFallback) {
    cumulative += cycle.randomWeight
    if (seed <= cumulative) {
      return cycle
    }
  }

  return cyclesFallback[cyclesFallback.length - 1]
}

function buildDashboard(locale: AppLocale): DashboardResponse {
  const copy = getMessages(locale)

  return {
    hero: {
      heroTitle: copy.data.heroTitle,
      heroSubtitle: copy.data.heroSubtitle,
      heroVideoUrl: '',
      announcement: copy.data.announcement,
      faq: [copy.routes.subtitle],
    },
    stats: [
      { label: copy.common.cycleMatrix, value: copy.common.cycleMatrixValue },
      { label: copy.common.highestRoute, value: copy.common.highestRouteValue },
      { label: copy.node.nodeThreshold, value: copy.common.nodeThresholdValue },
      { label: copy.common.networkLabel, value: copy.common.networkName },
    ],
    aisRoutes: copy.data.routeNames.map((name, index) => ({
      name,
      status: copy.data.routeStatuses[index],
      progress: [52, 77, 64][index],
    })),
    featuredOrder: {
      id: 'NUR-240318-081',
      amountUsd: 800,
      routeCycleDays: 40,
      userSettlement: 1097.55,
      tokenRewardAmount: 0,
      status: copy.common.statusConfirmed,
    },
  }
}

function buildCommunity(locale: AppLocale): CommunityResponse {
  void locale

  return {
    totalMembers: 12840,
    activeAmbassadors: 926,
    totalInviteRewards: 382400,
    contributionScore: 168,
    levelProgress: 0.62,
    ambassadorTable: [
      { level: 'V1', target: 10000, ratio: '8%' },
      { level: 'V4', target: 300000, ratio: '32%' },
      { level: 'V8', target: 4800000, ratio: '64%' },
      { level: 'V12', target: 80000000, ratio: '96%' },
    ],
  }
}

function buildNode(locale: AppLocale): NodeResponse {
  const copy = getMessages(locale)

  return {
    activeNodes: 21,
    nodeThreshold: 1500,
    orderShare: copy.data.orderShare,
    marketShare: copy.data.marketShare,
    rights: copy.data.nodeRights,
  }
}

function buildToken(locale: AppLocale): TokenResponse {
  const copy = getMessages(locale)

  return {
    symbol: 'NUR',
    network: 'Polygon',
    totalSupply: 10000,
    rewardTrigger: copy.data.rewardTrigger,
    rewardInventory: 1500,
    issuedRewards: 976,
    profitTax: 0.1,
    sellCooldownMinutes: 1,
    nodeThreshold: 1500,
  }
}

function buildPreviewForLocale(amountUsd: number, locale: AppLocale): OrderPreview {
  const cycle = pickWeightedCycle()
  const estimatedReturn = Number((amountUsd * cycle.multiplier).toFixed(2))
  const profit = estimatedReturn - amountUsd
  const userSettlement = Number((amountUsd + profit / 2).toFixed(2))
  const copy = getMessages(locale)

  return {
    amountUsd,
    cycleDays: cycle.cycleDays,
    multiplier: cycle.multiplier,
    estimatedReturn,
    userSettlement,
    tokenRewardAmount: cycle.cycleDays === 60 ? Number((amountUsd / 200).toFixed(2)) : 0,
    maturityLabel: copy.common.daySettlementWindow.replace('{days}', String(cycle.cycleDays)),
  }
}

export const api = {
  getDashboard: (locale: AppLocale) => mockRequest<DashboardResponse>(buildDashboard(locale)),
  getCycles: () => mockRequest<CycleItem[]>(cyclesFallback),
  getCommunity: (locale: AppLocale) => mockRequest<CommunityResponse>(buildCommunity(locale)),
  getNodes: (locale: AppLocale) => mockRequest<NodeResponse>(buildNode(locale)),
  getToken: (locale: AppLocale) => mockRequest<TokenResponse>(buildToken(locale)),
  previewOrder: async (amountUsd: number, locale: AppLocale) =>
    mockRequest<OrderPreview>(buildPreviewForLocale(amountUsd, locale)),
}
