"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { DietaryToggle } from "@/components/dietary-toggle"
import { PredefinedIngredients } from "@/components/predefined-ingredients"
import { Navbar } from "@/components/navbar"
import { Spinner } from "@/components/spinner"

export default function HomePage() {
  const router = useRouter()
  const [textIngredients, setTextIngredients] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const [dietary, setDietary] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [imageIngredients, setImageIngredients] = useState<string[]>([])

  const combinedIngredients = useMemo(() => {
    const manual = textIngredients
      .split(/,|\n/)
      .map((s) => s.trim())
      .filter(Boolean)
    return Array.from(new Set([...manual, ...selected, ...imageIngredients]))
  }, [textIngredients, selected, imageIngredients])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      const form = new FormData()
      form.append("image", file)
      const res = await fetch("/api/ingredients/from-image", {
        method: "POST",
        body: form,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to analyze image")
      setImageIngredients(data.ingredients || [])
    } catch (err) {
      console.error(err)
      alert("Could not analyze image. Please verify the photo or enter ingredients manually.")
    } finally {
      setUploading(false)
    }
  }

  function handleGenerate() {
    const params = new URLSearchParams()
    if (combinedIngredients.length) params.set("ingredients", combinedIngredients.join(","))
    if (dietary.length) params.set("dietary", dietary.join(","))
    router.push(`/results?${params.toString()}`)
  }

  return (
    <main className="min-h-dvh flex flex-col">
      <Navbar />
      <section className="container mx-auto max-w-4xl px-4 py-8 flex-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-balance">Smart Recipe Generator</CardTitle>
            <CardDescription>
              Enter ingredients, select preferences, and generate recipes with nutrition.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients (comma or line separated)</Label>
              <Input
                id="ingredients"
                placeholder="e.g., chicken, tomato, garlic, basil"
                value={textIngredients}
                onChange={(e) => setTextIngredients(e.target.value)}
              />
              <PredefinedIngredients value={selected} onChange={setSelected} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Dietary preferences</Label>
                <DietaryToggle value={dietary} onChange={setDietary} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo">Upload ingredient photo (optional)</Label>
                <div className="flex items-center gap-2">
                  <Input id="photo" type="file" accept="image/*" onChange={handleImageUpload} />
                  {uploading ? <Spinner label="Analyzing" /> : null}
                </div>
                {imageIngredients.length > 0 ? (
                  <p className="text-sm text-muted-foreground">Detected: {imageIngredients.join(", ")}</p>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="text-sm text-muted-foreground">
                Selected ingredients:{" "}
                <span className={cn(combinedIngredients.length ? "" : "italic")}>
                  {combinedIngredients.length ? combinedIngredients.join(", ") : "none"}
                </span>
              </div>
              <Button onClick={handleGenerate} disabled={combinedIngredients.length === 0}>
                Generate Recipes
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Favorites</CardTitle>
              <CardDescription>Saved recipes you love</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" onClick={() => router.push("/favorites")}>
                View Favorites
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Results</CardTitle>
              <CardDescription>Browse generated & static recipes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" onClick={() => router.push("/results")}>
                Open Results
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
              <CardDescription>Dark mode, preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" onClick={() => router.push("/settings")}>
                Open Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
