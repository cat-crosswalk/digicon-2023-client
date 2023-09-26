import { useCallback } from 'react'
import useSWR from 'swr'

import { dummyVideoData } from './dummy'

type Data = (typeof dummyVideoData)[number] & {
  favorite: boolean
}

export const useWorks = () => {
  const { data, mutate } = useSWR<Data[]>('/works', null, {
    fallbackData: dummyVideoData.map(video => ({
      ...video,
      favorite: false,
    })),
  })

  const toggleFavorite = useCallback(
    async (id: string, favorite: boolean) => {
      const prev = data
      if (prev === undefined) return
      await mutate(
        prev.map(video =>
          video.id === id ? { ...video, favorite } : { ...video }
        )
      )
    },
    [data, mutate]
  )

  return {
    data,
    mutate: {
      toggleFavorite,
    },
  }
}
