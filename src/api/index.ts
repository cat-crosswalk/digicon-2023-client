import dayjs from 'dayjs'

import { dummyVideoDataMap } from '@/utils/dummy'

import type { RawWork } from './model'
import type { Dayjs } from 'dayjs'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const resourcesBaseUrl = `${BASE_URL}/resources`
export const resourcesJsonUrl = `${resourcesBaseUrl}/resources.json`
export const idToResourceUrl = (id: string) => ({
  thumb: `${resourcesBaseUrl}/thumb_${id}.png`,
  video: `${resourcesBaseUrl}/video_${id}.mp4`,
  model: `${resourcesBaseUrl}/model_${id}.splat`,
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
