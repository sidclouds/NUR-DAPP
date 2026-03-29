export interface DashboardResponse {
  hero: {
    heroTitle: string
    heroSubtitle: string
    heroVideoUrl: string
    announcement: string
    faq: string[]
  }
  stats: Array<{ label: string; value: string }>
  execution: Array<{ title: string; detail: string }>
  featuredOrder: {
    id: string
    amountUsd: number
    routeCycleDays: number
    userSettlement: number
    tokenRewardAmount: number
    status: string
  }
}

export interface CycleItem {
  cycleDays: number
  multiplier: number
  rateLabel?: string
  returnRate?: number
  randomWeight: number
  isActive: boolean
}

export interface OrderPreview {
  amountUsd: number
  cycleDays: number
  multiplier: number
  grossReturn: number
  estimatedReturn: number
  userSettlement: number
  teamPool: number
  nodePool: number
  supportPool: number
  tokenRewardAmount: number
  maturityLabel: string
}

export interface CommunityResponse {
  totalMembers: number
  directMembers?: number
  activeAmbassadors: number
  totalInviteRewards: number
  contributionScore: number
  levelProgress: number
  ambassadorTable: Array<{ level: string; target: number; ratio: string }>
}

export interface NodeResponse {
  activeNodes: number
  nodePrice?: number
  nodeThreshold: number
  orderShare: string
  marketShare: string
  payoutSources?: string[]
  rights: string[]
}

export interface TokenResponse {
  symbol: string
  network: string
  totalSupply: number
  rewardTrigger: string
  rewardInventory: number
  issuedRewards: number
  profitTax: number
  sellCooldownMinutes: number
  nodeThreshold: number
  rewardTokenRate?: number
  swapAtAmount?: number
  rewardSource?: string
  contractAddresses?: {
    token?: string
    stake?: string
    node?: string
  }
}

export interface WalletSnapshot {
  settlementSymbol: string
  settlementDecimals: number
  settlementBalance: number
  nurBalance: number
  shareBalance: number
  accumulatedAmount: number
  currentLevel: number
  isNode: boolean
  totalOrders: number
}

export interface ChainOrderItem {
  index: number
  amount: number
  cycleDays: number
  isWithdrawn: boolean
  startTime: number
  referenceBlock: number
  status: 'pending_confirm' | 'active' | 'matured' | 'withdrawn'
}
