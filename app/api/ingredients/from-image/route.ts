import type { NextRequest } from "next/server"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get("image") as File | null
    if (!file) {
      return Response.json({ message: "No image provided" }, { status: 400 })
    }

    // Convert to base64 for inline pass to a vision-capable model (if available).
    const buf = Buffer.from(await file.arrayBuffer())
    const b64 = buf.toString("base64")
    const mime = file.type || "image/jpeg"

    const { text } = await generateText({
      // A vision-capable model routed via Vercel AI Gateway; if unsupported, error is handled below.
      model: "openai/gpt-4o-mini",
      prompt:
        `You are a vision assistant. The user uploaded a kitchen photo encoded base64 below.\n` +
        `Identify visible edible ingredients as a lowercase comma-separated list. Keep it short.\n` +
        `Image (mime ${mime}): data:${mime};base64,${b64}`,
    })

    const list = text
      .split(/,|\n/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)

    // Safety: limit to 15
    const ingredients = Array.from(new Set(list)).slice(0, 15)

    if (ingredients.length === 0) {
      // Fallback heuristic (very conservative)
      return Response.json({
        ingredients: [],
        message: "No ingredients detected from image.",
      })
    }

    return Response.json({ ingredients })
  } catch (err: any) {
    // Graceful fallback on environments without vision support
    return Response.json(
      {
        ingredients: [],
        message: "Vision analysis unavailable. Please enter ingredients manually.",
      },
      { status: 200 },
    )
  }
}
