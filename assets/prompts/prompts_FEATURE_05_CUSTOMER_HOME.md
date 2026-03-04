# FEATURE 05 — Customer Home Screen & Location

## Context
DukandaR customer-facing home screen. This is the
first screen customers see after login. Search is
the PRIMARY feature — not the map.

---

## FILE 5.1 — src/store/locationStore.ts

Zustand location store:
State:
- location: { lat: number, lng: number } | null
- area: string (e.g. "Gulberg, Lahore")
- city: string
- radius: number (default: 2, in km)
- permissionStatus: 'unknown'|'granted'|'denied'|'blocked'
- isLocating: boolean

Actions:
- setLocation(lat, lng): void
- setArea(area: string, city: string): void
- setRadius(km: number): void
- setPermissionStatus(status): void
- setLocating(loading: boolean): void

Persist radius preference to AsyncStorage.

---

## FILE 5.2 — src/viewModels/useLocationViewModel.ts

Location ViewModel:

On mount:
1. Check current permission status
2. If granted: get location immediately
3. If unknown: request permission
4. If denied: show permission denied UI

Functions:
- requestPermission(): Promise<void>
  Call locationService.requestLocationPermission
  Update store

- refreshLocation(): Promise<void>
  Get fresh GPS coordinates
  Reverse geocode to area name
  Update locationStore

- setManualArea(area: string): void
  For when user types area instead of GPS

Return:
- location, area, city, radius
- permissionStatus, isLocating
- requestPermission, refreshLocation, setManualArea
- hasLocation: boolean (location !== null)

---

## FILE 5.3 — src/viewModels/useSearchViewModel.ts

Search ViewModel:

State:
- query: string
- searchResults: ProductWithShop[]
- groupedByShop: ShopWithProducts[]
- isLoading: boolean
- error: string | null
- hasSearched: boolean
- recentSearches: string[]
- activeFilter: 'nearest'|'cheapest'|'best_rated'
- showOpenOnly: boolean

On init:
- Load recentSearches from SQLite

Functions:
1. setQuery(text: string): void
   - Update query state
   - Debounce 400ms
   - Auto-search if >= 2 chars

2. search(query: string): Promise<void>
   - Call productService.searchProductsNearby
   - Save to recentSearches (max 5)
   - Handle no results
   - Filter by showOpenOnly if true

3. sortResults(filter): void
   - nearest: sort by distanceKm
   - cheapest: sort by price
   - best_rated: sort by shop.rating

4. clearSearch(): void

5. removeRecentSearch(query: string): void

6. getShopsNearby(): Promise<void>
   - Load all shops (no product filter)
   - Used for home screen before search

trendingSearches (hardcoded):
['Lux Soap', 'Atta 10kg', 'Panadol',
 'Eggs', 'Doodh', 'Dettol', 'Surf Excel',
 'Cooking Oil', 'Sugar', 'Chawal']

---

## FILE 5.4 — src/components/SearchBar.tsx

Professional search bar:

Props:
- value: string
- onChangeText: (text: string) => void
- onSubmit: (text: string) => void
- onClear: () => void
- placeholder?: string (default from i18n)
- autoFocus?: boolean
- editable?: boolean

UI:
- Container: white, rounded-2xl, shadow-sm,
  horizontal padding
- Left: search icon (Ionicons search, green #16a34a)
- TextInput: flex-1, no border, gray placeholder
- Right: X button (only when text.length > 0)
  - Ionicons close-circle, gray
  - Tap clears text + calls onClear

Animations:
- Scale from 0.98 to 1.0 when focused (Reanimated spring)
- Subtle shadow increase on focus

---

## FILE 5.5 — src/components/CategoryFilter.tsx

Horizontal scrollable category filter:

Props:
- selected: string ('all' or category id)
- onSelect: (id: string) => void
- showAll?: boolean (default true)

UI:
- Horizontal ScrollView, no scroll indicator
- First item: "All" / "سب" with grid icon
- Then map over CATEGORIES from constants
- Each pill:
  Icon (Ionicons) + category name
  Selected: green bg, white text, green border
  Unselected: white bg, gray text, gray border
  Rounded-full, padding h-2 px-4
  Margin right 8px between pills

Animation:
- Selected pill: spring scale animation
- Animated horizontal scroll to selected item

---

## FILE 5.6 — src/components/ShopCard.tsx

Shop result card:

Props:
- shop: ShopWithDistance
- onPress: () => void
- onWhatsAppPress: () => void
- variant?: 'full' | 'compact' (default 'full')

Full variant UI:
Container: white, rounded-2xl, shadow-sm,
margin-bottom 12px

Left: Shop photo or category icon placeholder
  - expo-image with blurhash
  - 80×80px, rounded-xl
  - If no photo: category color bg + icon

Right content:
  - Shop name (bold, dark, 16px)
  - Category badge (small pill, category color)
  - Row: ⭐ rating | 📍 distance | 🟢/🔴 open status
  - If deals: "🔥 2 deals today" amber text

Bottom row:
  - Open status: "Open until 11pm" or "Closed"
  - WhatsApp button (compact, right side)

Compact variant:
  Horizontal card, smaller, for horizontal lists

Press animation: scale 0.97 (Reanimated spring)

---

## FILE 5.7 — src/components/EmptyState.tsx

Reusable empty state:

Props:
- variant: 'no_results' | 'no_shops' | 'offline'
  | 'permission_denied' | 'empty_favourites'
  | 'empty_catalog' | 'empty_orders'
- title?: string (override default)
- subtitle?: string (override default)
- actionLabel?: string
- onAction?: () => void

Each variant has:
- Large Ionicons icon (80px, light gray)
- Title (bold, dark)
- Subtitle (gray, centered, max width)
- Optional action button (green outline)

Defaults per variant:
- no_results: 🔍 "کچھ نہیں ملا" "دوسرے الفاظ آزمائیں"
- no_shops: 🏪 "قریب کوئی دکان نہیں" "علاقہ بدلیں"
- offline: 📴 "انٹرنیٹ نہیں" "پرانا ڈیٹا دکھا رہے ہیں"
- permission_denied: 📍 "لوکیشن کی اجازت دیں"
- empty_favourites: ❤️ "کوئی پسندیدہ دکان نہیں"

---

## FILE 5.8 — src/components/SkeletonLoader.tsx

Skeleton loading components using Reanimated:

1. Base Skeleton component:
   - Animated shimmer effect (translateX)
   - LinearGradient from transparent → white → transparent
   - Color: #e5e7eb (gray-200)

2. ShopCardSkeleton:
   - Matches ShopCard dimensions
   - Animated gray blocks for: photo, name, badges, row

3. ProductItemSkeleton:
   - Matches ProductItem dimensions
   - Gray blocks for: name, price, badge, shop name

4. DashboardSkeleton:
   - 3 stat card skeletons
   - 2 demand alert skeletons

Export all as named exports.

---

## FILE 5.9 — app/(customer)/_layout.tsx

Customer bottom tab navigator:

Tabs:
1. index → icon: search, label: "تلاش"
2. favourites → icon: heart, label: "پسندیدہ"
3. notifications → icon: notifications, label: "اطلاعات"

Tab bar style:
- backgroundColor: white
- borderTopWidth: 1, borderTopColor: #e5e7eb
- paddingBottom: safe area inset
- activeTintColor: #16a34a (primary green)
- inactiveTintColor: #9ca3af (gray)

Badge: show unread count on notifications tab

Header: hidden (we have custom headers)

---

## FILE 5.10 — app/(customer)/index.tsx

Customer home screen (main screen):

Header:
- Left: 📍 area name (tap to change location)
  "Gulberg, Lahore ▼"
- Right: language toggle icon

Body (ScrollView with stickyHeaderIndices):

STICKY SEARCH BAR:
  SearchBar component (full width)
  Below: radius selector "2 km ▼" (small, right aligned)

SECTION — Trending (shown when no query):
  "🔥 آج کیا ڈھونڈ رہے ہیں؟" heading
  Horizontal scroll of trending search chips
  Each chip: tap → fills search + triggers search

SECTION — Categories (shown when no query):
  "دکانوں کی اقسام" heading
  CategoryFilter component

SECTION — Shops Near You (shown when no query):
  "آپ کے قریب دکانیں ({count})" heading
  [Map View] [List View] toggle buttons

  List View: FlashList of ShopCards
    - estimatedItemSize: 120
    - Pull to refresh
    - Load 10 initially, load more on end

  Map View: react-native-maps
    - Center on user location
    - Shop markers (custom marker with category icon)
    - Tap marker → show shop name callout
    - Tap callout → navigate to shop detail

SEARCH RESULTS (shown when query exists):
  Navigate to /results screen with query param

Handle states:
- Location loading: show SkeletonLoader × 5
- Permission denied: EmptyState permission_denied
- No shops: EmptyState no_shops
- Offline: OfflineBanner + show cached shops