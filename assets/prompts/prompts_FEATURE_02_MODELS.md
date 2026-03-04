# FEATURE 02 — TypeScript Data Models

## Context
DukandaR project. MVVM architecture. Models are
TypeScript interfaces ONLY — no classes, no methods,
no business logic. Just data shapes.

Write each file completely with:
- All interfaces/types exported
- JSDoc comments on each field
- Use strict TypeScript (no 'any')
- Use Timestamp from firebase/firestore for dates

---

## FILE 2.1 — src/models/User.ts

Write User model with:

```
UserRole = 'customer' | 'owner'

User {
  id: string                    // Firebase Auth UID
  phone: string                 // +923XXXXXXXXX format
  name: string                  // Display name
  role: UserRole
  shopId: string | null         // Only if owner
  savedShops: string[]          // Shop IDs (customer)
  isOnboarded: boolean          // Seen onboarding?
  preferredLanguage: 'en' | 'ur'
  createdAt: Timestamp
  updatedAt: Timestamp
}

AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isOnboarded: boolean
}

OTPState {
  phoneNumber: string
  confirmationResult: any       // Firebase confirmation
  otpSent: boolean
  isVerifying: boolean
  error: string | null
  countdown: number             // Resend timer
}
```

---

## FILE 2.2 — src/models/Shop.ts

Write Shop model with:

```
ShopCategory = 'kiryana' | 'pharmacy' | 'sabzi' |
  'bakery' | 'mobile' | 'clothing' | 'hardware' |
  'beauty' | 'restaurant' | 'other'

ShopLocation {
  latitude: number
  longitude: number
  geohash: string               // For radius queries
  address: string               // Full address string
  area: string                  // Neighbourhood name
  city: string
}

ShopHours {
  openTime: string              // "09:00" (24hr)
  closeTime: string             // "23:00" (24hr)
  isOpen24Hours: boolean
}

ShopPayment {
  jazzCashNumber: string | null
  easyPaisaNumber: string | null
  bankAccount: string | null
}

Shop {
  id: string
  name: string
  ownerName: string
  ownerId: string               // Firebase Auth UID
  category: ShopCategory
  whatsapp: string              // +923XXXXXXXXX
  phone: string | null
  location: ShopLocation
  photoUrl: string | null
  isOpen: boolean               // Manual toggle
  hours: ShopHours
  payment: ShopPayment
  rating: number                // 0-5, float
  ratingCount: number
  totalViews: number
  todayViews: number
  whatsappClicks: number
  isVerified: boolean           // Admin verified
  isActive: boolean             // Not deleted
  createdAt: Timestamp
  updatedAt: Timestamp
}

ShopWithDistance extends Shop {
  distanceKm: number
  distanceLabel: string         // "150 m" or "1.2 km"
  isCurrentlyOpen: boolean      // Based on time + toggle
}

ShopStats {
  shopId: string
  viewsToday: number
  viewsThisWeek: number
  whatsappClicksToday: number
  savedByCount: number
  topSearchedProducts: string[]
}

DemandAlert {
  productName: string
  searchCount: number
  message: string               // "18 log X dhundh rahe..."
  lastSearchedAt: Timestamp
}
```

---

## FILE 2.3 — src/models/Product.ts

Write Product model with:

```
StockStatus = 'in_stock' | 'out_of_stock' | 'unverified'

ProductCategory = 'atta_rice' | 'oil_ghee' | 'dairy' |
  'sugar_salt' | 'tea_drinks' | 'soap_hygiene' |
  'pulses' | 'spices' | 'snacks' | 'cleaning' |
  'medicines' | 'vitamins' | 'vegetables' | 'fruits' |
  'bread_baked' | 'electronics' | 'other'

Product {
  id: string
  shopId: string
  name: string                  // "Lux Soap 135g"
  nameUrdu: string | null       // "لکس صابن"
  category: ProductCategory
  price: number                 // PKR
  unit: string                  // "piece"/"kg"/"litre"
  inStock: boolean
  stockStatus: StockStatus
  stockVerifiedAt: Timestamp | null
  flagCount: number             // Community out-of-stock flags
  searchCount: number           // Times searched near this shop
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

ProductWithShop extends Product {
  shop: ShopWithDistance
  isCheapestNearby: boolean
  isNearestWithStock: boolean
}

SearchResult {
  query: string
  products: ProductWithShop[]
  totalShops: number
  radiusKm: number
  searchedAt: Date
}

ShopWithProducts {
  shop: ShopWithDistance
  matchedProducts: Product[]
  totalMatchCount: number
  hasAllItems: boolean          // For multi-item search
  missingItems: string[]
  estimatedTotal: number
}

TemplateItem {
  id: string
  name: string                  // English
  nameUrdu: string              // Urdu
  category: ProductCategory
  unit: string
  suggestedPrice: number        // PKR suggestion
}
```

---

## FILE 2.4 — src/models/Order.ts

Write Order model with:

```
CartItem {
  productId: string
  productName: string
  productNameUrdu: string | null
  price: number
  quantity: number
  unit: string
  shopId: string
  shopName: string
  shopWhatsapp: string
}

Order {
  id: string
  items: CartItem[]
  shopId: string
  shopName: string
  shopWhatsapp: string
  subtotal: number
  note: string | null
  createdAt: Date
}

CartState {
  items: CartItem[]
  shopId: string | null
  shopName: string
  shopWhatsapp: string
  note: string
}
```

---

## FILE 2.5 — src/models/Deal.ts

Write Deal model with:

```
Deal {
  id: string
  shopId: string
  shopName: string
  productId: string | null      // null if custom deal
  productName: string
  originalPrice: number
  dealPrice: number
  savingsAmount: number         // calculated
  savingsPercent: number        // calculated
  note: string | null           // "Fresh stock!"
  expiresAt: Timestamp
  isActive: boolean
  createdAt: Timestamp
}
```

---

## FILE 2.6 — src/models/Notification.ts

Write Notification model with:

```
NotificationType =
  | 'new_deal'          // Favourite shop has deal
  | 'shop_opened'       // Favourite shop just opened
  | 'demand_alert'      // Owner: people searching product
  | 'stock_request'     // Owner: confirm stock
  | 'new_shop_nearby'   // New shop opened near customer
  | 'system'            // App updates/announcements

AppNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  shopId: string | null
  productName: string | null
  read: boolean
  actionUrl: string | null      // Deep link
  createdAt: Timestamp
}
```