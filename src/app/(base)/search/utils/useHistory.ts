import { useCallback } from 'react'
import useSWR from 'swr'

const HISTORY_MAX = 9

const dummyHistory = [
  'forest',
  'forest tree',
  'mech big robot',
  'mech big robot fight',
  'rabbit',
]

export const useHistory = () => {
  const { data, mutate } = useSWR<string[]>('/history', null, {
    fallbackData: dummyHistory,
  })

  const addHistory = useCallback(
    async (keyword: string) => {
      const prev = data
      if (prev === undefined) return
      const next = [keyword, ...prev.filter(v => v !== keyword)].slice(
        0,
        HISTORY_MAX
      )
      await mutate(next)
    },
    [data, mutate]
  )

  const removeHistory = useCallback(
    async (keyword: string) => {
      const prev = data
      if (prev === undefined) return
      const next = prev.filter(v => v !== keyword)
      await mutate(next)
    },
    [data, mutate]
  )

  return {
    data,
    mutate: {
      addHistory,
      removeHistory,
    },
  }
}
