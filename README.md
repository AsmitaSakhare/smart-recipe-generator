# Smart Recipe Generator

Live Demo:
https://vercel.com/sakhareasmita4-gmailcoms-projects/smart-recipe-generator/9PapnS2ZxU1BUvnS9mgNjsyVHj8E

An AI-powered Next.js app that suggests recipes from your ingredients, with nutrition, filters, ratings, favorites, and dietary preferences.

Features:
- Input ingredients by text, quick chips, or optional photo (vision fallback included).
- Generate recipes via AI and combine with a 20+ static recipe dataset.
- Filter by difficulty, time, and dietary needs. Adjust servings to auto-scale ingredients.
- Rate and save favorites (localStorage). Dark/light mode toggle.

Tech:
- Next.js (App Router) + Tailwind (shadcn/ui).
- Vercel AI SDK for text generation (no manual API key needed on v0). Vision route included with graceful fallback.

Setup:
- Open in v0, click Preview. Use the shadcn CLI or GitHub export to install locally if needed.
- Deploy by clicking Publish to Vercel.

Environment:
- AI via Vercel AI Gateway. For external providers, add keys in the in-chat Connect panel.

Notes:
- If photo analysis is unavailable, the app prompts you to enter ingredients manually.
- This is a demo—nutrition is approximated and for informational purposes only.
