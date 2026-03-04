# FEATURE 07 — Shop Detail Page & Order Builder

## Context
DukandaR. Shop detail shows full catalog.
Order builder lets customer build order
and send via WhatsApp.

---

## FILE 7.1 — src/store/cartStore.ts

Zustand cart store:

State:
- items: CartItem[]
- shopId: string | null
- shopName: string
- shopWhatsapp: string
- note: string

Computed (derived in hook):
- totalItems: sum of quantities
- totalPrice: sum of price × quantity
- isEmpty: items.length === 0

Actions:
- addItem(item: CartItem): void
  If shopId is different: call clearCart first,
  then set new shopId + add item.
  If same shop: add or increment quantity.

- removeItem(productId: string): void

- updateQuantity(productId: string, qty: number): void
  If qty <= 0: remove item

- setNote(note: string): void

- clearCart(): void
  Reset to empty state

- setShop(shopId, shopName, shopWhatsapp): void

isInCart(productId: string): boolean (selector)

---

## FILE 7.2 — src/viewModels/useShopViewModel.ts

Shop detail ViewModel:

Params: shopId string

Data fetching (TanStack Query):
- Shop data: useQuery(['shop', shopId], getShopById)
- Products: useQuery(['products', shopId],
  getProductsByShop)
- Deals: useQuery(['deals', shopId], getActiveDeals)

Derived:
- groupedProducts: Record<string, Product[]>
  Group products by category
  Sort categories by product count (most first)

- isCurrentlyOpen: boolean
  Based on shop.hours + shop.isOpen + current time
  Use isShopOpen from formatters

Functions:
- rateShop(rating: 1|2|3|4|5): Promise<void>
  Optimistic update + server call

- flagProduct(productId: string): Promise<void>
  Call productService.flagProductOutOfStock

- incrementView(): void
  Call shopService.incrementShopStat once on mount

- searchInShop(query: string): Product[]
  Filter products by query (client-side)

Return: shop, products, deals, groupedProducts,
        filteredProducts, isCurrentlyOpen,
        isLoading, error, rateShop, flagProduct,
        searchInShop, categoryList

---

## FILE 7.3 — src/components/DealCard.tsx

Deal highlight card:

Props:
- deal: Deal
- onPress?: () => void

UI:
Background: amber-50, border amber-200, rounded-xl
Left: 🏷️ icon (amber)
Center:
  Product name (bold, dark)
  "Rs. {originalPrice}" (strikethrough, gray, small)
  "Rs. {dealPrice}" (bold, amber, large)
Right: savings badge
  "Rs. {savings} بچائیں" (green bg, white text, rounded)
  "{percent}% OFF"

Bottom: "صرف آج" or expiry time (small, gray)

---

## FILE 7.4 — src/components/WhatsAppButton.tsx

Reusable WhatsApp button:

Props:
- onPress: () => void
- label?: string (default "واٹس ایپ پر آرڈر")
- size?: 'sm' | 'md' | 'lg' (default 'md')
- disabled?: boolean
- itemCount?: number (shows badge)

UI:
Color: #25D366 (WhatsApp green, always this color)
Icon: Ionicons logo-whatsapp (white)
Text: white, bold
Sizes:
  sm: py-2 px-4 text-sm rounded-xl
  md: py-3 px-6 text-base rounded-xl
  lg: py-4 px-8 text-lg rounded-2xl full width

If itemCount: show "{count} items" badge on top-right

Animation: bouncy spring scale on press (Reanimated)
Disabled: 50% opacity

---

## FILE 7.5 — app/(customer)/shop/[id].tsx

Shop detail screen (full):
Uses useLocalSearchParams() to get id.

STICKY HEADER (Animated on scroll):
Animated header that starts transparent over banner,
becomes white with shop name when scrolled down.
Back button (always visible, white → dark on scroll)
Heart button (save/unsave favourite)

BANNER (200px height):
expo-image with shop photo (or category gradient)
Gradient overlay (dark at bottom)
Over image: shop name + category badge (if not scrolled)

SCROLLABLE CONTENT:

1. SHOP INFO SECTION:
   Shop name (bold, 22px) if scrolled past banner
   Category + verified badge (if isVerified)
   Row: ⭐{rating} ({count}) | 📍{distance} |
         🟢 Open / 🔴 Closed · {open/close time}
   Open status explanation: "آج {time} تک کھلا"

2. ACTION BUTTONS ROW:
   [📞 کال] [💬 واٹس ایپ] [🗺️ راستہ]
   Three equal buttons, white cards with icon+label

3. TODAY'S DEALS (if deals exist):
   Amber section header "🔥 آج کے ڈیلز"
   Horizontal ScrollView of DealCards

4. CATALOG SECTION:
   White section with:
   Small search bar "اس دکان میں تلاش کریں"
   Category tabs (horizontal scroll)
     - All tab shows count of all products
     - Each category tab shows count
   
   Products list (FlashList by category):
   Section header per category (gray bg, small)
   Product rows:
     Product name | Price Rs.X | StockBadge | + button
     If deal: show deal price (amber) + original (strikethrough)

5. STICKY BOTTOM ORDER BAR:
   Appears when cartStore.items.length > 0
     AND cartStore.shopId === this shop's id
   "🛒 {X} چیزیں • Rs.{total}" | "آرڈر دیکھیں →"
   Animated slide up (Reanimated)

Loading: Skeleton that matches layout
Error: EmptyState with retry

---

## FILE 7.6 — src/components/OrderItem.tsx

Single item in order builder:

Props:
- item: CartItem
- onIncrement: () => void
- onDecrement: () => void
- onRemove: () => void

UI:
Container: white, rounded-xl, mb-2
Left: product name (bold) + shop name (gray small)
Center: qty controls [−] {qty} [+]
  Buttons: 32×32px circles, green border
  Count: bold, 16px, min width 24px
Right: price × qty = "Rs.{total}"

Swipe left (gesture handler):
Reveals red delete button with trash icon
Background turns red when swiping

---

## FILE 7.7 — src/viewModels/useOrderViewModel.ts

Order ViewModel:

State from cartStore + useShopViewModel

Functions:
1. addToCart(product: ProductWithShop): void
   - If different shop: show Alert.alert to confirm
     "نئی دکان سے آرڈر شروع کریں؟ پرانا آرڈر ختم ہو جائے گا"
   - [ہاں] → clearCart + add new item
   - [نہیں] → do nothing

2. buildWhatsAppMessage(): string
   Use whatsappService.buildOrderMessage

3. sendOrderViaWhatsApp(): Promise<void>
   - Validate cart not empty
   - Build order object from cart
   - Call whatsappService.openWhatsAppOrder
   - Track whatsappClicks on shop
   - Show success feedback

4. formatOrderForDisplay(): {
   items: CartItem[],
   subtotal: number,
   itemCount: number,
   shopName: string
 }

Return: all cart state + functions

---

## FILE 7.8 — app/(customer)/order.tsx

Order builder screen:

Header: "میرا آرڈر" + shop name subtitle + back

SHOP INFO BAR:
  Shop name | 📍distance | 🟢/🔴 status

ORDER ITEMS:
  FlashList of OrderItem components
  Swipe to delete (reanimated + gesture handler)

SEPARATOR LINE

PAYMENT INFO BOX (if shop has payment info):
  Gray card with:
  "💳 ادائیگی کی معلومات"
  "JazzCash: {number}" (with copy button)
  "EasyPaisa: {number}" (with copy button)
  Small text: "آرڈر کے بعد ادائیگی کریں"

ADD NOTE:
  Text input "نوٹ شامل کریں (اختیاری)"
  "گھر پر ڈیلیوری؟ خاص ہدایات؟"
  Max 200 chars, multiline, 3 lines

ORDER SUMMARY:
  Gray section:
  "چیزیں ({count})    Rs. {subtotal}"
  ─────────────────────────
  "کل    Rs. {total}" (bold)

WHATSAPP BUTTON (full width, bottom):
  WhatsAppButton (lg variant)
  "💬 واٹس ایپ پر آرڈر بھیجیں"
  Below: "آرڈر دکاندار کو واٹس ایپ پر جائے گا"

Empty cart state: EmptyState empty_orders