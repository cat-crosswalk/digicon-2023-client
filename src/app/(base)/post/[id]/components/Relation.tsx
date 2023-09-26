import { clsx } from 'clsx'
import React from 'react'

import { Preview } from '@/components/Preview'
import { dummyVideoData } from '@/utils/dummy'

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
        {dummyVideoData.map(({ title, thumb, source }, i) => (
          <Preview
            key={i}
            id={i.toString()}
            title={title}
            imgUrl={thumb}
            videoUrl={source}
          />
        ))}
      </div>
    </section>
  )
}
