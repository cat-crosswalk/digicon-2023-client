import { clsx } from 'clsx'

import { Preview } from '@/components/Preview'
import { dummyVideoData } from '@/utils/dummy'

import type { NextPage } from 'next'

const Favorites: NextPage = () => {
  return (
    <div className={clsx('flex', 'flex-col', 'items-center', 'p-8', 'gap-8')}>
      <div
        className={clsx(
          'self-start',
          'rounded-4',
          'w-20',
          'h-5',
          'bg-slate-300',
          'skeleton-orange-300'
        )}
      />
      <div className={clsx('grid', 'grid-cols-2', 'gap-4', 'w-full')}>
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
