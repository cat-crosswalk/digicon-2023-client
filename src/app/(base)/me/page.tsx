import { clsx } from 'clsx'

import { getWorks } from '@/api/getWorks'
import { Preview } from '@/components/Preview'

import type { NextPage } from 'next'

const Me: NextPage = async () => {
  const works = await getWorks()

  return (
    <div className={clsx('flex', 'flex-col', 'items-center', 'py-4', 'gap-4')}>
      <h1
        className={clsx(
          'text-text-primary',
          'text-xl',
          'self-start',
          'px-4',
          'font-medium'
        )}
      >
        投稿したモデル
      </h1>
      <div className={clsx('grid', 'grid-cols-2', 'px-2', 'gap-2', 'w-full')}>
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
    </div>
  )
}
export default Me
