import { getFavorites } from './getFavorites'

import { rawWorkToWork, resourcesJsonUrl } from '.'

import type { Work } from '.'
import type { RawWork } from './model'

export const getWork = async (id: string): Promise<Work> => {
  const response = await fetch(resourcesJsonUrl)
  const data: RawWork[] = await response.json()
  const favoritesMap = await getFavorites()
  const rawWork = data.find(work => work.id === id)

  if (!rawWork) {
    throw new Error(`Work not found: ${id}`)
  }

  return rawWorkToWork(rawWork, favoritesMap)
}
