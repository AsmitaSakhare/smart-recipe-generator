"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Recipe } from "@/lib/types"
import { getFavorites } from "@/lib/storage"
import { RecipeCard } from "@/components/recipe-card"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Recipe[]>([])

  useEffect(() => {
    setFavorites(getFavorites())
    const onChange = () => setFavorites(getFavorites())
    window.addEventListener("recipe-favorites-changed", onChange as any)
    return () => window.removeEventListener("recipe-favorites-changed", onChange as any)
  }, [])

  return (
    <main className="min-h-dvh flex flex-col">
      <Navbar />
      <section className="container mx-auto max-w-6xl px-4 py-6 flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Favorites</CardTitle>
          </CardHeader>
          <CardContent>
            {favorites.length === 0 ? (
              <p className="text-sm text-muted-foreground">No favorites yet. Save recipes to see them here.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {favorites.map((r) => (
                  <RecipeCard key={r.id} recipe={r} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
