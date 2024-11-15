import { clsx } from 'clsx'

import { getWorks } from '@/api/getWorks'

import { PopularTagElement } from './PopularTagElement'

export const Popular: React.FC = async () => {
  const works = await getWorks()

  const tags = works.flatMap(({ tags }) => tags)
  const tagCountMap = new Map<string, number>()
  tags.forEach(tag => {
    const count = tagCountMap.get(tag) ?? 0
    tagCountMap.set(tag, count + 1)
  })

  const sortedTags = [...tagCountMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)

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
        {sortedTags.map(tag => (
          <PopularTagElement key={tag} tag={tag} />
        ))}
      </div>
    </section>
  )
}
