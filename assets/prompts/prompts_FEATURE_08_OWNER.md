# FEATURE 08 — Shop Owner Screens

## Context
DukandaR shop owner side. Owners register their
shop, build catalog from templates, manage stock,
see demand analytics, and add deals.

---

## FILE 8.1 — src/constants/templates/kiryana.ts

Write complete kiryana store template array.
Type: TemplateItem[]

Include 60 items across these categories:
(id, name in English, nameUrdu, category, unit,
suggestedPrice in PKR as of 2024)

Categories and items:
atta_rice:
  Atta 1kg, Atta 5kg, Atta 10kg, Atta 20kg,
  Basmati Rice 1kg, Basmati Rice 5kg,
  Irri Rice 5kg, Sella Rice 5kg

oil_ghee:
  Cooking Oil 1L, Cooking Oil 5L,
  Dalda Ghee 1kg, Desi Ghee 1kg,
  Canola Oil 5L

dairy:
  Milk (Olpers) 1L, Milk (Nestle) 1L,
  Eggs (dozen), Yogurt 1kg, Butter 200g,
  Cream 200ml

sugar_salt:
  Sugar 1kg, Sugar 5kg, Salt 1kg,
  Pink Salt 1kg

tea_drinks:
  Tapal Danedar 200g, Lipton Tea 200g,
  Nestle Milo 400g, Tang Orange 500g,
  Rooh Afza 800ml, Pepsi 1.5L, 7UP 1.5L

soap_hygiene:
  Lux Soap 135g, Lux Soap 170g,
  Lifebuoy Soap 135g, Safeguard 135g,
  Dettol Soap 100g, Dove Soap 135g,
  Dettol Handwash 200ml, Sunsilk Shampoo 180ml,
  Head & Shoulders 180ml, Vaseline 100ml

pulses:
  Daal Mash 1kg, Daal Chana 1kg,
  Daal Moong 1kg, Masoor Daal 1kg,
  Chana whole 1kg

spices:
  Red Chili Powder 100g, Turmeric 100g,
  Coriander Powder 100g, Garam Masala 50g,
  Cumin 100g, Black Pepper 50g

snacks:
  Peek Freans Biscuits, Sooper Biscuits,
  Kolson Slanty Chips, Pringles Original

cleaning:
  Surf Excel 500g, Surf Excel 1kg,
  Vim Bar 200g, Harpic 500ml,
  Rin Detergent 500g

---

## FILE 8.2 — src/constants/templates/pharmacy.ts

Pharmacy template, 45 items:
(mark prescription items with requiresPrescription: true)

pain_fever:
  Panadol 500mg (strip), Brufen 400mg,
  Disprin, Ponstan, Calpol Syrup 120ml

digestion:
  Buscopan tablet, Flagyl 400mg,
  ORS Sachet, Neopeptine Drops,
  Gaviscon, Lactulose Syrup

antibiotics (requiresPrescription: true):
  Augmentin 625mg, Amoxicillin 500mg,
  Ciprofloxacin 500mg, Azithromycin 500mg

skin:
  Betnovate cream 15g, Candid B cream,
  Clotrimazole 1% cream, Soframycin cream,
  Dettol Antiseptic 100ml

vitamins:
  Vitamin C 500mg (30 tabs), Vitamin D3 drops,
  Calcium + D3 tablets, Zinc tablets,
  Centrum Multivitamin

bandages_first_aid:
  Cotton Roll 100g, Elastic Bandage 4",
  Band-Aid strips (10), Surgical Tape

drops:
  Eye drops (Refresh Tears), Ear drops,
  Nasal drops (Xylometazoline), Otrivin

common_otc:
  Vicks VapoRub 25g, Vaseline 100ml,
  Strepsils Throat (6 pack),
  Rhinolast Nasal Spray

---

## FILE 8.3 — src/constants/templates/sabzi.ts

Fruit & Vegetable template, 35 items:
(prices vary by season — use mid-range PKR)

vegetables:
  Tomatoes 1kg, Onions 1kg, Potatoes 1kg,
  Garlic 250g, Ginger 250g, Green Chili 250g,
  Spinach bunch, Methi bunch, Coriander bunch,
  Cabbage (piece), Cauliflower (piece),
  Peas 1kg, Carrot 1kg, Turnip 1kg,
  Brinjal 1kg, Bitter Gourd 1kg,
  Lady Finger 1kg, Bottle Gourd (piece)

fruits:
  Bananas (dozen), Apples 1kg, Mangoes 1kg,
  Oranges 1kg, Guava 1kg, Grapes 1kg,
  Watermelon (piece), Pomegranate 1kg,
  Lemon 250g, Dates 500g, Strawberries 250g

fresh_herbs:
  Mint bunch, Dill bunch, Curry leaves bunch

---

## FILE 8.4 — src/constants/templates/bakery.ts

Bakery template, 30 items:

bread:
  White Bread loaf, Brown Bread loaf,
  Buns (6 pack), Naan (each), Roti (each),
  Croissant

cakes_pastries:
  Plain Cake slice, Chocolate Cake slice,
  Muffin (each), Cupcake (each),
  Swiss Roll

biscuits_cookies:
  Chocolate Chip Cookies (box),
  Butter Cookies (box), Rusks (box)

savory:
  Samosa (each), Spring Roll (each),
  Patties (each), Mini Sandwiches,
  Bread Roll

beverages_bakery:
  Tea (cup), Coffee (cup), Cold Coffee,
  Milkshake, Fresh Juice

---

## FILE 8.5 — src/viewModels/useCatalogViewModel.ts

Catalog builder ViewModel:

Params: category: ShopCategory

State:
- template: TemplateItem[] (loaded from constants)
- selectedItems: Map<string, {item: TemplateItem,
  price: number}>
- searchQuery: string
- activeCategory: string ('all' or sub-category)
- isSubmitting: boolean
- error: string | null

On init:
- Load template based on category param

Functions:
1. toggleItem(item: TemplateItem): void
   If already selected: remove from map
   If not selected: add with suggestedPrice as default

2. setItemPrice(itemId: string, price: number): void
   Update price in selectedItems map

3. filterByCategory(category: string): void

4. searchTemplate(query: string): TemplateItem[]
   Filter template by name (English or Urdu)

5. addCustomItem(name: string, nameUrdu: string,
   category: string, price: number, unit: string): void
   Add a custom item not in template

6. submitCatalog(shopId: string): Promise<void>
   - Validate: at least 5 items selected
   - Validate: all selected items have price > 0
   - Build Product array from selectedItems
   - Call productService.bulkAddProducts
   - Navigate to owner dashboard on success

Computed:
- filteredTemplate: TemplateItem[] (by search + category)
- selectedCount: number
- isValid: boolean (min 5 items, all have prices)
- completionPercent: number

---

## FILE 8.6 — src/viewModels/useOwnerDashViewModel.ts

Owner dashboard ViewModel:

Params: shopId string

On mount:
- Fetch shop data (real-time listener)
- Fetch today's stats
- Fetch demand alerts
- Check for products needing stock verification

Real-time listener for shop.isOpen changes.

Functions:
1. toggleShopOpen(): Promise<void>
   Optimistic toggle + server update

2. confirmProductStock(productName: string,
   inStock: boolean): Promise<void>
   Call productService.confirmProductStock
   Remove alert from local list

3. refreshStats(): Promise<void>

4. getDemandAlerts(): Promise<DemandAlert[]>
   Call productService.getDemandAlerts(shopId)

5. getProductsNeedingVerification(): Product[]
   Products where stockVerifiedAt > 7 days ago

Return:
- shop, stats, demandAlerts, productsNeedingVerification
- isLoading, error
- toggleShopOpen, confirmProductStock, refreshStats

---

## FILE 8.7 — app/(owner)/_layout.tsx

Owner bottom tab navigator:

Tabs:
1. dashboard → icon: bar-chart, label: "ڈیش بورڈ"
2. catalog → icon: cube, label: "کیٹلاگ"
3. deals → icon: pricetag, label: "ڈیلز"
4. shop-settings → icon: settings, label: "سیٹنگز"

Same style as customer tab bar.
Green active tint.

---

## FILE 8.8 — app/(owner)/register-shop.tsx

Multi-step shop registration (4 steps):

Progress bar: steps 1-4 shown as dots or bar

STEP 1 — Basic Info:
  "دکان کی بنیادی معلومات" heading

  Shop name: text input (required)
    - React Hook Form + shopNameSchema
  Owner name: text input (required)
  WhatsApp: phone input with 🇵🇰 prefix
    - Format validation (Pakistani)
  Phone: optional alternate number

  "اگلا قدم →" button (validates before proceeding)

STEP 2 — Category & Location:
  "دکان کی قسم اور جگہ" heading

  Category picker: 3-column grid
  Each cell: icon + name + nameUrdu
  Selected: green border + checkmark
  One selection only

  Location section:
  [📍 میری موجودہ جگہ استعمال کریں] green button
  OR manual input:
    Area/Neighbourhood (text)
    City picker (Lahore/Karachi/Islamabad/
                 Rawalpindi/Faisalabad/Other)
    Full address (text, multiline)

STEP 3 — Shop Photo:
  "دکان کی تصویر" heading
  "گاہک آپ کی دکان پہچانیں گے"

  Large placeholder (200×200, dashed border)
  If photo selected: show preview with change button
  Two buttons:
  [📷 تصویر کھینچیں] [🖼️ گیلری سے]
  expo-image-picker for both
  expo-image-manipulator to compress

  Skip option (photo optional)

STEP 4 — Opening Hours:
  "کاروباری اوقات" heading

  Toggle: "24 گھنٹے کھلا" switch
  If not 24hrs:
    Opening time: time picker (or text "09:00")
    Closing time: time picker
  JazzCash number (optional, for payment display)
  EasyPaisa number (optional)

  "دکان رجسٹر کریں ✓" final submit button
  Loading state on submit
  On success: navigate to catalog-builder

All steps use React Hook Form.
Form state persists across steps (don't lose on back).

---

## FILE 8.9 — app/(owner)/catalog-builder.tsx

Catalog builder screen:

Header:
  "اپنا کیٹلاگ بنائیں"
  "{count} چیزیں منتخب" (updates live)

INSTRUCTION CARD:
  "جو چیزیں آپ بیچتے ہیں وہ tick کریں
   اور قیمت لکھیں"
  Gray card, info icon

SEARCH BAR:
  "چیز تلاش کریں" placeholder
  Filters template list in real-time

CATEGORY TABS (horizontal scroll):
  "سب" first, then sub-categories

FLASHLIST of template items:
  Each row:
  [Checkbox] [Item Name] | [Urdu Name] | [Price Input]

  Checkbox: green when checked
  Item name: bold English, smaller Urdu below
  Price input: right side, "Rs." prefix
    - Numeric keyboard
    - Placeholder: suggested price (gray)
    - Only enabled when checkbox is ticked
    - Auto-focus when item is checked

  Long press on item: show "اپنی قیمت بتائیں" sheet

ADD CUSTOM ITEM:
  "اپنی چیز شامل کریں +" button at bottom
  Opens bottom sheet with:
    Name (English), Name Urdu, Price, Unit, Category

STICKY BOTTOM BAR:
  Left: "{count} چیزیں منتخب"
  Right: [کیٹلاگ محفوظ کریں ✓] green button
  Disabled + message if < 5 items selected

---

## FILE 8.10 — app/(owner)/dashboard.tsx

Owner dashboard:

HEADER:
  "السلام علیکم, {ownerName}!" (personalized)
  Right: shop open/closed toggle (large, prominent)
    Green = کھلا | Red = بند
    Toggle with animated switch

SHOP STATS ROW (3 cards, horizontal scroll):
  Card 1 — Views:
    👁️ icon
    "{todayViews}" (large, bold)
    "آج کے وزٹ"
    Compared to yesterday: ↑ 12% or ↓ 5%

  Card 2 — WhatsApp Orders:
    💬 icon
    "{whatsappClicks}" (large, bold)
    "واٹس ایپ آرڈر"

  Card 3 — Saved By:
    ❤️ icon
    "{savedByCount}" (large, bold)
    "پسندیدہ میں"

Loading: DashboardSkeleton

DEMAND ALERTS SECTION:
  "🔥 گاہک کیا ڈھونڈ رہے ہیں" heading
  Subtitle: "ان چیزوں کا اسٹاک رکھیں، زیادہ گاہک آئیں گے"

  Each alert card (green-tinted):
    Product name (bold)
    "{count} لوگ آپ کے قریب تلاش کر رہے ہیں" 
    Two buttons:
    [✅ ہاں، میرے پاس ہے] → confirmStock(true)
    [❌ نہیں ہے] → confirmStock(false)
    Tapping removes card with slide-out animation

  If no alerts: "کوئی ڈیمانڈ الرٹ نہیں" empty state

PRODUCTS NEEDING VERIFICATION:
  "⚠️ اسٹاک تصدیق کریں" section
  Products not verified in 7+ days
  Each: name + "ابھی بھی موجود ہے؟" [ہاں] [نہیں]

QUICK ACTIONS:
  [📦 کیٹلاگ اپڈیٹ کریں]
  [🏷️ آج کا ڈیل شامل کریں]
  [🔗 دکان کا لنک شیئر کریں]

---

## FILE 8.11 — app/(owner)/manage-catalog.tsx

Manage existing catalog:

HEADER: "میرا کیٹلاگ" + item count badge

SEARCH: "پروڈکٹ تلاش کریں"

CATEGORY TABS

FLASHLIST of products:
  Each row:
    Product name (bold) + Urdu name (small)
    Price "Rs.{price}" (tappable to edit)
    Stock toggle switch (right side)
      Green = موجود | Gray = ختم

  Swipe left: red delete button
  Swipe right: edit button (opens edit sheet)

FAB (Floating Action Button):
  "+" green circle button (bottom right)
  Opens AddProductSheet

ADD PRODUCT BOTTOM SHEET:
  Template search first
  "اپنی چیز لکھیں" if not in template
  Fields: name, urdu name, price, unit, category
  [محفوظ کریں] button

---

## FILE 8.12 — app/(owner)/add-deal.tsx

Add today's deal:

HEADER: "آج کا ڈیل"

SELECT PRODUCT:
  Search bar to find from catalog
  OR type manually
  Show matching products as you type

DEAL DETAILS:
  Original price (auto-filled from catalog)
  Deal price (must be less than original)
  Auto-shows: "آپ Rs.{X} ({Y}%) بچا رہے ہیں"

NOTE (optional):
  "تازہ اسٹاک آیا ہے!" suggestion chips
  Text input for custom note

EXPIRY:
  [صرف آج] [اس ہفتے] [اپنی تاریخ]

PREVIEW:
  Shows DealCard preview as customer will see it

ACTIONS:
  [ڈیل شامل کریں] → saves to Firestore
  [واٹس ایپ اسٹیٹس پر شیئر کریں] →
    generates branded image card
    opens share sheet

Deal image generation:
  Use react-native-view-shot to capture
  the DealCard as an image, then share
  via expo-sharing