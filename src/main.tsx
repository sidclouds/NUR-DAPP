import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { I18nProvider, useI18n } from './lib/i18n'
import '@rainbow-me/rainbowkit/styles.css'
import App from './App'
import { wagmiConfig } from './lib/web3'
import './index.css'

const queryClient = new QueryClient()

function AppProviders() {
  const { rainbowLocale } = useI18n()

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale={rainbowLocale}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <AppProviders />
    </I18nProvider>
  </StrictMode>,
)
