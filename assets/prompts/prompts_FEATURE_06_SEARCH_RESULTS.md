# FEATURE 06 — Search Results Screen

## Context
DukandaR. This is the most important screen.
User searched for a product and sees which
local shops have it with prices and distance.

---

## FILE 6.1 — src/components/StockBadge.tsx

Small inline badge:

Props:
- status: StockStatus
- size?: 'sm' | 'md' (default 'sm')

Variants:
in_stock:
  Green dot + "موجود" text
  bg-green-100 text-green-700

out_of_stock:
  Red dot + "ختم" text
  bg-red-100 text-red-700

unverified:
  Orange warning icon + "غیر تصدیق شدہ" text
  bg-orange-100 text-orange-700
  Tooltip: "کسی نے ابھی تک تصدیق نہیں کی"

---

## FILE 6.2 — src/components/ProductItem.tsx

Product result row:

Props:
- product: ProductWithShop
- onAddToOrder: (product: ProductWithShop) => void
- onShopPress: (shopId: string) => void
- onFlagStock: (productId: string, shopId: string) => void
- isInCart?: boolean

UI:
Container: white bg, rounded-xl, shadow-sm,
mb-2, horizontal padding

Top row:
  Left:
    Product name (bold, 15px, dark)
    Shop name (tappable, green, 13px)
    "📍 {distance} • {open status}" (gray, 12px)
  Right:
    Price "Rs. {price}" (bold, green, 18px)
    If isCheapestNearby: amber "سب سے سستا" badge
    If isNearestWithStock: blue "سب سے قریب" badge

Bottom row:
  Left: StockBadge
  Right:
    If !isInCart: "+" button (green circle)
    If isInCart: green checkmark (already added)

Long press → show "غلط اسٹاک رپورٹ کریں" option

---

## FILE 6.3 — app/(customer)/results.tsx

Search results screen:

Route params: query (string), fromMultiSearch? (boolean)

Header:
  Back button
  Search bar (pre-filled with query, tappable to edit)
  Filter icon (opens filter bottom sheet)

FILTER BAR (horizontal scroll):
  Sort pills: [قریب ترین ✓] [سستا] [بہترین]
  Toggle: [ابھی کھلا ●] (green when active)
  Distance: [2 km ▼] (opens radius picker)

VIEW TOGGLE:
  [📦 پروڈکٹ] [🏪 دکان] toggle
  (two modes as explained in master prompt)

BY PRODUCT VIEW:
  FlashList, grouped by shop
  Section headers: ShopCard (compact variant)
  Items: ProductItem components
  Loading: 5 × ProductItemSkeleton

BY SHOP VIEW:
  FlashList of ShopCards (full variant)
  Under each shop: "X/Y items available"
  Matched items listed (first 3 + "and X more")
  Missing items in gray strikethrough

MULTI-ITEM VIEW (if fromMultiSearch):
  Show ShopWithProducts sorted by:
  1. Has all items first
  2. Then by price (total)
  Each card shows:
  ✅ "تمام {X} چیزیں موجود" (green)
  ⚠️ "{X}/{Y} چیزیں موجود" (orange)
  Missing: "{item}, {item}" (gray)
  Estimated total: "تخمینی کل: Rs. X"

RESULTS COUNT:
  "{X} دکانوں میں '{query}' ملا" at top

Handle:
- isLoading: skeleton
- error: retry button
- no results: EmptyState no_results
- offline: EmptyState offline + cached results

---

## FILE 6.4 — src/components/OfflineBanner.tsx

Network status banner:

Uses @react-native-community/netinfo:
- Listen to network state changes
- When offline: slide down yellow banner
  "📴 آپ آف لائن ہیں — پرانا ڈیٹا دکھایا جا رہا ہے"
- When back online: briefly show green banner
  "✅ واپس آن لائن" then hide after 2 seconds

Animation: Reanimated translateY slide
Position: absolute top (below status bar)