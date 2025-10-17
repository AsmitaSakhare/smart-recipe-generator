"use client"

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" role="img">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
      </svg>
      {label ? <span className="text-sm text-muted-foreground">{label}</span> : null}
    </div>
  )
}
