import { clsx } from 'clsx'

import { getWorks } from '@/api/getWorks'
import Icon from '@/assets/icon.svg'
import { Preview } from '@/components/Preview'

import type { NextPage } from 'next'

const Home: NextPage = async () => {
  const works = await getWorks()

  return (
    <div className={clsx('flex', 'flex-col', 'items-center', 'py-8', 'gap-8')}>
      <Icon width={60} height={60} viewBox="0 0 512 512" />
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
