'use client'

import AddCircleIconFill from '@material-symbols/svg-400/outlined/add_circle-fill.svg'
import AddCircleIcon from '@material-symbols/svg-400/outlined/add_circle.svg'
import FavoriteIconFill from '@material-symbols/svg-400/outlined/favorite-fill.svg'
import FavoriteIcon from '@material-symbols/svg-400/outlined/favorite.svg'
import HomeIconFill from '@material-symbols/svg-400/outlined/home-fill.svg'
import HomeIcon from '@material-symbols/svg-400/outlined/home.svg'
import PersonIconFill from '@material-symbols/svg-400/outlined/person-fill.svg'
import PersonIcon from '@material-symbols/svg-400/outlined/person.svg'
import SearchIconFill from '@material-symbols/svg-400/outlined/search-fill.svg'
import SearchIcon from '@material-symbols/svg-400/outlined/search.svg'
import { clsx } from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

interface Route {
  path: string
  icon: React.ReactNode
  iconActive: React.ReactNode
}

const iconProps = Object.freeze({
  className: clsx('w-6', 'h-6', 'fill-current'),
})
const Routes = [
  {
    path: '/',
    icon: <HomeIcon {...iconProps} />,
    iconActive: <HomeIconFill {...iconProps} />,
  },
  {
    path: '/search',
    icon: <SearchIcon {...iconProps} />,
    iconActive: <SearchIconFill {...iconProps} />,
  },
  {
    path: '/create',
    icon: <AddCircleIcon {...iconProps} />,
    iconActive: <AddCircleIconFill {...iconProps} />,
  },
  {
    path: '/favorite',
    icon: <FavoriteIcon {...iconProps} />,
    iconActive: <FavoriteIconFill {...iconProps} />,
  },
  // FIXME: favorite にしてるのはてきとう trailing slash をつけて key の重複を防ぐ
  {
    path: '/favorite/',
    icon: <PersonIcon {...iconProps} />,
    iconActive: <PersonIconFill {...iconProps} />,
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
        {Routes.map(({ path, icon, iconActive }) => (
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
                'transition-colors',
                'text-text-tertiary',
                'aria-[current=page]:text-text-primary'
              )}
            >
              {pathname === path ? iconActive : icon}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
