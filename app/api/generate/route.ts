import type { NextRequest } from "next/server"
import { generateText } from "ai"
import type { Recipe } from "@/lib/types"

export async function POST(req: NextRequest) {
  try {
    const { ingredients = [], dietary = [], servings = 2 } = await req.json()
    const ingList = Array.isArray(ingredients) ? ingredients : []
    const dietList = Array.isArray(dietary) ? dietary : []

    const system = `
You are a helpful chef. Create 3 concise recipes as JSON. Each recipe must include:
- id (string), title, cuisine, difficulty (Easy|Medium|Hard), timeMinutes (number)
- ingredients: array of { name, quantityPerServing (number), unit? }
- steps: array of short strings
- nutrition: { calories, protein, carbs, fat } (numbers)
- dietary: array of strings from ["vegetarian","vegan","gluten-free","keto"]
- image: a short alt-like string (will be used as a placeholder query)
All ingredient quantities must be per 1 serving. The caller will scale by "servings".
Prefer using provided ingredients and include substitutions where reasonable.
Ensure valid JSON only.
`.trim()

    const user = `
Available ingredients: ${ingList.join(", ") || "none"}.
Dietary preferences: ${dietList.join(", ") || "none"}.
Create 3 diverse recipes from different cuisines.
`.trim()

    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `${system}\n\nUSER:\n${user}\n\nReturn JSON with { "recipes": Recipe[] }`,
    })

    // Attempt to extract JSON
    const jsonStart = text.indexOf("{")
    const jsonEnd = text.lastIndexOf("}")
    const jsonStr = jsonStart >= 0 ? text.slice(jsonStart, jsonEnd + 1) : "{}"
    const parsed = JSON.parse(jsonStr) as { recipes?: Recipe[] }

    const recipes = (parsed.recipes || []).map((r, i) => ({
      ...r,
      id: r.id || `ai-${Date.now()}-${i}`,
      source: "ai" as const,
      image: r.image
        ? `/placeholder.svg?height=160&width=320&query=${encodeURIComponent(r.image)}`
        : `/placeholder.svg?height=160&width=320&query=recipe%20image`,
    }))

    return Response.json({ recipes })
  } catch (err: any) {
    return Response.json({ message: err.message || "AI generation failed" }, { status: 500 })
  }
}
