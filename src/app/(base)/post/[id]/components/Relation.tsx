import { clsx } from 'clsx'
import React from 'react'

import { getWorks } from '@/api/getWorks'
import { Preview } from '@/components/Preview'

export const Relation: React.FC = async () => {
  const works = await getWorks()

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
        {works.map(({ id, title, thumbUrl, videoUrl }) => (
          <Preview
            key={id}
            id={id}
            title={title}
            thumbUrl={thumbUrl}
            videoUrl={videoUrl}
          />
        ))}
      </div>
    </section>
  )
}
