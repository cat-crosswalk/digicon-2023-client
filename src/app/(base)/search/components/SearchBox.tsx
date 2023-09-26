import SearchIcon from '@material-symbols/svg-400/outlined/search.svg'
import { clsx } from 'clsx'

export const SearchBox: React.FC = () => {
  return (
    <div className={clsx('w-full', 'px-4')}>
      <div
        className={clsx(
          'px-2',
          'py-1',
          'rounded-lg',
          'bg-bg-secondary',
          'grid',
          'grid-cols-[max-content,1fr]',
          'items-center',
          'gap-2',
          'focus-within:outline-1',
          'focus-within:outline-[-webkit-focus-ring-color]',
          'focus-within:outline-auto'
        )}
      >
        <SearchIcon className={clsx('square-4', 'fill-text-secondary')} />
        <input
          className={clsx(
            'placeholder:text-text-secondary',
            'bg-transparent',
            'focus:outline-none',
            'focus-visible:outline-none'
          )}
          placeholder='〇〇を検索'
        />
      </div>
    </div>
  )
}
