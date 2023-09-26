import { clsx } from 'clsx'
import Link from 'next/link'

interface Props {
  tag: string
}
export const PopularTagElement: React.FC<Props> = ({ tag }) => {
  return (
    <Link
      href={`/search/${encodeURIComponent(tag)}`}
      className={clsx(
        'grid',
        'h-14',
        'place-items-center',
        'bg-[#3A4046]',
        'rounded',
        'text-text-primary'
      )}
    >
      #{tag}
    </Link>
  )
}
