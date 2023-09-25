import { clsx } from 'clsx'
import Link from 'next/link'

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
        {Array.from({ length: 8 }).map((_, i) => (
          <Link
            key={i}
            href={`/post/${i}`}
            className={clsx(
              'rounded-md',
              'w-full',
              'aspect-[3/4]',
              'bg-slate-300',
              'skeleton-orange-300'
            )}
          />
        ))}
      </div>
    </div>
  )
}
export default Favorites
