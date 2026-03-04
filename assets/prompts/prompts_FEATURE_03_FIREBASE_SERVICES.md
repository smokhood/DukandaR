# FEATURE 03 — Firebase Setup & Core Services

## Context
DukandaR MVVM project. Services contain ONLY raw
Firebase/device calls. No state management here.
No UI logic. Pure async functions only.

---

## FILE 3.1 — src/services/firebase.ts

Write Firebase initialization:
- Import initializeApp, getAuth, getFirestore,
  getStorage from their respective Firebase packages
- Read ALL config from process.env.EXPO_PUBLIC_* variables
- Initialize Firebase app (check if already initialized
  to prevent duplicate app error)
- Enable Firestore offline persistence with
  initializeFirestore and persistentLocalCache
- Export: app, auth, db, storage
- Export Firestore helpers: collection, doc,
  getDocs, getDoc, addDoc, setDoc, updateDoc,
  deleteDoc, query, where, orderBy, limit,
  onSnapshot, Timestamp, GeoPoint, serverTimestamp,
  writeBatch, increment

---

## FILE 3.2 — src/utils/geohash.ts

Write complete geohash utility from scratch
(do NOT use any external geohash library):

Functions needed:
1. encodeGeohash(lat: number, lng: number,
                 precision: number = 6): string
   - Encode GPS coords to geohash string
   - Base32 encoding: '0123456789bcdefghjkmnpqrstuvwxyz'

2. decodeGeohash(geohash: string):
   { lat: number, lng: number }
   - Decode geohash back to coordinates

3. getNeighbors(geohash: string): string[]
   - Get 8 surrounding geohash cells

4. getGeohashesForRadius(lat: number, lng: number,
   radiusKm: number): string[]
   - Returns array of geohash prefixes that cover
     the given radius from center point
   - Precision 5 for >5km, precision 6 for <5km

5. geohashPrecisionForRadius(radiusKm: number): number
   - Returns appropriate precision for radius

Export all functions with TypeScript types.
Add JSDoc explaining geohash concept briefly.

---

## FILE 3.3 — src/utils/formatters.ts

Write pure formatting utility functions:

1. formatDistance(km: number): string
   - < 1km → "X m" (e.g. "150 m")
   - >= 1km → "X.X km" (e.g. "1.2 km")

2. formatPrice(amount: number): string
   - Returns "Rs. 1,500" format with commas

3. formatPhone(phone: string): string
   - Input: "03001234567" or "+923001234567"
   - Output: "+923001234567" (E.164 format)

4. formatPhoneDisplay(phone: string): string
   - Output: "0300-1234567" (display format)

5. formatTime(time: string): string
   - Input: "09:00" (24hr)
   - Output: "9:00 AM"

6. formatTimeAgo(date: Date | Timestamp): string
   - "Just now", "2 min ago", "1 hour ago",
     "Yesterday", "3 days ago", "2 weeks ago"

7. formatDate(date: Date | Timestamp): string
   - "March 4, 2026"

8. formatSavings(original: number,
                 deal: number): string
   - "Save Rs. 200 (15% off)"

9. isShopOpen(hours: ShopHours,
              isOpen: boolean): boolean
   - Check if shop is currently open based on
     hours + manual toggle + current time

10. truncateText(text: string,
                 maxLength: number): string

---

## FILE 3.4 — src/utils/validators.ts

Write Zod validation schemas:

1. pakistaniPhoneSchema
   - Must start with 03 or +923
   - Exactly 11 digits (03XX) or 13 chars (+923XX)
   - Error: "Valid Pakistani number daalen (03XX-XXXXXXX)"

2. otpSchema
   - Exactly 6 digits
   - Numbers only
   - Error: "6 digit OTP daalen"

3. shopNameSchema
   - 3-60 characters
   - Trimmed

4. ownerNameSchema
   - 2-50 characters
   - Trimmed

5. priceSchema
   - Positive number
   - Max 999999 (PKR)
   - Integer or float with max 2 decimal places

6. searchQuerySchema
   - 2-100 characters
   - Trimmed
   - No HTML/script injection

7. shopRegistrationSchema (combine above):
   - name: shopNameSchema
   - ownerName: ownerNameSchema
   - whatsapp: pakistaniPhoneSchema
   - category: z.enum([...ShopCategory values])
   - address: z.string().min(5).max(200)
   - city: z.string().min(2).max(50)
   - area: z.string().min(2).max(100)
   - openTime: z.string() (HH:MM format)
   - closeTime: z.string() (HH:MM format)

8. dealSchema:
   - productName: z.string().min(2).max(100)
   - originalPrice: priceSchema
   - dealPrice: priceSchema (must be less than original)
   - note: z.string().max(200).optional()

---

## FILE 3.5 — src/services/locationService.ts

Write expo-location service:

1. requestLocationPermission():
   Promise<'granted' | 'denied' | 'blocked'>
   - Request foreground location permission
   - Return status

2. getCurrentLocation():
   Promise<{ lat: number, lng: number } | null>
   - Use Location.getCurrentPositionAsync
   - accuracy: Location.Accuracy.Balanced
   - timeout: 10000ms
   - Return null if fails

3. watchLocation(
   callback: (loc: {lat, lng}) => void
   ): Promise<Location.LocationSubscription>
   - Watch for location updates (for real-time)

4. getAreaFromCoords(lat: number, lng: number):
   Promise<string>
   - Reverse geocode using Location.reverseGeocodeAsync
   - Return: "Gulberg, Lahore" format
   - Fallback: "Your Location"

5. calculateDistance(lat1: number, lng1: number,
   lat2: number, lng2: number): number
   - Haversine formula, return km as float

6. formatDistance(km: number): string
   - Reuse from formatters.ts

---

## FILE 3.6 — src/services/shopService.ts

Write Firestore shop service:

1. getShopsNearby(
   lat: number,
   lng: number,
   radiusKm: number = 2
   ): Promise<Shop[]>
   - Get geohash range for radius
   - Query Firestore: where geohash >= lower
     AND geohash <= upper AND isActive == true
   - Filter results by actual distance (post-query)
   - Sort by distance ascending
   - Limit 50 results

2. getShopById(shopId: string): Promise<Shop | null>
   - Get single shop document

3. createShop(
   shopData: Omit<Shop, 'id' | 'createdAt' | 'updatedAt'
   | 'rating' | 'ratingCount' | 'totalViews'
   | 'todayViews' | 'whatsappClicks'>
   ): Promise<string>
   - Add to Firestore shops collection
   - Return new shopId

4. updateShop(
   shopId: string,
   updates: Partial<Shop>
   ): Promise<void>

5. toggleShopOpen(
   shopId: string,
   isOpen: boolean
   ): Promise<void>

6. incrementShopStat(
   shopId: string,
   stat: 'totalViews' | 'todayViews' | 'whatsappClicks'
   ): Promise<void>
   - Use Firestore increment() to avoid race conditions

7. uploadShopPhoto(
   shopId: string,
   imageUri: string
   ): Promise<string>
   - First compress: expo-image-manipulator
     resize to max 800px width, quality 0.8
   - Upload to Firebase Storage:
     path: shops/{shopId}/photo.jpg
   - Return download URL

8. rateShop(
   shopId: string,
   rating: number
   ): Promise<void>
   - Use Firestore transaction to update
     rating (weighted average) and ratingCount

9. getShopByOwnerId(
   ownerId: string
   ): Promise<Shop | null>
   - Query shops where ownerId == uid

---

## FILE 3.7 — src/services/productService.ts

Write product service:

1. searchProductsNearby(
   query: string,
   lat: number,
   lng: number,
   radiusKm: number = 2
   ): Promise<ProductWithShop[]>
   - Step 1: Get nearby shop IDs (use shopService)
   - Step 2: For each shop, query its products
     where name contains query (case-insensitive)
   - Step 3: Filter out of stock items (optional,
     based on filter param)
   - Step 4: Attach shop info to each product
   - Step 5: Calculate isCheapestNearby and
     isNearestWithStock flags
   - Step 6: Sort by distance
   - Record search in searches collection
   - Return ProductWithShop[]

   Note: Firestore doesn't support full-text search.
   Use array-contains with pre-generated search tokens,
   OR fetch all products from nearby shops and
   filter client-side for MVP.

2. getProductsByShop(shopId: string): Promise<Product[]>
   - Get all active products for a shop

3. getProductsByCategory(
   shopId: string,
   category: ProductCategory
   ): Promise<Product[]>

4. addProduct(
   shopId: string,
   product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'
   | 'flagCount' | 'searchCount'>
   ): Promise<string>

5. bulkAddProducts(
   shopId: string,
   products: Array<Omit<Product, 'id' | 'createdAt' |
   'updatedAt' | 'flagCount' | 'searchCount'>>
   ): Promise<void>
   - Use Firestore writeBatch (max 500 per batch)

6. updateProductPrice(
   shopId: string,
   productId: string,
   price: number
   ): Promise<void>

7. toggleProductStock(
   shopId: string,
   productId: string,
   inStock: boolean
   ): Promise<void>
   - Also update stockStatus and stockVerifiedAt

8. flagProductOutOfStock(
   shopId: string,
   productId: string,
   userId: string
   ): Promise<void>
   - Increment flagCount
   - If flagCount >= 3: set stockStatus to 'unverified'
   - Prevent same user flagging twice

9. confirmProductStock(
   shopId: string,
   productId: string,
   inStock: boolean
   ): Promise<void>
   - Owner confirms stock
   - Reset flagCount to 0
   - Update stockVerifiedAt
   - Update inStock and stockStatus

10. recordSearch(
    query: string,
    lat: number,
    lng: number,
    nearbyShopIds: string[]
    ): Promise<void>
    - Save to searches collection for demand tracking
    - Increment searchCount on matched products

11. getDemandAlerts(shopId: string):
    Promise<DemandAlert[]>
    - Query searches where shopId in nearbyShopIds
    - Group by product name
    - Return top 5 most searched

---

## FILE 3.8 — src/services/dealService.ts

Write deals service:

1. getActiveDeals(shopId: string): Promise<Deal[]>
   - Get deals where expiresAt > now AND isActive true
   - Order by createdAt desc

2. getDealsNearby(
   lat: number,
   lng: number,
   radiusKm: number
   ): Promise<Deal[]>
   - Get nearby shop IDs first
   - Then get active deals for those shops

3. createDeal(
   shopId: string,
   deal: Omit<Deal, 'id' | 'createdAt' | 'savingsAmount'
   | 'savingsPercent'>
   ): Promise<string>
   - Calculate savingsAmount and savingsPercent
   - Add to Firestore

4. deleteDeal(shopId: string, dealId: string):
   Promise<void>

---

## FILE 3.9 — src/services/whatsappService.ts

Write WhatsApp service:

1. buildOrderMessage(order: Order): string
   Format:
   "Assalam o Alaikum! 🛒

   Mera Order (DukandaR se):
   ─────────────────────
   • [Product Name] x[qty] — Rs.[price]
   • [Product Name] x[qty] — Rs.[price]
   ─────────────────────
   Total: Rs.[total]

   [Note if any]

   📱 DukandaR App se bheja gaya"

2. openWhatsAppOrder(order: Order): Promise<void>
   - Build message
   - Encode URI component
   - Try: Linking.openURL('whatsapp://send?phone=
     {phone}&text={message}')
   - Fallback: Linking.openURL('https://wa.me/
     {phone}?text={message}')

3. isWhatsAppInstalled(): Promise<boolean>
   - Linking.canOpenURL('whatsapp://send')

4. shareShopLink(shop: Shop): Promise<void>
   - Build deep link: dukandar://shop/{shop.id}
   - Message: "Dekho {shop.name} DukandaR pe!
     Yahan se unka catalog dekho aur order karo:
     dukandar://shop/{shop.id}"
   - Use expo-sharing

---

## FILE 3.10 — src/services/notificationService.ts

Write notification service:

1. requestPermission(): Promise<boolean>

2. getExpoPushToken(): Promise<string | null>
   - For Expo Go: returns null (push not supported)
   - For dev build: returns token

3. scheduleLocalNotification(
   title: string,
   body: string,
   trigger: Date | number
   ): Promise<string>
   - Returns notification identifier

4. scheduleDealAlert(deal: Deal): Promise<void>
   - Schedule immediate local notification
   - Title: "🔥 Aaj Ka Deal!"
   - Body: "{shopName}: {product} sirf Rs.{price}"

5. scheduleStockReminderForOwner(
   productName: string,
   searchCount: number
   ): Promise<void>
   - Title: "🔍 Customers Dhundh Rahe Hain"
   - Body: "{count} log {product} dhundh rahe hain
     aapke qareeb. Kya aapke paas hai?"

6. cancelNotification(id: string): Promise<void>

7. cancelAllNotifications(): Promise<void>

---

## FILE 3.11 — src/services/offlineService.ts

Write SQLite offline cache service:

1. initDB(): void
   Create tables if not exist:
   - cached_shops: id, data(JSON), lat, lng,
     geohash, cached_at
   - cached_searches: query, data(JSON), cached_at
   - pending_actions: id, type, data(JSON), created_at

2. cacheShops(shops: Shop[]): void
   Upsert shops to local DB

3. getCachedShopsNearby(
   lat: number,
   lng: number,
   radiusKm: number
   ): Shop[]
   Return shops within radius from cache

4. cacheSearchResult(
   query: string,
   results: ProductWithShop[]
   ): void

5. getCachedSearchResult(
   query: string
   ): ProductWithShop[] | null
   Return null if older than 2 hours

6. clearOldCache(): void
   Delete cache older than 24 hours

7. getPendingActions(): PendingAction[]
   Get unsynced actions for when back online

8. clearPendingAction(id: string): void

---

## FILE 3.12 — firestore.rules

Write complete Firestore security rules:
- shops: public read, only owner can write
- shops/products: public read, owner write
- shops/deals: public read, owner write
- users/{userId}: only that user can read/write
- searches: authenticated create only, no read
- All rules require isActive checks where relevant
- Validate data shapes on write where possible