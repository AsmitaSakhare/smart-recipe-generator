export type Ingredient = {
  name: string
  quantityPerServing: number
  unit?: string
}

export type Nutrition = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export type Recipe = {
  id: string
  title: string
  cuisine: string
  difficulty: "Easy" | "Medium" | "Hard"
  timeMinutes: number
  ingredients: Ingredient[]
  steps: string[]
  nutrition: Nutrition
  dietary: string[] // e.g., ["vegetarian", "gluten-free"]
  image?: string
  source?: "static" | "ai"
}

export type RecipeFilters = {
  difficulty: "Any" | "Easy" | "Medium" | "Hard"
  maxMinutes: number
  dietary?: string[]
}
