'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

import { toggleFavorite } from '@/api/getFavorites'

import { Info } from './Info'

interface Props {
  id: string
}
export const InfoSection: React.FC<Props> = ({ id }) => {
  const router = useRouter()

  const onFavorite = useCallback(
    async (id: string, isFavorite: boolean) => {
      await toggleFavorite(id, isFavorite)
      router.refresh()
    },
    [router]
  )

  return <Info id={id} onFavorite={onFavorite} />
}
