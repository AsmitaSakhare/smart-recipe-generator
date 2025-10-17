"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Recipe } from "@/lib/types"
import { cn } from "@/lib/utils"
import { toggleFavorite, isFavorite, addRating, getRating } from "@/lib/storage"
import { useEffect, useState } from "react"
import { RatingStars } from "@/components/rating-stars"

export function RecipeCard({ recipe, servings = 2 }: { recipe: Recipe; servings?: number }) {
  const [fav, setFav] = useState(false)
  const [rating, setRating] = useState<number>(0)

  useEffect(() => {
    setFav(isFavorite(recipe.id))
    setRating(getRating(recipe.id))
  }, [recipe.id])

  function onFavorite() {
    toggleFavorite(recipe)
    setFav(isFavorite(recipe.id))
  }

  function onRate(v: number) {
    addRating(recipe.id, v)
    setRating(getRating(recipe.id))
  }

  const scaled = recipe.ingredients.map((ing) => {
    const qty = ing.quantityPerServing * servings
    return `${ing.name} — ${qty}${ing.unit || ""}`
  })

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-pretty">{recipe.title}</CardTitle>
        <p className="text-xs text-muted-foreground">
          {recipe.cuisine} • {recipe.difficulty} • {recipe.timeMinutes} min
        </p>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="relative w-full h-40 rounded-md overflow-hidden bg-muted">
          <Image
            src={recipe.image || `/placeholder.svg?height=160&width=320&query=recipe%20image`}
            alt={recipe.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div>
          <p className="font-medium text-sm mb-1">Ingredients (for {servings}):</p>
          <ul className="text-sm list-disc pl-5 space-y-0.5">
            {scaled.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-medium text-sm mb-1">Instructions:</p>
          <ol className="text-sm list-decimal pl-5 space-y-0.5">
            {recipe.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <NutritionPill label="Calories" value={`${recipe.nutrition.calories}`} />
          <NutritionPill label="Protein" value={`${recipe.nutrition.protein}g`} />
          <NutritionPill label="Carbs" value={`${recipe.nutrition.carbs}g`} />
          <NutritionPill label="Fat" value={`${recipe.nutrition.fat}g`} />
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <RatingStars value={rating} onChange={onRate} />
          <span className="text-xs text-muted-foreground">{rating ? `${rating}/5` : "No rating"}</span>
        </div>
        <Button variant={fav ? "default" : "secondary"} onClick={onFavorite} aria-pressed={fav}>
          {fav ? "Saved" : "Save"}
        </Button>
      </CardFooter>
    </Card>
  )
}

function NutritionPill({ label, value }: { label: string; value: string }) {
  return (
    <div className={cn("rounded-md px-2 py-1 bg-secondary text-secondary-foreground")}>
      <div className="text-[10px] uppercase tracking-wide">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  )
}
