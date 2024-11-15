import ArrowBackIosNewIcon from '@material-symbols/svg-400/outlined/arrow_back_ios_new.svg'
import { clsx } from 'clsx'
import Link from 'next/link'

import { getWorks } from '@/api/getWorks'
import { Preview } from '@/components/Preview'

import { SearchBox } from '../components/SearchBox'

import type { NextPage } from 'next'

const SearchResult: NextPage<{
  params: Promise<{
    word: string
  }>
}> = async ({ params }) => {
  const { word } = await params
  const works = await getWorks()

  return (
    <div>
      <div
        className={clsx(
          'grid',
          'grid-cols-[max-content,1fr]',
          'gap-2',
          'pl-3',
          'pr-4',
          'py-4',
          'items-center'
        )}
      >
        <Link
          href='/search'
          className={clsx('square-6', 'grid', 'place-items-center')}
        >
          <ArrowBackIosNewIcon
            className={clsx('square-5', 'fill-text-primary')}
          />
        </Link>
        <SearchBox defaultWord={decodeURIComponent(word)} hideIcon />
      </div>
      <div className={clsx('grid', 'grid-cols-2', 'px-2', 'pb-4', 'gap-2')}>
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
export default SearchResult
