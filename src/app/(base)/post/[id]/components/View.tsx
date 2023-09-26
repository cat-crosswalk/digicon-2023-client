'use client'

import FullScreenIcon from '@material-symbols/svg-400/outlined/fullscreen.svg'
import FullScreenExitIcon from '@material-symbols/svg-400/outlined/fullscreen_exit.svg'
import PhotoCameraIcon from '@material-symbols/svg-400/outlined/photo_camera.svg'
import { clsx } from 'clsx'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'

import { renderSplatting } from '@/features/splatting'
import { useWindowSize } from '@/utils/useWindowSize'

interface Props {
  id: string
  splatSrc: string
}

export const View: React.FC<Props> = ({ id, splatSrc }) => {
  const searchParams = useSearchParams()
  const isExpanded = useMemo(() => searchParams.has('expanded'), [searchParams])
  const size = useWindowSize()

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // NOTE: 参照を同じにするために useRef を使う
  const allowKeyboardControls = useRef<boolean>(false)
  useEffect(() => {
    allowKeyboardControls.current = isExpanded
  }, [isExpanded])

  useEffect(() => {
    if (canvasRef.current === null) return
    if (size === null) return
    const controller = new AbortController()

    void renderSplatting(
      canvasRef.current,
      document.createElement('div'),
      splatSrc,
      size,
      allowKeyboardControls,
      controller.signal
    )

    return () => {
      controller.abort()
    }
  }, [size, splatSrc])

  useEffect(() => {
    if (canvasRef.current === null) return
    if (!isExpanded) return

    canvasRef.current.focus()
  }, [isExpanded])

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
          'overflow-hidden',
          'grid',
          'place-items-center'
        )}
      >
        <div className={clsx('relative', 'w-full', 'h-full')}>
          <div
            className={clsx(
              'bg-slate-200',
              'skeleton-orange-300',
              'w-full',
              'h-full'
            )}
          />
          <canvas
            ref={canvasRef}
            tabIndex={isExpanded ? 0 : -1}
            autoFocus={isExpanded}
            className={clsx(
              'bg-transparent',
              'absolute',
              'top-0',
              'left-1/2',
              '-translate-x-1/2',
              'w-[var(--width)]',
              'h-[var(--height)]'
            )}
            style={
              {
                '--width': `${size?.width ?? 0}px`,
                '--height': `${size?.height ?? 0}px`,
              } as React.CSSProperties
            }
          />
        </div>
      </div>
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
