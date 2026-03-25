import type {
  CommunityResponse,
  CycleItem,
  DashboardResponse,
  NodeResponse,
  OrderPreview,
  TokenResponse,
} from '../types/api'

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

const dashboardFallback: DashboardResponse = {
  hero: {
    heroTitle: 'NUR Energy Access',
    heroSubtitle:
      'A route-based participation network built around cycle settlement, ambassador growth, node collaboration, and long-cycle NUR rewards.',
    heroVideoUrl: '',
    announcement:
      'Current access is running on Polygon. Route settlement follows the on-chain cycle matrix, while operations and content remain centrally coordinated.',
    faq: ['All route previews use the active NUR cycle matrix and current token rules.'],
  },
  stats: [
    { label: 'Cycle Matrix', value: '9 routes' },
    { label: 'Highest Route', value: '60 days' },
    { label: 'Node Threshold', value: '1,500 USDT' },
    { label: 'Network', value: 'Polygon' },
  ],
  aisRoutes: [
    { name: 'Iran -> Oman Blend', status: 'Blend preparation', progress: 52 },
    { name: 'Oman -> Yanbu Port', status: 'Maritime transfer', progress: 77 },
    { name: 'Yanbu -> Open market', status: 'Distribution window', progress: 64 },
  ],
  featuredOrder: {
    id: 'NUR-240318-081',
    amountUsd: 800,
    routeCycleDays: 40,
    userSettlement: 1097.55,
    tokenRewardAmount: 0,
    status: 'Confirmed',
  },
}

const communityFallback: CommunityResponse = {
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

const nodeFallback: NodeResponse = {
  activeNodes: 21,
  nodeThreshold: 1500,
  orderShare: '5% of route profit',
  marketShare: '50% of token market tax inflow',
  rights: [
    'Qualify after reaching 1,500 USDT accumulated participation',
    'Receive node-side flow from route settlement and token market tax',
    'Join long-term co-build governance and support allocation',
  ],
}

const tokenFallback: TokenResponse = {
  symbol: 'NUR',
  network: 'Polygon',
  totalSupply: 10000,
  rewardTrigger: '1 NUR per 200 USDT on 60-day routes',
  rewardInventory: 1500,
  issuedRewards: 976,
  profitTax: 0.1,
  sellCooldownMinutes: 1,
  nodeThreshold: 1500,
}

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

function buildPreview(amountUsd: number): OrderPreview {
  const cycle = pickWeightedCycle()
  const estimatedReturn = Number((amountUsd * cycle.multiplier).toFixed(2))
  const profit = estimatedReturn - amountUsd
  const userSettlement = Number((amountUsd + profit / 2).toFixed(2))

  return {
    amountUsd,
    cycleDays: cycle.cycleDays,
    multiplier: cycle.multiplier,
    estimatedReturn,
    userSettlement,
    tokenRewardAmount: cycle.cycleDays === 60 ? Number((amountUsd / 200).toFixed(2)) : 0,
    maturityLabel: `${cycle.cycleDays} day settlement window`,
  }
}

export const api = {
  getDashboard: () => mockRequest<DashboardResponse>(dashboardFallback),
  getCycles: () => mockRequest<CycleItem[]>(cyclesFallback),
  getCommunity: () => mockRequest<CommunityResponse>(communityFallback),
  getNodes: () => mockRequest<NodeResponse>(nodeFallback),
  getToken: () => mockRequest<TokenResponse>(tokenFallback),
  previewOrder: async (amountUsd: number) => mockRequest<OrderPreview>(buildPreview(amountUsd)),
}
