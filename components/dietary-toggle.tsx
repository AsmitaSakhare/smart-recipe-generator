"use client"

import { Button } from "@/components/ui/button"

const OPTIONS = ["vegetarian", "vegan", "gluten-free", "keto"]

export function DietaryToggle({
  value,
  onChange,
}: {
  value: string[]
  onChange: (next: string[]) => void
}) {
  function toggle(opt: string) {
    const has = value.includes(opt)
    onChange(has ? value.filter((v) => v !== opt) : [...value, opt])
  }
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((o) => {
        const active = value.includes(o)
        return (
          <Button
            key={o}
            type="button"
            size="sm"
            variant={active ? "default" : "secondary"}
            onClick={() => toggle(o)}
            aria-pressed={active}
          >
            {o}
          </Button>
        )
      })}
    </div>
  )
}
