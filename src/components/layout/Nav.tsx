'use client'

import AddCircleIcon from '@material-symbols/svg-400/outlined/add_circle.svg'
import FavoriteIcon from '@material-symbols/svg-400/outlined/favorite.svg'
import HomeIcon from '@material-symbols/svg-400/outlined/home.svg'
import SearchIcon from '@material-symbols/svg-400/outlined/search.svg'
import { clsx } from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

interface Route {
  path: string
  icon: React.ReactNode
}

const iconProps = Object.freeze({
  className: clsx('w-6', 'h-6', 'fill-text-primary'),
})
const Routes = [
  {
    path: '/',
    icon: <HomeIcon {...iconProps} />,
  },
  {
    path: '/search',
    icon: <SearchIcon {...iconProps} />,
  },
  {
    path: '/create',
    icon: <AddCircleIcon {...iconProps} />,
  },
  {
    path: '/favorite',
    icon: <FavoriteIcon {...iconProps} />,
  },
  // FIXME: favorite にしてるのはてきとう trailing slash をつけて key の重複を防ぐ
  {
    path: '/favorite/',
    icon: <FavoriteIcon {...iconProps} />,
  },
] as const satisfies readonly Route[]

export const Nav: React.FC = () => {
  const pathname = usePathname()

  return (
    <nav
      className={clsx(
        'bg-bg-primary',
        'border-t-1',
        'border-t-ui-primary',
        'h-14',
        'px-11'
      )}
    >
      <ul className={clsx('flex', 'justify-between', 'h-full', 'items-center')}>
        {Routes.map(({ path, icon }) => (
          <li key={path} className={clsx()}>
            <Link
              aria-current={path === pathname ? 'page' : undefined}
              href={path}
              className={clsx(
                'grid',
                'place-items-center',
                'w-10',
                'h-10',
                'aspect-square',
                'text-text-primary'
              )}
            >
              {icon}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
