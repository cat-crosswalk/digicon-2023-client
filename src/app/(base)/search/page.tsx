import { clsx } from 'clsx'

import { History } from './components/History'
import { Popular } from './components/Popular'
import { SearchBox } from './components/SearchBox'

import type { NextPage } from 'next'

const Search: NextPage = () => {
  return (
    <div className={clsx('flex', 'flex-col', 'items-center', 'py-4', 'gap-4')}>
      <SearchBox />
      <History />
      <Popular />
    </div>
  )
}
export default Search
