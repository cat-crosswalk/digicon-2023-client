import { clsx } from 'clsx'
import Link from 'next/link'
import React from 'react'

export const History: React.FC = () => {
  return (
    <div className={clsx('grid', 'gap-4', 'w-full')}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={clsx('grid', 'grid-cols-[1fr,max-content]', 'gap-4')}
        >
          <Link
            href={`/post/${i}`}
            className={clsx('w-full', 'flex', 'items-center', 'gap-4')}
          >
            <div
              className={clsx(
                'rounded-full',
                'h-5',
                'w-5',
                'bg-slate-300',
                'skeleton-orange-300'
              )}
            />
            <div
              className={clsx(
                'rounded-md',
                'h-4',
                'w-20',
                'bg-slate-300',
                'skeleton-orange-300'
              )}
            />
          </Link>
          <div
            className={clsx(
              'rounded-full',
              'h-5',
              'w-5',
              'bg-slate-300',
              'skeleton-orange-300'
            )}
          />
        </div>
      ))}
    </div>
  )
}
