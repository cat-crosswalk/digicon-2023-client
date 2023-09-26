import ArrowBackIosNewIcon from '@material-symbols/svg-400/outlined/arrow_back_ios_new.svg'
import { clsx } from 'clsx'
import Link from 'next/link'

import { InfoSection } from './components/InfoSection'
import { Relation } from './components/Relation'
import { View } from './components/View'

import type { NextPage } from 'next'

const dummySplatSrc =
  'https://cdn-lfs.huggingface.co/repos/e3/a1/e3a1d55b73fa4bbb6730620e8accf49874d11bb2710182ce5349b7262aa07abf/d371f544e9e6a0a10b4a9d75c48d66f3c47f484559c33883c33c97ad7d2aa6af?response-content-disposition=attachment%3B+filename*%3DUTF-8%27%27train.splat%3B+filename%3D%22train.splat%22%3B&Expires=1695986541&Policy=eyJTdGF0ZW1lbnQiOlt7IkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTY5NTk4NjU0MX19LCJSZXNvdXJjZSI6Imh0dHBzOi8vY2RuLWxmcy5odWdnaW5nZmFjZS5jby9yZXBvcy9lMy9hMS9lM2ExZDU1YjczZmE0YmJiNjczMDYyMGU4YWNjZjQ5ODc0ZDExYmIyNzEwMTgyY2U1MzQ5YjcyNjJhYTA3YWJmL2QzNzFmNTQ0ZTllNmEwYTEwYjRhOWQ3NWM0OGQ2NmYzYzQ3ZjQ4NDU1OWMzMzg4M2MzM2M5N2FkN2QyYWE2YWY%7EcmVzcG9uc2UtY29udGVudC1kaXNwb3NpdGlvbj0qIn1dfQ__&Signature=jRzKV5gZOp3jWadRQOQ1AkVH%7EWEOF9Jl3Z0ZRjj4IL0DT-aTV6jsAtXEG3YrCPPXOOdLkg-zFKrPJJKm8OqKlQDds4oSsJhVp6Y-iO1C6AN5AkUrlSSF%7EoEap5j79MJy5yvZS%7EuCqloTO6a1D7zMyRAsunvYT6I-yqCDQxRsjulvyGVbrBIsaUG7pSIJHXb2%7EOdgTnkwcsfhDmgmkren124fSmWeOhzvou6lAE3ZB0mrnrLixFN2asRaAdynKNy0M4V1NYhWjDvVOiBJ37dRXxqr%7EG-pQdSmGB3fCXcI5YmavcjIgdO9qoKDh2l0sld99Ka%7EYXDyTOZHMG9-uAvg9g__&Key-Pair-Id=KVTP0A1DKRTAX'

const Post: NextPage<{
  params: {
    id: string
  }
}> = ({ params: { id } }) => {
  return (
    <div className={clsx('w-full')}>
      <div className={clsx('w-full')}>
        <div className={clsx('relative', 'w-full', 'aspect-[3/4]')}>
          <View id={id} splatSrc={dummySplatSrc} />
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
