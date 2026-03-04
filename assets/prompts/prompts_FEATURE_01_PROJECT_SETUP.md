# FEATURE 01 — Project Setup & Configuration

## Context (Always read this first)
You are building DukandaR — a hyperlocal product discovery
app for Pakistan. Customers search for products like "Lux Soap"
or "Atta 10kg" and find local shops near them that have it in
stock with prices. Orders go through WhatsApp.

Tech Stack (STRICT — never change):
- React Native + Expo SDK 54
- TypeScript (strict mode)
- Expo Router v6 (file-based routing)
- NativeWind v4 (Tailwind CSS)
- Firebase (Firestore + Phone Auth + Storage)
- Zustand (global state)
- TanStack Query v5 (server state)
- expo-sqlite (offline cache)
- react-native-maps (maps)
- expo-location (GPS)
- expo-image (optimized images)
- react-native-reanimated v4 (animations)
- @shopify/flash-list (fast lists)
- react-hook-form + zod (forms)
- i18next + expo-localization (Urdu/English)
- expo-secure-store (secure storage)
- expo-local-authentication (biometrics)
- @expo/vector-icons Ionicons (icons)

Architecture: MVVM
- models/ → TypeScript interfaces ONLY, zero logic
- viewModels/ → Custom hooks with ALL business logic
- views/screens/ → UI only, zero business logic
- services/ → Raw Firebase/API calls only
- store/ → Zustand global stores
- components/ → Reusable pure UI components
- constants/ → Static data, no logic
- utils/ → Pure helper functions

---

## FILE 1.1 — package.json dependencies
Write the complete list of npm install commands to
install ALL required packages for DukandaR.
Group them as:
1. Core Expo packages (use `npx expo install`)
2. npm packages (use `npm install`)
3. Dev dependencies (use `npm install --save-dev`)

Include exact package names with no version conflicts
for Expo SDK 54.

---

## FILE 1.2 — app.json
Write the complete app.json for DukandaR with:
- name: "DukandaR", slug: "dukandar"
- version: "1.0.0"
- scheme: "dukandar" (for deep linking)
- orientation: "portrait"
- platforms: ios, android
- backgroundColor: "#16a34a"
- plugins array:
  - "expo-router"
  - "expo-location" with permission message:
    "DukandaR aapki location use karta hai taake
     aapke qareeb ki dukaanein dhundh sake."
  - "expo-camera" with permission:
    "Dukaan ki tasveer lene ke liye camera chahiye."
  - "expo-notifications"
  - "expo-local-authentication"
- splash screen: backgroundColor #16a34a,
  resizeMode "contain"
- android section:
  - package: "com.dukandar.app"
  - versionCode: 1
  - adaptiveIcon with backgroundColor #16a34a
  - permissions: ACCESS_FINE_LOCATION,
    ACCESS_COARSE_LOCATION, CAMERA,
    READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE,
    VIBRATE, RECEIVE_BOOT_COMPLETED
  - intentFilters for deep linking scheme "dukandar"
- ios section:
  - bundleIdentifier: "com.dukandar.app"
  - infoPlist location and camera usage descriptions
- extra section with eas projectId placeholder

---

## FILE 1.3 — babel.config.js
Write babel.config.js for Expo SDK 54 with NativeWind v4:
- babel-preset-expo with jsxImportSource: 'nativewind'
- nativewind/babel plugin
- react-native-reanimated/plugin (MUST be last plugin)

---

## FILE 1.4 — tailwind.config.js
Write complete tailwind.config.js:
- content: ["./app/**/*.{js,jsx,ts,tsx}",
            "./src/**/*.{js,jsx,ts,tsx}"]
- presets: [require("nativewind/preset")]
- theme.extend.colors:
  primary: { DEFAULT: '#16a34a', dark: '#15803d',
             light: '#22c55e', lighter: '#dcfce7' }
  accent: { DEFAULT: '#f59e0b', dark: '#d97706',
            light: '#fcd34d' }
  danger: '#dc2626'
  warning: '#f97316'
  surface: '#ffffff'
  background: '#f3f4f6'
- theme.extend.fontFamily:
  sans: ['Inter_400Regular']
  medium: ['Inter_500Medium']
  semibold: ['Inter_600SemiBold']
  bold: ['Inter_700Bold']
  urdu: ['JameelNooriNastaleeq']

---

## FILE 1.5 — tsconfig.json
Write tsconfig.json with:
- extends: "expo/tsconfig.base"
- strict: true
- noImplicitAny: true
- paths (absolute imports):
  @models/* → ./src/models/*
  @viewModels/* → ./src/viewModels/*
  @services/* → ./src/services/*
  @components/* → ./src/components/*
  @store/* → ./src/store/*
  @constants/* → ./src/constants/*
  @utils/* → ./src/utils/*
  @i18n/* → ./src/i18n/*

---

## FILE 1.6 — .env and .env.example
Write .env.example (committed to git) with placeholder
values and comments explaining each variable:
- EXPO_PUBLIC_FIREBASE_API_KEY
- EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
- EXPO_PUBLIC_FIREBASE_PROJECT_ID
- EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
- EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- EXPO_PUBLIC_FIREBASE_APP_ID
- EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
- EXPO_PUBLIC_SENTRY_DSN

Also write .gitignore entries for: .env, .env.local,
.env.production, google-services.json,
GoogleService-Info.plist, /node_modules,
.expo/, dist/, build/

---

## FILE 1.7 — eas.json
Write complete eas.json with three build profiles:
1. development: internal distribution, developmentClient
   true, APP_ENV=development
2. preview: internal APK build for testing,
   APP_ENV=staging, android buildType: apk
3. production: autoIncrement true,
   APP_ENV=production, store build
Include submit config for Android Play Store.

---

## FILE 1.8 — metro.config.js
Write metro.config.js configured for:
- NativeWind v4 CSS support
- Expo Metro preset
- SVG transformer support

---

## FILE 1.9 — src/constants/colors.ts
Write typed color constants file exporting:
- COLORS object with all brand colors
- Each color has a TypeScript type
- Include semantic colors: success, error, warning,
  info, background, surface, border, text variants
- Export individual color constants too

---

## FILE 1.10 — src/constants/categories.ts
Write shop categories array. Each category:
interface ShopCategory {
  id: string
  name: string           // English
  nameUrdu: string       // اردو
  icon: string           // Ionicons name
  color: string          // hex
  bgColor: string        // light background hex
  templateKey: string    // links to template file
}

Categories:
kiryana (🛒 grocery), pharmacy (💊), sabzi (🥬 fruit/veg),
bakery (🍞), mobile (📱 electronics), clothing (👗),
hardware (🔧), beauty (💄), restaurant (🍽️), other (🏪)

---

## FILE 1.11 — src/i18n/en.ts
Write complete English translations object with keys for
every string in the app:

Sections:
- common: (app_name, loading, error, retry, save,
  cancel, confirm, back, done, edit, delete,
  search, filter, sort, share, report, close,
  yes, no, or, and, of, view_all, show_more)
- auth: (welcome, tagline, i_am_customer,
  i_am_shop_owner, phone_number, enter_phone,
  enter_otp, otp_sent_to, verify, resend_otp,
  resend_in, login_success, logout,
  biometric_prompt, invalid_phone, invalid_otp)
- customer: (find_products, search_placeholder,
  near_you, open_now, closed, opens_at, closes_at,
  distance, km_away, m_away, order_on_whatsapp,
  add_to_order, remove, view_order, clear_order,
  total, items, cheapest_nearby, nearest,
  best_rated, no_shops_found, no_results,
  try_different_search, searching, results_for,
  shops_found, has_all_items, missing_items,
  in_stock, out_of_stock, stock_unverified,
  flag_stock, thanks_for_reporting, deals_today,
  save_shop, unsave_shop, saved, rate_shop,
  your_order, add_note, note_placeholder,
  send_order, payment_info, order_sent,
  share_shop)
- owner: (my_shop, dashboard, catalog, settings,
  shop_open, shop_closed, toggle_open, views_today,
  orders_today, saved_by, demand_alerts,
  people_searched, confirm_stock_yes, confirm_stock_no,
  add_deal, manage_catalog, shop_settings,
  register_shop, shop_name, owner_name,
  category, location, whatsapp_number, shop_photo,
  opening_hours, opening_time, closing_time,
  open_24_hours, save_shop_info, catalog_builder,
  select_products, set_prices, items_selected,
  save_catalog, add_product, edit_price,
  in_stock_toggle, out_of_stock_toggle,
  deal_price, original_price, deal_note,
  deal_expires, add_today_deal)
- onboarding: (skip, next, get_started,
  slide1_title, slide1_desc,
  slide2_title, slide2_desc,
  slide3_title, slide3_desc)
- errors: (network_error, server_error, not_found,
  permission_denied, location_permission_denied,
  camera_permission_denied, auth_error,
  shop_not_found, product_not_found,
  whatsapp_not_installed)

---

## FILE 1.12 — src/i18n/ur.ts
Write complete Urdu translations for ALL the same keys
as en.ts. Use proper Urdu text (not Roman Urdu).
Key examples:
- app_name: "دکاندار"
- tagline: "اپنی گلی کی ہر دکان، ایک جگہ"
- find_products: "پروڈکٹ تلاش کریں"
- search_placeholder: "صابن، آٹا، دودھ..."
- order_on_whatsapp: "واٹس ایپ پر آرڈر کریں"
- in_stock: "موجود ہے"
- out_of_stock: "ختم ہو گیا"

---

## FILE 1.13 — src/i18n/index.ts
Write i18next setup with expo-localization:
- Initialize i18next with en and ur resources
- Detect device language via expo-localization
- Default fallback: 'en'
- Export: i18n instance, useTranslation hook re-export,
  changeLanguage function, getCurrentLanguage function
- Export type: TranslationKey (for type-safe translations)