import CloudUploadIcon from '@material-symbols/svg-400/outlined/cloud_upload.svg'
import { clsx } from 'clsx'

import type { NextPage } from 'next'

const Create: NextPage = () => {
  return (
    <div
      className={clsx(
        'p-4',
        'grid',
        'grid-rows-[max-content,1fr]',
        'w-full',
        'h-full',
        'gap-4'
      )}
    >
      <h1 className={clsx('text-xl', 'text-text-primary')}>
        モデルのアップデート
      </h1>
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
    </div>
  )
}
export default Create
