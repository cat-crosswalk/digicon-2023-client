import { clsx } from 'clsx'

import { Preview } from '@/components/Preview'
import { dummyVideoData } from '@/utils/dummy'

import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div className={clsx('flex', 'flex-col', 'items-center', 'py-8', 'gap-8')}>
      <div
        className={clsx(
          'rounded-full',
          'w-10',
          'h-10',
          'bg-slate-300',
          'skeleton-orange-300'
        )}
      />
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
export default Home
