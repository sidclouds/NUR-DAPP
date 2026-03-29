import { useEffect, useState } from 'react'

export function useRemoteData<T>(loader: () => Promise<T>, initialValue: T) {
  const [data, setData] = useState<T>(initialValue)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)

    loader()
      .then((result) => {
        if (mounted) {
          setData(result)
        }
      })
      .catch(() => {
        // keep last known value when remote fetch fails
      })
      .finally(() => {
        if (mounted) {
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [loader])

  return { data, loading }
}
