"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { clearAll } from "@/lib/storage"

export default function SettingsPage() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark"
    setDark(isDark)
    document.documentElement.classList.toggle("dark", isDark)
  }, [])

  function toggleDark(next: boolean) {
    setDark(next)
    localStorage.setItem("theme", next ? "dark" : "light")
    document.documentElement.classList.toggle("dark", next)
  }

  return (
    <main className="min-h-dvh flex flex-col">
      <Navbar />
      <section className="container mx-auto max-w-3xl px-4 py-6 flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Personalize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label>Dark mode</Label>
                <p className="text-sm text-muted-foreground">Switch between light and dark themes.</p>
              </div>
              <Switch checked={dark} onCheckedChange={toggleDark} aria-label="Toggle dark mode" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label>Reset data</Label>
                <p className="text-sm text-muted-foreground">Clear local favorites and ratings.</p>
              </div>
              <Button
                variant="destructive"
                onClick={() => {
                  clearAll()
                  alert("Local data cleared.")
                }}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
