import type { Recipe } from "./types"

const FAV_KEY = "recipe-favorites"
const RATE_KEY = "recipe-ratings"

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

export function getFavorites(): Recipe[] {
  return read<Recipe[]>(FAV_KEY, [])
}

export function isFavorite(id: string): boolean {
  return getFavorites().some((r) => r.id === id)
}

export function toggleFavorite(recipe: Recipe) {
  const favs = getFavorites()
  const exists = favs.find((r) => r.id === recipe.id)
  let next: Recipe[]
  if (exists) {
    next = favs.filter((r) => r.id !== recipe.id)
  } else {
    next = [{ ...recipe, source: recipe.source || "static" }, ...favs].slice(0, 200)
  }
  write(FAV_KEY, next)
  dispatchEvent(new Event("recipe-favorites-changed"))
}

export function getRating(id: string): number {
  const map = read<Record<string, number>>(RATE_KEY, {})
  return map[id] || 0
}

export function addRating(id: string, value: number) {
  const map = read<Record<string, number>>(RATE_KEY, {})
  map[id] = value
  write(RATE_KEY, map)
  dispatchEvent(new Event("recipe-ratings-changed"))
}

export function clearAll() {
  write(FAV_KEY, [])
  write(RATE_KEY, {})
  dispatchEvent(new Event("recipe-favorites-changed"))
  dispatchEvent(new Event("recipe-ratings-changed"))
}
