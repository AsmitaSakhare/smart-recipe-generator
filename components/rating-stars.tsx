"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"

export function RatingStars({
  value,
  onChange,
  max = 5,
}: {
  value: number
  onChange: (v: number) => void
  max?: number
}) {
  const stars = useMemo(() => Array.from({ length: max }, (_, i) => i + 1), [max])
  return (
    <div className="flex items-center">
      {stars.map((s) => {
        const active = s <= value
        return (
          <Button
            key={s}
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Rate ${s}`}
            onClick={() => onChange(s)}
            className="h-8 w-8"
            title={`${s} star${s > 1 ? "s" : ""}`}
          >
            <Star filled={active} />
          </Button>
        )
      })}
    </div>
  )
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      className={filled ? "" : "text-muted-foreground"}
    >
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  )
}
