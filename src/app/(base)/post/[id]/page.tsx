import ArrowBackIosNewIcon from '@material-symbols/svg-400/outlined/arrow_back_ios_new.svg'
import { clsx } from 'clsx'
import Link from 'next/link'

import { getWork } from '@/api/getWork'

import { InfoSection } from './components/InfoSection'
import { Relation } from './components/Relation'
import { View } from './components/View'
import { buttonStyle } from './styles/buttonStyle'

import type { Metadata, NextPage, ResolvingMetadata } from 'next'

export async function generateMetadata(
  { params: { id } }: { params: { id: string } },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const work = await getWork(id)

  return {
    title: work.title,
    description: work.description,
    openGraph: {
      title: work.title,
      description: work.description,
      images: [
        {
          url: work.thumbUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}

const Post: NextPage<{
  params: {
    id: string
  }
}> = async ({ params: { id } }) => {
  const work = await getWork(id)

  return (
    <div className={clsx('w-full')}>
      <div className={clsx('w-full')}>
        <div className={clsx('relative', 'w-full', 'aspect-[3/4]')}>
          <View id={id} modelUrl={work.modelUrl} />
          <Link
            href='/'
            className={clsx('absolute', 'top-4', 'left-4', buttonStyle)}
          >
            <ArrowBackIosNewIcon
              className={clsx('square-5', 'fill-text-primary')}
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
