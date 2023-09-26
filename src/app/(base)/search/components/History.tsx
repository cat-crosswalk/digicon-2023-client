'use client'

import { clsx } from 'clsx'
import React from 'react'

import { useHistory } from '../utils/useHistory'

import { HistoryElement, HistoryElementNoop } from './HistoryElement'

export const History: React.FC = () => {
  const {
    data,
    mutate: { removeHistory },
  } = useHistory()

  if (data === undefined) {
    return null
  }

  return (
    <div className={clsx('grid', 'gap-4', 'w-full')}>
      {data.map(text => (
        <HistoryElement key={text} text={text} onRemove={removeHistory} />
      ))}
      {Array.from({ length: 9 - data.length }).map((_, i) => (
        <HistoryElementNoop key={i} />
      ))}
    </div>
  )
}
