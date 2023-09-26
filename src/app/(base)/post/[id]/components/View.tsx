'use client'

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
            'top-2',
            'right-2',
            'w-8',
            'h-8',
            'bg-slate-300',
            'rounded-full',
            'skeleton-orange-300'
          )}
        />
      ) : null}
      <Link
        href={isExpanded ? `/post/${id}` : `/post/${id}?expanded`}
        className={clsx(
          'absolute',
          'right-2',
          'bottom-2',
          'w-8',
          'h-8',
          'bg-slate-300',
          'rounded-full',
          'skeleton-orange-300'
        )}
      />
    </div>
  )
}
