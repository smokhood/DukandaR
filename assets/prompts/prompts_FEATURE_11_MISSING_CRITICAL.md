# FEATURE 11 — Critical Missing Pieces

---

## FILE 11.1 — Deep Linking Setup

Configure deep links so sharing a shop works:

1. Update app.json with deep link config (already in 1.2)

2. Write src/utils/deepLinks.ts:
   - buildShopLink(shopId: string): string
     Returns: "dukandar://shop/{shopId}"
   - buildProductSearchLink(query: string): string
     Returns: "dukandar://search?q={query}"
   - parseDeepLink(url: string): DeepLinkResult
     Returns: { type, shopId?, query? }

3. Write deep link handler in app/_layout.tsx:
   - Use expo-linking useURL hook
   - Parse incoming URLs
   - Navigate to correct screen
   - Handle app not yet loaded (queue navigation)

4. Add share functionality:
   - In ShopCard: share icon
   - In shop detail: share button
   - Uses shareShopLink from whatsappService

---

## FILE 11.2 — Error Boundary & Global Error Handling

1. Write src/components/ErrorBoundary.tsx:
   Class component (required for error boundaries)
   - Catches JS errors in child components
   - Shows friendly error screen:
     Large ⚠️ icon
     "کچھ غلط ہو گیا" heading
     "ایپ کو دوبارہ شروع کریں" subtitle
     [دوبارہ کوشش کریں] button (resets error state)
   - Log to Sentry if available

2. Write useErrorHandler hook:
   - Consistent error message extraction
   - Firebase error codes → Urdu messages:
     auth/invalid-phone-number →
       "موبائل نمبر درست نہیں"
     auth/invalid-verification-code →
       "OTP غلط ہے"
     auth/too-many-requests →
       "بہت زیادہ کوششیں، کچھ دیر بعد آزمائیں"
     unavailable → "انٹرنیٹ چیک کریں"
     permission-denied → "اجازت نہیں"
   - Returns: { message, isNetworkError, isAuthError }

3. Global TanStack Query error handler:
   In QueryClientProvider:
   onError callback → useErrorHandler
   Show toast/snackbar for errors

---

## FILE 11.3 — Delete Account Flow

Required by Google Play Store:

In owner/customer settings screen:

"اکاؤنٹ ڈیلیٹ کریں" option (red text, at bottom)

Confirmation flow:
Step 1 Alert:
  "کیا آپ واقعی اکاؤنٹ ڈیلیٹ کرنا چاہتے ہیں؟"
  "یہ عمل واپس نہیں ہو سکتا"
  [ہاں، ڈیلیٹ کریں] (red) [نہیں] (gray)

Step 2 (if confirmed):
  - If owner: delete shop document + all products
  - Delete user document from Firestore
  - Delete Firebase Auth account
  - Clear all SecureStore data
  - Clear SQLite database
  - Navigate to role-select screen

Write deleteAccount function in useAuthViewModel.

---

## FILE 11.4 — Settings Screens

### app/(customer)/settings.tsx (add to customer tabs or nav)
- Profile: name, phone (display only)
- Language: [English] [اردو] toggle
- Notifications: on/off toggle
- Search radius: slider (500m to 10km)
- Clear search history button
- Privacy policy link
- Terms of service link
- "اکاؤنٹ ڈیلیٹ کریں" (danger)
- App version at bottom

### app/(owner)/shop-settings.tsx
- All shop registration fields (editable)
- Payment info (JazzCash/EasyPaisa numbers)
- Language toggle
- Share shop link
- View as customer → opens shop detail
- Notification preferences
- "اکاؤنٹ ڈیلیٹ کریں" (danger)

---

## FILE 11.5 — Pagination with useInfiniteQuery

Refactor shop and product lists to use pagination:

Write usePaginatedShops hook:
- Uses useInfiniteQuery
- pageSize: 10 shops per page
- getNextPageParam: last document snapshot
  (Firestore cursor pagination)
- Flattens pages for FlashList
- onEndReached: fetchNextPage

Write usePaginatedSearchResults hook:
- Similar but for product search
- pageSize: 15 products per page

Update FlashList components to use:
- onEndReached={() => fetchNextPage()}
- onEndReachedThreshold={0.5}
- ListFooterComponent: loading spinner if
  isFetchingNextPage

---

## FILE 11.6 — Keyboard Avoiding & Input UX

Add KeyboardAvoidingView to ALL screens with inputs:
- OTP screen
- Shop registration form
- Order note input
- Add deal form
- Catalog price inputs

Pattern:
```tsx
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
  keyboardVerticalOffset={headerHeight}
>
  <ScrollView keyboardShouldPersistTaps="handled">
    {/* content */}
  </ScrollView>
</KeyboardAvoidingView>
```

Also add:
- returnKeyType="next" chaining between inputs
  (next input auto-focuses on submit)
- returnKeyType="done" on last input
- Dismiss keyboard on background tap

---

## FILE 11.7 — App Update Prompt

Write useAppVersion hook:
- Fetch minimum required version from Firestore
  config/appConfig document: { minVersion: "1.0.0" }
- Compare with current app version (from app.json)
- If current < minimum: show non-dismissable modal:
  "نئی اپڈیٹ ضروری ہے"
  "بہتر تجربے کے لیے ایپ اپڈیٹ کریں"
  [Google Play پر جائیں] → opens Play Store link

---

## FILE 11.8 — Sentry Error Monitoring (Optional)

Write src/services/sentryService.ts:
- Initialize Sentry with DSN from env
- Only active in production (not dev)
- Set user context on login (userId, role)
- Clear context on logout
- Custom error capture with context:
  captureError(error, context?: object): void

Add to app/_layout.tsx:
- Wrap root with Sentry.wrap()
- Initialize on app start

Add to each ViewModel:
- Wrap async functions in try/catch
- On catch: captureError(error, { screen, action })

---

## FILE 11.9 — Production Readiness Checklist

Write a PRODUCTION_CHECKLIST.md file:

## Before Every Release

### Code Quality
- [ ] All console.log removed (or use custom logger)
- [ ] No hardcoded strings (all in i18n files)
- [ ] No TypeScript errors (npx tsc --noEmit)
- [ ] ESLint passes (npm run lint)
- [ ] All TODO comments resolved

### Security
- [ ] .env not committed to git
- [ ] Firebase security rules deployed
- [ ] No sensitive data in AsyncStorage
  (use SecureStore for tokens)
- [ ] API keys restricted in Google Cloud Console

### Performance
- [ ] All images use expo-image with cachePolicy
- [ ] FlashList used for all lists > 5 items
- [ ] React.memo on expensive components
- [ ] No memory leaks (unsubscribed listeners)

### Testing
- [ ] All unit tests pass (npm test)
- [ ] Tested on Android physical device
- [ ] Tested offline mode
- [ ] Tested with slow network (DevTools)
- [ ] Tested with wrong OTP
- [ ] Tested empty states (no shops, no results)
- [ ] Tested in Urdu language mode

### App Store
- [ ] App icon (1024×1024) ready
- [ ] Splash screen ready
- [ ] Screenshots (6) for Play Store
- [ ] App description in English + Urdu
- [ ] Privacy policy URL ready
- [ ] Version number bumped (app.json)
- [ ] versionCode incremented (android)

### Firebase
- [ ] Security rules tested in Firebase Emulator
- [ ] Firestore indexes created for queries
- [ ] Storage rules set (not public write)
- [ ] Firebase App Check enabled

### EAS Build
- [ ] eas.json configured correctly
- [ ] Environment variables set in EAS dashboard
- [ ] Test build (preview profile) tested
- [ ] Production build created