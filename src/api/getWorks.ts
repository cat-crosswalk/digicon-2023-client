import { getFavorites } from './getFavorites'

import { rawWorkToWork, resourcesJsonUrl } from '.'

import type { Work } from '.'
import type { RawWork } from './model'

export const getWorks = async (): Promise<Work[]> => {
  const response = await fetch(resourcesJsonUrl)
  const data: readonly RawWork[] = await response.json()
  const favoritesMap = await getFavorites()

  return data.map(data => rawWorkToWork(data, favoritesMap))
}
