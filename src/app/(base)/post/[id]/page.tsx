import ArrowBackIosNewIcon from '@material-symbols/svg-400/outlined/arrow_back_ios_new.svg'
import { clsx } from 'clsx'
import Link from 'next/link'

import { InfoSection } from './components/InfoSection'
import { Relation } from './components/Relation'
import { View } from './components/View'

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
          <View id={id} />
          <Link
            href='/'
            className={clsx(
              'absolute',
              'top-4',
              'left-4',
              'w-8',
              'h-8',
              'p-1',
              'bg-bg-primary',
              'rounded-xl'
            )}
          >
            <ArrowBackIosNewIcon
              className={clsx('w-6', 'h-6', 'fill-text-primary')}
            />
          </Link>
        </div>
        <InfoSection id={id} />
        <Relation />
      </div>
    </div>
  )
}

export default Post
