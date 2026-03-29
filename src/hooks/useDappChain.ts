import { useCallback, useRef, useState } from 'react'
import type { Address } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { polygon } from 'wagmi/chains'

const READ_CACHE_TTL_MS = 10000

function buildReadCacheKey(address: Address, functionName: string, args?: readonly unknown[]) {
  const normalizedArgs = (args ?? []).map((item) => {
    if (typeof item === 'bigint') return item.toString()
    if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') return String(item)
    if (item == null) return ''
    return JSON.stringify(item)
  })

  return `${address}:${functionName}:${normalizedArgs.join('|')}`
}

export function useDappChain() {
  const { address, isConnected, chain } = useAccount()
  const publicClient = usePublicClient({ chainId: polygon.id })
  const { data: walletClient } = useWalletClient({ chainId: polygon.id })
  const [pendingLabel, setPendingLabel] = useState('')
  const readCacheRef = useRef(new Map<string, { expiresAt: number; value?: unknown; promise?: Promise<unknown> }>())

  const isWrongNetwork = isConnected && chain?.id !== polygon.id

  const writeContract = useCallback(async (config: {
    address: Address
    abi: readonly unknown[]
    functionName: string
    args?: readonly unknown[]
    label: string
  }) => {
    if (!walletClient || !publicClient) {
      throw new Error('Please connect a Polygon wallet first.')
    }

    setPendingLabel(config.label)
    try {
      const estimatedGas = await publicClient.estimateContractGas({
        account: walletClient.account.address,
        address: config.address,
        abi: config.abi,
        functionName: config.functionName,
        args: config.args,
      })

      const latestBlock = await publicClient.getBlock()
      const blockGasLimit = latestBlock.gasLimit
      const bufferedGas = (estimatedGas * 12n) / 10n
      const safeBlockCap = blockGasLimit > 100000n ? blockGasLimit - 100000n : blockGasLimit
      const gas = bufferedGas < safeBlockCap ? bufferedGas : safeBlockCap

      const hash = await walletClient.writeContract({
        chain: polygon,
        account: walletClient.account,
        address: config.address,
        abi: config.abi,
        functionName: config.functionName,
        args: config.args,
        gas,
      })

      await publicClient.waitForTransactionReceipt({ hash })
      readCacheRef.current.clear()
      return hash
    } finally {
      setPendingLabel('')
    }
  }, [publicClient, walletClient])

  const signMessage = useCallback(async (config: {
    message: string
    label: string
  }) => {
    if (!walletClient) {
      throw new Error('Please connect a Polygon wallet first.')
    }

    setPendingLabel(config.label)
    try {
      return await walletClient.signMessage({
        account: walletClient.account,
        message: config.message,
      })
    } finally {
      setPendingLabel('')
    }
  }, [walletClient])

  const readContract = useCallback(async <T,>(config: {
    address: Address
    abi: readonly unknown[]
    functionName: string
    args?: readonly unknown[]
  }) => {
    if (!publicClient) {
      throw new Error('Polygon public client is unavailable.')
    }

    const key = buildReadCacheKey(config.address, config.functionName, config.args)
    const now = Date.now()
    const existing = readCacheRef.current.get(key)

    if (existing?.value !== undefined && now < existing.expiresAt) {
      return existing.value as T
    }

    if (existing?.promise) {
      return existing.promise as Promise<T>
    }

    const promise = publicClient.readContract(config)
      .then((value) => {
        readCacheRef.current.set(key, {
          value,
          expiresAt: Date.now() + READ_CACHE_TTL_MS,
        })
        return value as T
      })
      .catch((error) => {
        readCacheRef.current.delete(key)
        throw error
      })

    readCacheRef.current.set(key, {
      expiresAt: now + READ_CACHE_TTL_MS,
      promise,
    })

    return promise as Promise<T>
  }, [publicClient])

  return {
    address,
    chain,
    isConnected,
    isWrongNetwork,
    publicClient,
    walletClient,
    pendingLabel,
    readContract,
    signMessage,
    writeContract,
  }
}
