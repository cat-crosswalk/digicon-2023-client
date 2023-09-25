import { clsx } from 'clsx'

import { Nav } from '@/components/layout/Nav'

const BaseLayout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <div
      className={clsx(
        'h-full',
        'max-w-xl',
        'w-full',
        'mx-auto',
        'grid',
        'grid-rows-[1fr,max-content]'
      )}
    >
      <main className={clsx('overflow-auto')}>{children}</main>
      <Nav />
    </div>
  )
}
export default BaseLayout
