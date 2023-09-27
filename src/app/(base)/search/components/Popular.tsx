import { clsx } from 'clsx'

import { PopularTagElement } from './PopularTagElement'

const dummyPopularTags = [
  'sunlight',
  'forest',
  'nature',
  'landscape',
  'tree',
  'mountains',
  'dark',
  'light',
]

export const Popular: React.FC = () => {
  return (
    <section
      className={clsx(
        'px-2',
        'py-4',
        'w-full',
        'border-t-1',
        'border-t-ui-primary'
      )}
    >
      <h2
        className={clsx('px-2', 'font-medium', 'text-xl', 'text-text-primary')}
      >
        おすすめのタグ
      </h2>
      <div className={clsx('mt-4', 'grid', 'grid-cols-2', 'gap-2', 'w-full')}>
        {dummyPopularTags.map(tag => (
          <PopularTagElement key={tag} tag={tag} />
        ))}
      </div>
    </section>
  )
}
