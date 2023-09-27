import { clsx } from 'clsx'

import { getWorks } from '@/api/getWorks'
import { Preview } from '@/components/Preview'

import type { NextPage } from 'next'

const Home: NextPage = async () => {
  const works = await getWorks()

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
      <div
        className={clsx(
          'grid',
          'grid-cols-2',
          'px-2',
          'gap-2',
          'w-full',
          'auto-rows-max'
        )}
      >
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
export default Home
