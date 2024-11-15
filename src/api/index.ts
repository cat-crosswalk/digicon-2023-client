import dayjs from 'dayjs'

import { dummyVideoDataMap } from '@/utils/dummy'

import type { RawWork } from './model'
import type { Dayjs } from 'dayjs'

const RESOURCE_BASE_URL = process.env.RESOURCE_BASE_URL

export const resourcesJsonUrl = `${RESOURCE_BASE_URL}/resources.json`
export const idToResourceUrl = (id: string) => ({
  thumb: `${RESOURCE_BASE_URL}/thumb_${id}.png`,
  video: `${RESOURCE_BASE_URL}/video_${id}.mp4`,
  model: `${RESOURCE_BASE_URL}/model_${id}.splat`,
})

export interface Work {
  id: string
  title: string
  description: string
  tags: string[]
  place: string
  thumbUrl: string
  videoUrl: string
  modelUrl: string
  date: Dayjs
  isFavorite: boolean
}

export const rawWorkToWork = (
  rawWork: RawWork,
  favoritesMap: Map<string, boolean>
): Work => ({
  ...rawWork,
  thumbUrl: idToResourceUrl(rawWork.id).thumb,
  videoUrl: idToResourceUrl(rawWork.id).video,
  modelUrl: idToResourceUrl(rawWork.id).model,
  date: dayjs(rawWork.date),
  isFavorite: favoritesMap.get(rawWork.id) ?? false,
})
