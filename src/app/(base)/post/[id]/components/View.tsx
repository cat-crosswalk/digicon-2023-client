'use client'

import FullScreenIcon from '@material-symbols/svg-400/outlined/fullscreen.svg'
import FullScreenExitIcon from '@material-symbols/svg-400/outlined/fullscreen_exit.svg'
import PhotoCameraIcon from '@material-symbols/svg-400/outlined/photo_camera.svg'
import { clsx } from 'clsx'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { renderSplatting } from '@/features/splatting'
import { dummyVideoDataMap } from '@/utils/dummy'
import { useWindowSize } from '@/utils/useWindowSize'

interface Props {
  id: string
}

export const View: React.FC<Props> = ({ id }) => {
  const searchParams = useSearchParams()
  const isExpanded = useMemo(() => searchParams.has('expanded'), [searchParams])
  const size = useWindowSize()
  const splatSrc = useMemo(() => {
    return dummyVideoDataMap[id]?.splatFileSrc ?? ''
  }, [id])
  const [isLoading, setIsLoading] = useState(true)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const flashRef = useRef<HTMLDivElement>(null)
  const wantScreenShotRef = useRef<EventTarget | null>(null)
  const onScreenShot = useCallback(async () => {
    if (canvasRef.current === null) return
    if (flashRef.current === null) return

    flashRef.current.animate(flashKeyframes, flashTiming)

    const target = new EventTarget()
    wantScreenShotRef.current = target

    target.addEventListener(
      'screenshot',
      ((data: CustomEvent<string>) => {

        const a = document.createElement('a')
        a.href = data.detail
        a.download = 'splatting.png'
        a.click()

        wantScreenShotRef.current = null
      }) as EventListenerOrEventListenerObject,
      { once: true }
    )
  }, [])

  const onLoadingChange = useCallback((loaded: boolean) => {
    setIsLoading(loaded)
  }, [])

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
      splatSrc,
      size,
      allowKeyboardControls,
      onLoadingChange,
      wantScreenShotRef,
      controller.signal
    )

    return () => {
      controller.abort()
    }
  }, [onLoadingChange, size, splatSrc])

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
              'h-full',
              !isLoading && 'hidden'
            )}
          />
          <canvas
            ref={canvasRef}
            tabIndex={isExpanded ? 0 : -1}
            autoFocus={isExpanded}
            className={clsx(
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
          <div
            ref={flashRef}
            className={clsx('absolute', 'inset-0', 'bg-white', 'opacity-0')}
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
          onClick={onScreenShot}
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

const flashKeyframes = [
  {
    opacity: 0,
  },
  {
    opacity: 1,
    offset: 0.2,
  },
  {
    opacity: 0,
  },
] satisfies Keyframe[]
const flashTiming = {
  duration: 500,
  easing: 'ease-out',
} as const satisfies KeyframeAnimationOptions
