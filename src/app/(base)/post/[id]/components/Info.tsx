import CalendarMonthIcon from '@material-symbols/svg-400/outlined/calendar_month.svg'
import FavoriteIconFilled from '@material-symbols/svg-400/outlined/favorite-fill.svg'
import FavoriteIcon from '@material-symbols/svg-400/outlined/favorite.svg'
import LocationOnIcon from '@material-symbols/svg-400/outlined/location_on.svg'
import ShareIcon from '@material-symbols/svg-400/outlined/share.svg'
import { clsx } from 'clsx'
import Link from 'next/link'

import type { Dayjs } from 'dayjs'

interface Props {
  id: string
  uploadDate: Dayjs
  place: string
  title: string
  description: string
  tags: string[]
  isFavorite?: boolean
  onFavorite?: (id: string, value: boolean) => void
}
export const Info: React.FC<Props> = ({
  id,
  uploadDate,
  place,
  title,
  description,
  tags,
  isFavorite,
  onFavorite,
}) => {
  return (
    <div className={clsx('p-4', 'text-text-primary')}>
      <div className={clsx('grid', 'grid-cols-[1fr,max-content]')}>
        <div>
          <p className={clsx('flex', 'items-center', 'gap-1')}>
            <CalendarMonthIcon
              className={clsx('square-[1.125rem]', 'fill-current')}
            />
            <time
              dateTime={uploadDate.format('YYYY-MM-DD')}
              className={clsx('text-sm')}
            >
              {uploadDate.format('MMMM DD, YYYY')}
            </time>
          </p>
          <p className={clsx('mt-1', 'flex', 'items-center', 'gap-1')}>
            <LocationOnIcon
              className={clsx('square-[1.125rem]', 'fill-current')}
            />
            <span className={clsx('text-sm')}>{place}</span>
          </p>
        </div>
        <div>
          <button className={clsx('p-1')}>
            <ShareIcon className={clsx('square-6', 'fill-current')} />
          </button>
          {isFavorite !== undefined && (
            <button
              className={clsx('p-1', 'ml-2')}
              onClick={() => {
                onFavorite?.(id, isFavorite !== true)
              }}
            >
              {isFavorite ? (
                <FavoriteIconFilled
                  className={clsx('square-6', 'fill-current')}
                />
              ) : (
                <FavoriteIcon className={clsx('square-6', 'fill-current')} />
              )}
            </button>
          )}
        </div>
      </div>
      <h1 className={clsx('font-bold', 'mt-1')}>{title}</h1>
      <p className={clsx('mt-2', 'font-medium')}>{description}</p>
      <ul className={clsx('flex', 'flex-wrap', 'gap-x-1', 'mt-2')}>
        {tags.map(tag => (
          <li key={tag}>
            <Link href={`/search/${encodeURIComponent(tag)}`}>#{tag}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
