'use client'

import dayjs from 'dayjs'
import { useMemo } from 'react'

import { useWorks } from '@/utils/useWorks'

import { Info } from './Info'

interface Props {
  id: string
}
export const InfoSection: React.FC<Props> = ({ id }) => {
  const {
    data,
    mutate: { toggleFavorite },
  } = useWorks()

  const work = useMemo(() => {
    return data?.find(work => work.id === id)
  }, [data, id])

  const date = useMemo(() => {
    return dayjs('2023/9/26')
  }, [])

  const tags = useMemo(() => {
    return ['tree', 'mountains', 'sunlight', 'forest', 'nature', 'landscape']
  }, [])

  if (work === undefined) {
    return '404'
  }

  return (
    <Info
      id={id}
      description={work.description}
      place='Tokyo, JAPAN'
      title={work.title}
      uploadDate={date}
      tags={tags}
      isFavorite={work.favorite}
      onFavorite={toggleFavorite}
    />
  )
}
