'use client'

import SearchIcon from '@material-symbols/svg-400/outlined/search.svg'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import { useCallback, useRef } from 'react'

import { useHistory } from '../utils/useHistory'

import type { FormEvent } from 'react'

interface Props {
  defaultWord?: string
  hideIcon?: boolean
}
export const SearchBox: React.FC<Props> = ({
  defaultWord = '',
  hideIcon = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const {
    mutate: { addHistory },
  } = useHistory()
  const onSearch = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const { current } = inputRef
      if (current === null) {
        return
      }

      const word = current.value
      if (word === '') {
        return
      }

      await addHistory(word)
      router.push(`/search/${encodeURIComponent(word)}`)
    },
    [addHistory, router]
  )

  return (
    <form className={clsx('w-full', 'px-4')} onSubmit={onSearch}>
      <div
        className={clsx(
          'px-2',
          'py-1',
          'rounded-lg',
          'bg-bg-secondary',
          !hideIcon && clsx('grid', 'grid-cols-[max-content,1fr]', 'gap-2'),
          'items-center',
          'focus-within:outline-1',
          'focus-within:outline-[-webkit-focus-ring-color]',
          'focus-within:outline-auto'
        )}
      >
        {!hideIcon && (
          <SearchIcon className={clsx('square-4', 'fill-text-secondary')} />
        )}
        <input
          ref={inputRef}
          defaultValue={defaultWord}
          name='word'
          type='search'
          className={clsx(
            'w-full',
            'placeholder:text-text-secondary',
            'bg-transparent',
            'text-text-primary',
            'caret-text-primary',
            'focus:outline-none',
            'focus-visible:outline-none'
          )}
          placeholder='〇〇を検索'
        />
      </div>
    </form>
  )
}
