export interface DashboardResponse {
  hero: {
    heroTitle: string
    heroSubtitle: string
    heroVideoUrl: string
    announcement: string
    faq: string[]
  }
  stats: Array<{ label: string; value: string }>
  aisRoutes: Array<{ name: string; status: string; progress: number }>
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
  returnRate: number
  randomWeight: number
  isActive: boolean
}

export interface OrderPreview {
  amountUsd: number
  cycleDays: number
  multiplier: number
  estimatedReturn: number
  userSettlement: number
  tokenRewardAmount: number
  maturityLabel: string
}

export interface CommunityResponse {
  totalMembers: number
  activeAmbassadors: number
  totalInviteRewards: number
  contributionScore: number
  levelProgress: number
  ambassadorTable: Array<{ level: string; target: number; ratio: string }>
}

export interface NodeResponse {
  activeNodes: number
  nodeThreshold: number
  orderShare: string
  marketShare: string
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
}
