import { formatUnits, parseUnits } from 'viem'

export const polygonChainId = 137

export const contractAddresses = {
  token: import.meta.env.VITE_NUR_TOKEN_ADDRESS || '',
  stake: import.meta.env.VITE_NUR_STAKE_ADDRESS || '',
  node: import.meta.env.VITE_NUR_NODE_ADDRESS || '',
  settlementToken: import.meta.env.VITE_SETTLEMENT_TOKEN_ADDRESS || '',
}

export const erc20Abi = [
  { type: 'function', name: 'balanceOf', stateMutability: 'view', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }] },
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [{ type: 'address' }, { type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'address' }, { type: 'uint256' }],
    outputs: [{ type: 'bool' }],
  },
  { type: 'function', name: 'decimals', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
  { type: 'function', name: 'symbol', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
] as const

export const tokenAbi = [
  { type: 'function', name: 'totalSupply', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'balanceOf', stateMutability: 'view', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'tradeStartAt', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'swapAtAmount', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
] as const

export const stakeAbi = [
  { type: 'function', name: 'rewardTokenRate', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'settlementToken', stateMutability: 'view', inputs: [], outputs: [{ type: 'address' }] },
  { type: 'function', name: 'settlementDecimals', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
  { type: 'function', name: 'settlementUnit', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'closeIn', stateMutability: 'view', inputs: [], outputs: [{ type: 'bool' }] },
  { type: 'function', name: 'closeOut', stateMutability: 'view', inputs: [], outputs: [{ type: 'bool' }] },
  { type: 'function', name: 'shareBalance', stateMutability: 'view', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'accin', stateMutability: 'view', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'getLevel', stateMutability: 'view', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'ordersLength', stateMutability: 'view', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }] },
  {
    type: 'function',
    name: 'getOrder',
    stateMutability: 'view',
    inputs: [{ type: 'address' }, { type: 'uint256' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'isWithdrawn', type: 'bool' },
          { name: 'cycleDays', type: 'uint8' },
          { name: 'amount', type: 'uint80' },
          { name: 'startTime', type: 'uint32' },
          { name: 'referenceBlock', type: 'uint48' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'stakeWithInviter',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'uint256' }, { type: 'uint256' }, { type: 'address' }],
    outputs: [],
  },
  { type: 'function', name: 'becomeNode', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { type: 'function', name: 'unstake', stateMutability: 'nonpayable', inputs: [{ type: 'uint256' }], outputs: [] },
] as const

export const nodeAbi = [
  { type: 'function', name: 'NODE_THRESHOLD', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'isNode', stateMutability: 'view', inputs: [{ type: 'address' }], outputs: [{ type: 'bool' }] },
  { type: 'function', name: 'totalNodes', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'totalOrderIncome', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'totalMarketIncome', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
] as const

export function hasConfiguredContracts() {
  return Boolean(
    contractAddresses.token &&
      contractAddresses.stake &&
      contractAddresses.node &&
      contractAddresses.settlementToken,
  )
}

export function parseSettlementValue(value: string | number, decimals: number) {
  return parseUnits(String(value || 0), decimals)
}

export function formatSettlementValue(value: bigint, decimals: number) {
  return Number(formatUnits(value, decimals))
}

export function formatTokenValue(value: bigint, decimals = 18) {
  return Number(formatUnits(value, decimals))
}
