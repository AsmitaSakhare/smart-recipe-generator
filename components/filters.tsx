"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { RecipeFilters } from "@/lib/types"

export function Filters({
  value,
  onChange,
}: {
  value: RecipeFilters
  onChange: (next: RecipeFilters) => void
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3 items-end">
      <div className="space-y-2">
        <Label>Difficulty</Label>
        <Select
          value={value.difficulty}
          onValueChange={(v) => onChange({ ...value, difficulty: v as RecipeFilters["difficulty"] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Max time (minutes): {value.maxMinutes}</Label>
        <Slider
          value={[value.maxMinutes]}
          onValueChange={([v]) => onChange({ ...value, maxMinutes: v })}
          min={10}
          max={180}
          step={5}
        />
      </div>
      <div className="space-y-1">
        <Label>Dietary</Label>
        <p className="text-xs text-muted-foreground min-h-5">
          {value.dietary?.length ? value.dietary.join(", ") : "None"}
        </p>
      </div>
    </div>
  )
}
