import { clsx } from 'clsx'

import { Preview } from '@/components/Preview'
import { dummyVideoData } from '@/utils/dummy'

import type { NextPage } from 'next'

const Favorites: NextPage = () => {
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
        いいねしたモデル
      </h1>
      <div className={clsx('grid', 'grid-cols-2', 'px-2', 'gap-2', 'w-full')}>
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
    </div>
  )
}
export default Favorites
