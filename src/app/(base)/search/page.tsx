import { clsx } from 'clsx'

import { History } from './components/History'
import { Popular } from './components/Popular'

import type { NextPage } from 'next'

const Search: NextPage = () => {
  return (
    <div className={clsx('flex', 'flex-col', 'items-center', 'p-8', 'gap-8')}>
      <input
        className={clsx(
          'rounded-full',
          'w-full',
          'h-8',
          'bg-slate-300',
          'skeleton-orange-300'
        )}
      />
      <History />
      <Popular />
    </div>
  )
}
export default Search
