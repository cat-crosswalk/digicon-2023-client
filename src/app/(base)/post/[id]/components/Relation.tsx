import { clsx } from 'clsx'
import React from 'react'

import { Preview } from '@/components/Preview'
import { dummyVideoData } from '@/utils/dummy'

export const Relation: React.FC = () => {
  return (
    <section
      className={clsx('px-2', 'py-4', 'border-t-1', 'border-t-ui-primary')}
    >
      <h2
        className={clsx('px-2', 'text-text-primary', 'text-sm', 'font-medium')}
      >
        類似したポスト
      </h2>
      <div className={clsx('mt-1', 'grid', 'grid-cols-2', 'gap-2', 'w-full')}>
        {dummyVideoData.map(({ id, title, thumb, source }) => (
          <Preview
            key={id}
            id={id}
            title={title}
            imgUrl={thumb}
            videoUrl={source}
          />
        ))}
      </div>
    </section>
  )
}
