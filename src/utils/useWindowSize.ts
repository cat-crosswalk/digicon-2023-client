import { useMemo, useSyncExternalStore } from 'react'

const useWindowWidth = () => {
  return useSyncExternalStore(
    callback => {
      window.addEventListener('resize', callback)
      return () => window.removeEventListener('resize', callback)
    },
    () => window.innerWidth,
    () => null
  )
}

const useWindowHeight = () => {
  return useSyncExternalStore(
    callback => {
      window.addEventListener('resize', callback)
      return () => window.removeEventListener('resize', callback)
    },
    () => window.innerHeight,
    () => null
  )
}

export const useWindowSize = () => {
  const width = useWindowWidth()
  const height = useWindowHeight()

  return useMemo(
    () => (width === null || height === null ? null : { width, height }),
    [width, height]
  )
}
