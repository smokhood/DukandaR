# How to Use These Feature Prompts

## Setup
Save all FEATURE_XX files in a /prompts folder
in your project root.

## The Golden Rule
Ask AI for ONE FILE at a time.
Never ask for multiple files in one message.
Test each file before moving to next.

## Exact Steps

### Step 1 — Give Context First
Start EVERY Copilot session with:

"I am building DukandaR — a React Native Expo app
where customers search for products like 'Lux Soap'
and find local shops near them that have it in stock.
Orders go through WhatsApp.
Stack: Expo SDK 52, TypeScript, Expo Router v3,
NativeWind v4, Firebase, Zustand, TanStack Query v5.
Architecture: MVVM strictly.
Now please..."

### Step 2 — Ask for One File
Example:
"...write FILE 3.5 — src/services/locationService.ts
as described in Feature 03."

### Step 3 — Test It
Run: npx expo start
Scan QR with Expo Go
Check the file works before continuing.

### Step 4 — Fix Errors
If there's an error, paste it back:
"I got this error: [paste error]
Fix it while keeping the same architecture."

### Step 5 — Commit Working Code
git add .
git commit -m "feat: add locationService"

## Build Order (strictly follow this)
Feature 01 → Feature 02 → Feature 03 → Feature 04
→ Feature 05 → Feature 06 → Feature 07 → Feature 08
→ Feature 09 → Feature 10 → Feature 11

## Tips
- If AI forgets context: re-paste the context paragraph
- If AI uses wrong packages: say "use [correct package]
  as specified in our tech stack"
- If AI adds unnecessary complexity: say "keep it simple,
  follow MVVM, one responsibility per file"
- Save working files to git before asking for changes
- Use Ctrl+Z aggressively if AI breaks working code

## Estimated Time Per Feature
Feature 01 (Setup):      2-3 hours
Feature 02 (Models):     1 hour
Feature 03 (Services):   3-4 hours
Feature 04 (Auth):       2-3 hours
Feature 05 (Home):       3-4 hours
Feature 06 (Search):     2-3 hours
Feature 07 (Shop+Order): 3-4 hours
Feature 08 (Owner):      4-5 hours
Feature 09 (Polish):     2-3 hours
Feature 10 (Tests):      2-3 hours
Feature 11 (Critical):   2-3 hours
─────────────────────────────────
Total:                   ~6-7 weeks
(working 2-3 hours per day)