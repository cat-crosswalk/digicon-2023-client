import { clsx } from 'clsx'
import Link from 'next/link'
import React from 'react'

interface Props {
  id: string
  title: string
  thumbUrl: string
  videoUrl: string
}

export const Preview: React.FC<Props> = ({ id, title, thumbUrl, videoUrl }) => {
  return (
    <Link
      aria-label={title}
      href={`/post/${id}`}
      style={
        {
          '--bg-image': `url(${thumbUrl})`,
        } as React.CSSProperties
      }
      className={clsx(
        'rounded-lg',
        'w-full',
        'aspect-[3/4]',
        'overflow-hidden',
        'bg-slate-300',
        'grid',
        'z-10',
        'place-items-center',
        'bg-[image:var(--bg-image)]',
        'bg-cover',
        'bg-center',
        'bg-no-repeat',
        'group'
      )}
    >
      <video
        src={videoUrl}
        className={clsx(
          'w-full',
          'h-full',
          'object-cover',
          'hidden',
          'group-hover:block',
          'group-hover:animate-fade-in-lazy'
        )}
        loop
        autoPlay
        muted
        playsInline
      />
    </Link>
  )
}
