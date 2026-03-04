# FEATURE 09 — Favourites, Notifications & Onboarding

---

## FILE 9.1 — src/viewModels/useFavouritesViewModel.ts

Favourites ViewModel:

State:
- favouriteShops: ShopWithDistance[]
- isLoading: boolean

On mount:
- Get user's savedShops array from Firestore
- Fetch each shop by ID
- Add distance to each

Functions:
1. toggleFavourite(shopId: string): Promise<void>
   Optimistic update:
   - Immediately update local state
   - Update Firestore users/{userId}.savedShops
   - Roll back on error

2. isFavourite(shopId: string): boolean
   Check if shopId in savedShops array

3. removeFavourite(shopId: string): Promise<void>

Return: favouriteShops, isLoading, toggleFavourite,
        isFavourite, isEmpty

---

## FILE 9.2 — app/(customer)/favourites.tsx

Favourites screen:

HEADER: "پسندیدہ دکانیں" with count badge

If loading: 3 × ShopCardSkeleton

If empty: EmptyState empty_favourites
  "❤️ کوئی پسندیدہ دکان نہیں"
  "دکانوں کو ❤️ دبا کر save کریں"
  [دکانیں ڈھونڈیں] button → navigate to home

If has favourites:
  FlashList of ShopCards (full variant)
  Swipe left: remove from favourites
    Red "ہٹائیں" button revealed
    Confirmation not needed (easy to re-add)

  Pull to refresh

---

## FILE 9.3 — app/(customer)/notifications.tsx

Notifications screen:

HEADER: "اطلاعات" + "سب پڑھا" button (if unread exist)

Grouped by:
  "آج" section
  "اس ہفتہ" section
  "پرانی" section

Each notification row:
  Icon (based on type, colored)
  Title (bold if unread)
  Body text (gray)
  Time ago (right, small)
  Unread: blue dot left + slightly darker bg

  Tap: navigate to relevant screen
    new_deal → shop detail
    shop_opened → shop detail
    new_shop → home (centered on new shop)

  Swipe left: delete notification

Empty state: 🔔 "کوئی اطلاع نہیں"

---

## FILE 9.4 — Onboarding Screens

Create one-time onboarding flow.

### app/(onboarding)/_layout.tsx
Stack layout, no header, shown only once.
After completion: mark onboarded in secure store.

### app/(onboarding)/index.tsx
3-slide onboarding:

SLIDE 1:
  Illustration: Map with shop pins (using Ionicons)
  "اپنی گلی کی دکانیں ڈھونڈیں" (bold, large)
  "گھر کے قریب کی تمام دکانیں ایک جگہ دیکھیں"
  Green progress dots (1 of 3)

SLIDE 2:
  Illustration: Search icon + product items
  "قیمت موازنہ کریں" (bold, large)
  "ایک ہی چیز مختلف دکانوں میں کتنے کی ہے؟
   بہترین قیمت پر خریدیں"
  Progress dots (2 of 3)

SLIDE 3:
  Illustration: WhatsApp icon + order message
  "واٹس ایپ پر آرڈر کریں" (bold, large)
  "دکاندار کو براہ راست واٹس ایپ پر
   تیار پیغام بھیجیں"
  Progress dots (3 of 3)

NAVIGATION:
  [چھوڑیں] (top right, gray, all slides except last)
  [اگلا →] (primary button, slides 1-2)
  [شروع کریں ✓] (primary button, slide 3)

Bottom: Language toggle (English/اردو)

Slide animation: horizontal swipe (Reanimated FlatList)
Also swipeable via gesture.

Mark onboarded in SecureStore on completion/skip.

---

## FILE 9.5 — Share Shop Feature

Add to shop detail screen and owner dashboard:

Share button:
- Generates deep link: "dukandar://shop/{id}"
- Opens system share sheet with message:
  "{shopName} DukandaR pe hai!\n
   آن لائن کیٹلاگ دیکھیں اور واٹس ایپ پر آرڈر کریں:\n
   dukandar://shop/{id}\n\n
   DukandaR App: https://play.google.com/..."
- Uses expo-sharing

---

## FILE 9.6 — Rate Shop Feature

After customer taps WhatsApp order button,
show rating prompt after 30 seconds delay
(assuming order was completed):

RatingSheet (bottom sheet):
  "Ali Bhai Kiryana کو ریٹ کریں"
  5 star selector (tap to select)
  Optional note text input (brief)
  [جمع کروائیں] button
  [بعد میں] dismiss option

Only show once per shop per user.
Track rated shops in SecureStore.