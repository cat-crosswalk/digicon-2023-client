import { clsx } from 'clsx'
import Link from 'next/link'

import { Preview } from './components/Preview'
import { Relation } from './components/Relation'

import type { NextPage } from 'next'

const Post: NextPage<{
  params: {
    id: string
  }
}> = ({ params: { id } }) => {
  return (
    <div className={clsx('w-full')}>
      <div className={clsx('w-full')}>
        <div className={clsx('relative', 'w-full', 'aspect-[3/4]')}>
          <Preview id={id} />
          <Link
            href='/'
            className={clsx(
              'absolute',
              'top-2',
              'left-2',
              'w-8',
              'h-8',
              'rounded-full',
              'bg-slate-300',
              'skeleton-orange-300'
            )}
          />
        </div>
        <Relation />
      </div>
    </div>
  )
}

export default Post
