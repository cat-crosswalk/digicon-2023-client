import CloseIcon from '@material-symbols/svg-400/outlined/close.svg'
import HistoryIcon from '@material-symbols/svg-400/outlined/history.svg'
import { clsx } from 'clsx'
import Link from 'next/link'
import React from 'react'

interface Props {
  text: string
  onRemove: (value: string) => void
}
export const HistoryElement: React.FC<Props> = ({ text, onRemove }) => {
  return (
    <div
      className={clsx(
        'text-text-primary',
        'grid',
        'pl-2',
        'pr-1',
        'grid-cols-[1fr,max-content]'
      )}
    >
      <Link href='/' className={clsx('flex', 'items-center', 'gap-2')}>
        <HistoryIcon className={clsx('square-4', 'fill-current')} />
        <span className={clsx('text-sm')}>{text}</span>
      </Link>
      <button
        className={clsx('square-5', 'grid', 'place-items-center')}
        onClick={() => onRemove(text)}
      >
        <CloseIcon className={clsx('square-4', 'fill-current')} />
      </button>
    </div>
  )
}

export const HistoryElementNoop: React.FC = () => {
  return <div className={clsx('h-5', 'w-full')} />
}
