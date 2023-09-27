'use client'

import CloudUploadIcon from '@material-symbols/svg-400/outlined/cloud_upload.svg'
import { clsx } from 'clsx'
import { useCallback, useState } from 'react'

import type { NextPage } from 'next'
import type { FormEvent } from 'react'

const Create: NextPage = () => {
  const [showError, setShowError] = useState(false)
  const [showErrorTimeoutId, setShowErrorTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null)
  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      setShowError(true)
      if (showErrorTimeoutId !== null) {
        clearTimeout(showErrorTimeoutId)
      }
      setShowErrorTimeoutId(
        setTimeout(() => {
          setShowError(false)
        }, 2000)
      )
    },
    [showErrorTimeoutId]
  )

  return (
    <div
      className={clsx(
        'p-4',
        'grid',
        'grid-rows-[max-content,1fr]',
        'w-full',
        'h-full',
        'gap-4',
        'relative'
      )}
    >
      <h1 className={clsx('text-xl', 'text-text-primary')}>
        モデルのアップデート
      </h1>
      <form onSubmit={onSubmit}>
        <button
          className={clsx(
            'grid',
            'place-items-center',
            'border-white',
            'rounded-lg',
            'border-opacity-50',
            'border-dashed',
            'border-2',
            'group',
            'w-full',
            'h-full',
            'focus-visible:outline-none'
          )}
        >
          <div
            className={clsx(
              'rounded',
              'grid',
              'place-items-center',
              'text-text-primary',
              'h-14',
              'w-48',
              'bg-[#1E6AB7]',
              'group-focus-visible:outline-1',
              'group-focus-visible:outline-[-webkit-focus-ring-color]',
              'group-focus-visible:outline-auto'
            )}
          >
            <div className={clsx('flex', 'gap-2', 'item-center')}>
              <CloudUploadIcon className={clsx('fill-current', 'square-6')} />
              <span>Upload</span>
            </div>
          </div>
        </button>
      </form>

      <div
        className={clsx(
          'absolute',
          'top-8',
          'left-1/2',
          '-translate-x-1/2',
          'px-8',
          'py-4',
          'rounded-lg',
          'bg-[#F26451]',
          'text-text-primary',
          'transition-all-slow',

          showError
            ? clsx('opacity-100', 'translate-y-0')
            : clsx('opacity-0', '-translate-y-8')
        )}
      >
        アップロードは現在開発中です
      </div>
    </div>
  )
}
export default Create
