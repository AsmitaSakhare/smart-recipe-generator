"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"

const COMMON = [
  "chicken",
  "beef",
  "pork",
  "tofu",
  "egg",
  "tomato",
  "onion",
  "garlic",
  "bell pepper",
  "spinach",
  "rice",
  "pasta",
  "potato",
  "beans",
  "cheese",
  "basil",
  "cilantro",
  "ginger",
  "lemon",
  "yogurt",
]

export function PredefinedIngredients({
  value,
  onChange,
}: {
  value: string[]
  onChange: (next: string[]) => void
}) {
  const selected = useMemo(() => new Set(value.map((v) => v.toLowerCase())), [value])

  function toggle(item: string) {
    const lower = item.toLowerCase()
    if (selected.has(lower)) {
      onChange(value.filter((v) => v.toLowerCase() !== lower))
    } else {
      onChange([...value, item])
    }
  }

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {COMMON.map((item) => {
        const active = selected.has(item.toLowerCase())
        return (
          <Button
            key={item}
            type="button"
            size="sm"
            variant={active ? "default" : "secondary"}
            onClick={() => toggle(item)}
            aria-pressed={active}
          >
            {item}
          </Button>
        )
      })}
    </div>
  )
}
