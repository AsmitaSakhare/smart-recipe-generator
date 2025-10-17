"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Filters } from "@/components/filters"
import { RecipeCard } from "@/components/recipe-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getStaticRecipes } from "@/data/recipes"
import type { Recipe, RecipeFilters } from "@/lib/types"
import { Spinner } from "@/components/spinner"

const fetcher = (url: string, body?: any) =>
  fetch(
    url,
    body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : undefined,
  ).then(async (r) => {
    const data = await r.json()
    if (!r.ok) throw new Error(data.message || "Request failed")
    return data
  })

export default function ResultsPage() {
  const search = useSearchParams()
  const ingredientsParam = search.get("ingredients") || ""
  const dietaryParam = search.get("dietary") || ""
  const ingredients = useMemo(
    () =>
      ingredientsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [ingredientsParam],
  )
  const dietary = useMemo(
    () =>
      dietaryParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [dietaryParam],
  )

  const [filters, setFilters] = useState<RecipeFilters>({ difficulty: "Any", maxMinutes: 120, dietary })
  const [servings, setServings] = useState(2)

  const {
    data: aiData,
    isLoading: aiLoading,
    error: aiError,
    mutate,
  } = useSWR(
    ingredients.length ? ["/api/generate", ingredients.join(","), dietary.join(","), servings] : null,
    ([url]) =>
      fetcher(url, {
        ingredients,
        dietary,
        servings,
        filters,
      }),
  )

  const staticRecipes = useMemo(() => filterRecipes(getStaticRecipes(), ingredients, filters), [ingredients, filters])
  const aiRecipes: Recipe[] = aiData?.recipes || []

  const combined = useMemo(() => {
    // Deduplicate by title
    const map = new Map<string, Recipe>()
    for (const r of [...aiRecipes, ...staticRecipes]) map.set(r.title.toLowerCase(), r)
    return Array.from(map.values())
  }, [aiRecipes, staticRecipes])

  return (
    <main className="min-h-dvh flex flex-col">
      <Navbar />
      <section className="container mx-auto max-w-6xl px-4 py-6 flex-1">
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <CardTitle className="text-balance">Recipe Results</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => setServings((s) => Math.max(1, s - 1))}
                aria-label="Decrease servings"
              >
                -
              </Button>
              <span className="text-sm">Servings: {servings}</span>
              <Button variant="secondary" onClick={() => setServings((s) => s + 1)} aria-label="Increase servings">
                +
              </Button>
              <Button onClick={() => mutate()} disabled={aiLoading}>
                Regenerate AI
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Filters value={filters} onChange={setFilters} />
            {aiLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner /> Generating recipes...
              </div>
            ) : aiError ? (
              <p className="text-sm text-destructive">AI error: {aiError.message}</p>
            ) : null}

            {combined.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recipes found. Try changing filters or ingredients.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {combined.map((r) => (
                  <RecipeCard key={r.id} recipe={r} servings={servings} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

function filterRecipes(recipes: Recipe[], ingredients: string[], filters: RecipeFilters) {
  const ingSet = new Set(ingredients.map((i) => i.toLowerCase()))
  return recipes.filter((r) => {
    if (filters.dietary && filters.dietary.length) {
      for (const d of filters.dietary) {
        if (!r.dietary.includes(d)) return false
      }
    }
    if (filters.difficulty !== "Any" && r.difficulty !== filters.difficulty) return false
    if (typeof filters.maxMinutes === "number" && r.timeMinutes > filters.maxMinutes) return false
    // simple ingredient match heuristic: at least one match
    if (ingSet.size > 0) {
      const names = r.ingredients.map((x) => x.name.toLowerCase())
      const match = names.some((n) => ingSet.has(n))
      if (!match) return false
    }
    return true
  })
}
