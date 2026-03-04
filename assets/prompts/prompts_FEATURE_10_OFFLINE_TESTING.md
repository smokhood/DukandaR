# FEATURE 10 — Offline Support & Testing

---

## FILE 10.1 — Complete Offline Implementation

Enhance src/services/offlineService.ts:

Database schema (expo-sqlite/next):
```sql
CREATE TABLE IF NOT EXISTS cached_shops (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,        -- JSON
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  geohash TEXT NOT NULL,
  cached_at INTEGER NOT NULL -- Unix timestamp
);

CREATE TABLE IF NOT EXISTS cached_searches (
  query TEXT PRIMARY KEY,
  data TEXT NOT NULL,        -- JSON
  lat REAL,
  lng REAL,
  cached_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS pending_actions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,        -- 'flag_stock', 'rate_shop', etc
  data TEXT NOT NULL,        -- JSON payload
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS user_preferences (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

Write all CRUD functions using expo-sqlite/next
synchronous API (execSync, getAllSync, runSync).
Export all functions.

---

## FILE 10.2 — Network-Aware Data Loading

Write useNetworkStatus hook:
- Uses @react-native-community/netinfo
- Returns: isConnected, isInternetReachable,
  connectionType
- Subscribes to network changes
- On reconnect: trigger data sync

Write useCachedQuery hook:
- Wraps TanStack Query
- If offline + no cache: return cached SQLite data
- If offline + has cache: return cache with stale flag
- If online: normal TanStack Query behavior
- Params: same as useQuery + cacheKey for SQLite

---

## FILE 10.3 — Pending Actions Sync

Write usePendingActionsSync:
- On app start + on network reconnect:
  - Get all pending actions from SQLite
  - Execute each one via appropriate service
  - Clear executed actions
  - Handle failures (retry max 3 times)

Actions that can be pending:
  - flag_product_stock (productId, shopId, inStock)
  - rate_shop (shopId, rating)
  - increment_shop_view (shopId)
  - toggle_product_stock (shopId, productId, inStock)

---

## FILE 10.4 — Unit Tests

### src/utils/__tests__/geohash.test.ts
```
Tests:
1. encodeGeohash(31.5204, 74.3587, 6) returns
   string of length 6
2. encodeGeohash returns consistent results
3. decodeGeohash returns approximately same coords
4. getGeohashesForRadius returns array of strings
5. precision 6 for radius < 5km
```

### src/utils/__tests__/formatters.test.ts
```
Tests:
formatDistance:
1. formatDistance(0.15) === "150 m"
2. formatDistance(1.0) === "1.0 km"
3. formatDistance(1.234) === "1.2 km"
4. formatDistance(0.001) === "1 m"

formatPrice:
1. formatPrice(1500) === "Rs. 1,500"
2. formatPrice(95) === "Rs. 95"
3. formatPrice(1000000) === "Rs. 1,000,000"

formatPhone:
1. "03001234567" → "+923001234567"
2. "+923001234567" → "+923001234567" (no change)
3. "923001234567" → "+923001234567"

isShopOpen:
1. Shop with isOpen:false returns false regardless
2. Shop in operating hours returns true
3. Shop outside hours returns false
4. 24hr shop always returns true
```

### src/utils/__tests__/whatsapp.test.ts
```
Tests:
buildOrderMessage:
1. Single item order formats correctly
2. Multiple items all appear in message
3. Total price is calculated correctly
4. Urdu greeting is present
5. Shop name is in message
6. DukandaR attribution at bottom

formatPhone for WhatsApp:
1. Pakistani number formatted correctly
2. URL encoding doesn't break the URL
```

### src/viewModels/__tests__/useOrderViewModel.test.ts
```
Using @testing-library/react-hooks:

1. Initial cart is empty
2. addItem increases cart count
3. addItem same product increments quantity
4. addItem from different shop shows warning
5. removeItem decreases cart count
6. updateQuantity to 0 removes item
7. clearCart empties everything
8. totalPrice calculates correctly
9. buildWhatsAppMessage includes all items
10. buildWhatsAppMessage shows correct total
```

### src/viewModels/__tests__/useCatalogViewModel.test.ts
```
1. Template loads for kiryana category
2. toggleItem adds item to selectedItems
3. toggleItem again removes item
4. setItemPrice updates price
5. isValid is false with < 5 items
6. isValid is false if any price is 0
7. isValid is true with 5+ items all with prices
8. completionPercent increases as items added
9. searchTemplate filters correctly
10. filterByCategory shows only that category
```

---

## FILE 10.5 — Performance Optimizations

Write these performance enhancements:

1. Image optimization in all lists:
   Wrap all expo-image with:
   - cachePolicy: 'memory-disk'
   - placeholder: blurhash
   - contentFit: 'cover'
   - recyclingKey for FlashList

2. Memoize expensive components:
   - ShopCard: React.memo with custom compare
   - ProductItem: React.memo
   - CategoryFilter: React.memo

3. FlashList optimizations:
   - Correct estimatedItemSize per list
   - keyExtractor using item.id
   - overrideItemLayout for uniform height items
   - drawDistance: 250

4. Zustand selector optimization:
   - Use shallow selector for object state
   - Avoid re-renders on unrelated state changes
   Example:
   const { items, totalPrice } = useCartStore(
     useShallow((state) => ({
       items: state.items,
       totalPrice: state.totalPrice
     }))
   );