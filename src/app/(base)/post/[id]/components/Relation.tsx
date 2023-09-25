import { clsx } from 'clsx'
import Link from 'next/link'
import React from 'react'

export const Relation: React.FC = () => {
  return (
    <section className={clsx('mt-16')}>
      <h2
        className={clsx(
          'rounded-md',
          'w-20',
          'h-4',
          'bg-slate-300',
          'skeleton-orange-300'
        )}
      />
      <div className={clsx('mt-8', 'grid', 'grid-cols-2', 'gap-4', 'w-full')}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Link
            key={i}
            href={`/post/${i}`}
            className={clsx(
              'rounded-md',
              'w-full',
              'aspect-[3/4]',
              'bg-slate-300',
              'skeleton-orange-300'
            )}
          />
        ))}
      </div>
    </section>
  )
}
