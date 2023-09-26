'use client'

import FullScreenIcon from '@material-symbols/svg-400/outlined/fullscreen.svg'
import FullScreenExitIcon from '@material-symbols/svg-400/outlined/fullscreen_exit.svg'
import PhotoCameraIcon from '@material-symbols/svg-400/outlined/photo_camera.svg'
import { clsx } from 'clsx'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

interface Props {
  id: string
}

export const View: React.FC<Props> = ({ id }) => {
  const searchParams = useSearchParams()
  const isExpanded = useMemo(() => searchParams.has('expanded'), [searchParams])

  return (
    <div
      className={clsx(
        isExpanded
          ? clsx('fixed', 'inset-0', 'z-50')
          : clsx('relative', 'aspect-[3/4]')
      )}
    >
      <div
        className={clsx(
          'absolute',
          'inset-0',
          'skeleton-sky-100',
          'bg-slate-100'
        )}
      />
      {isExpanded ? (
        <button
          className={clsx(
            'absolute',
            'top-4',
            'right-4',
            'square-8',
            'p-1',
            'bg-bg-primary',
            'rounded-xl'
          )}
        >
          <PhotoCameraIcon className={clsx('square-6', 'fill-text-primary')} />
        </button>
      ) : null}
      <Link
        href={isExpanded ? `/post/${id}` : `/post/${id}?expanded`}
        className={clsx(
          'absolute',
          'right-4',
          'bottom-4',
          'w-8',
          'h-8',
          'p-1',
          'bg-bg-primary',
          'rounded-xl'
        )}
      >
        {isExpanded ? (
          <FullScreenExitIcon
            className={clsx('w-6', 'h-6', 'fill-text-primary')}
          />
        ) : (
          <FullScreenIcon className={clsx('w-6', 'h-6', 'fill-text-primary')} />
        )}
      </Link>
    </div>
  )
}
