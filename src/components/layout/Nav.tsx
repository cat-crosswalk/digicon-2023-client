'use client'

import { clsx } from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Route {
  path: string
  icon: string
}

const Routes = [
  {
    path: '/',
    icon: 'home',
  },
  {
    path: '/search',
    icon: 'search',
  },
  {
    path: '/create',
    icon: 'create',
  },
  {
    path: '/favorite',
    icon: 'favorite',
  },
] as const satisfies readonly Route[]

export const Nav: React.FC = () => {
  const pathname = usePathname()

  return (
    <nav className={clsx('bg-slate-100', 'py-4')}>
      <ul className={clsx('grid', 'grid-cols-4', 'place-items-center')}>
        {Routes.map(({ path, icon }) => (
          <li
            key={path}
            className={clsx('w-10', 'h-10', 'bg-white', 'rounded-full')}
          >
            <Link
              aria-current={path === pathname ? 'page' : undefined}
              href={path}
              className={clsx(
                'skeleton-lime-700',
                'grid',
                'place-items-center',
                'w-full',
                'h-full',
                'aspect-square',
                'rounded-full'
              )}
            >
              {/* TODO: Replace with icon */}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
