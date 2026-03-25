import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { polygon } from 'wagmi/chains'

export const wagmiConfig = getDefaultConfig({
  appName: 'NUR',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'nur-polygon-project-id',
  chains: [polygon],
  ssr: false,
})
