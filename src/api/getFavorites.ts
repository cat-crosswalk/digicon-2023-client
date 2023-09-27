const favoriteMap = new Map<string, boolean>()

export const getFavorites = async () => {
  return favoriteMap
}

export const toggleFavorite = async (id: string, favorite: boolean) => {
  favoriteMap.set(id, favorite)
}
