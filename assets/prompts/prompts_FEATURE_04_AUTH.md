# FEATURE 04 — Authentication

## Context
DukandaR MVVM project. Phone OTP authentication
using Firebase Phone Auth. No email. Pakistani
phone numbers (03XX format).

---

## FILE 4.1 — src/store/authStore.ts

Write Zustand auth store:

State:
- user: User | null
- isLoading: boolean
- isAuthenticated: boolean
- hasCompletedOnboarding: boolean

Actions:
- setUser(user: User | null): void
- setLoading(loading: boolean): void
- setOnboarded(): void
- clearUser(): void

Persistence:
- Persist to expo-secure-store using zustand persist
  middleware with SecureStore adapter:
  setItem, getItem, removeItem using SecureStore

---

## FILE 4.2 — src/viewModels/useAuthViewModel.ts

Write auth ViewModel hook:

State managed:
- phoneNumber: string
- otpSent: boolean
- isLoading: boolean
- error: string | null
- countdown: number (60 → 0 for resend timer)
- confirmationResult: any (Firebase)

Functions:
1. sendOTP(phone: string): Promise<void>
   - Validate Pakistani phone with Zod schema
   - Format to +923XXXXXXXXX
   - Call Firebase signInWithPhoneNumber
   - Store confirmationResult in state
   - Start 60-second countdown timer
   - Handle errors: invalid phone, too many requests,
     network error

2. verifyOTP(otp: string): Promise<void>
   - Validate 6 digits
   - Call confirmationResult.confirm(otp)
   - On success: check if user exists in Firestore
   - If new user: create user document with isOnboarded:false
   - If existing: fetch user document
   - Update authStore with user
   - Handle errors: wrong OTP, expired OTP

3. setUserRole(role: UserRole): Promise<void>
   - Update user document in Firestore
   - Update authStore user

4. resendOTP(): Promise<void>
   - Only if countdown === 0
   - Re-call sendOTP with stored phone

5. checkBiometricAvailability():
   Promise<{ available: boolean, type: string }>
   - Use expo-local-authentication
   - Return available + type (Face ID / Fingerprint)

6. authenticateWithBiometric(): Promise<boolean>
   - LocalAuthentication.authenticateAsync
   - promptMessage: "DukandaR mein dakhil hon"
   - Return success boolean

7. logout(): Promise<void>
   - Firebase signOut
   - Clear authStore
   - Clear SQLite cache
   - Navigate to role-select

Return all state + functions.

---

## FILE 4.3 — app/_layout.tsx

Write root layout:

- Wrap with GestureHandlerRootView (full screen)
- Wrap with QueryClientProvider (TanStack Query)
  - staleTime: 5 minutes
  - gcTime: 10 minutes
  - retry: 2
- Load custom fonts:
  Inter_400Regular, Inter_500Medium,
  Inter_600SemiBold, Inter_700Bold
  from @expo-google-fonts/inter
- Initialize i18n on mount
- Initialize SQLite DB on mount (offlineService.initDB)
- Auth guard logic:
  - If not authenticated → redirect to /(auth)/role-select
  - If authenticated + customer → redirect to /(customer)
  - If authenticated + owner → redirect to /(owner)
  - If authenticated + no role → redirect to
    /(auth)/role-select
- Show SplashScreen until fonts loaded + auth checked
- Use expo-splash-screen

---

## FILE 4.4 — app/index.tsx

Write animated app entry/splash:
- Show DukandaR logo centered on green background
- Logo: shopping bag Ionicon + "DukandaR" text
- Tagline: "اپنی گلی کی ہر دکان" below
- Animate: logo scales from 0.8 to 1.0 (spring)
            tagline fades in after 300ms
- After 2 seconds → check auth → redirect
- While redirecting: brief fade out animation
- Use Reanimated withSpring and withTiming

---

## FILE 4.5 — app/(auth)/_layout.tsx

Stack navigator for auth screens:
- No header
- Green status bar
- Screens: role-select, otp
- If already authenticated → redirect away

---

## FILE 4.6 — app/(auth)/role-select.tsx

Write role selection screen:

Layout:
- Green background top 40% with logo + tagline
- White bottom 60% with role cards
- No header

Content:
- Top section (green):
  Large shopping bag icon (white, 64px)
  "DukandaR" title (white, bold, large)
  "اپنی گلی کی ہر دکان، ایک جگہ" (white, smaller)

- Bottom section (white, rounded top corners):
  "آپ کون ہیں؟" heading (bold, dark, centered)

  TWO CARDS side by side:
  Left card — Customer:
    Green shopping bag icon (large)
    "میں Customer ہوں" (bold)
    "قریبی دکانوں سے خریداری کریں" (small gray)
    Tap → navigate to OTP with role='customer'

  Right card — Owner:
    Green store icon (large)
    "میری دکان ہے" (bold)
    "اپنی دکان رجسٹر کریں" (small gray)
    Tap → navigate to OTP with role='owner'

  Each card: white bg, rounded-2xl, shadow,
  border that turns green when hovered/pressed
  Scale animation on press (Reanimated)

- Language toggle at bottom:
  [English] [اردو] pill toggles

Use NativeWind for all styling.
Use useAuthViewModel.

---

## FILE 4.7 — app/(auth)/otp.tsx

Write complete OTP screen:

Header:
- Back button (returns to role-select)
- "DukandaR" title centered

Content (KeyboardAvoidingView):

STEP 1 — Phone Input (shown when !otpSent):
  "اپنا موبائل نمبر داخل کریں" heading
  "ہم آپ کو OTP بھیجیں گے" subtitle

  Phone input field:
  - Left flag: 🇵🇰 +92 (fixed prefix display)
  - Input: placeholder "300 1234567"
  - Numeric keyboard
  - Pakistani format validation (real-time)
  - Error message below if invalid

  "OTP بھیجیں" primary green button
  Loading spinner when isLoading

STEP 2 — OTP Input (shown when otpSent):
  "OTP داخل کریں" heading
  "XXX-XXX-XXXX پر OTP بھیجا گیا" subtitle with phone
  "غلط نمبر؟" link to go back

  6 OTP boxes in a row:
  - Each box: 48×56px, border, rounded
  - Auto-focus next box on input
  - Auto-submit when 6th digit entered
  - Backspace removes current and goes back
  - Paste support (auto-fill all 6)
  - Green border when focused
  - Error state: red border + shake animation

  "تصدیق کریں" button (disabled until 6 digits)
  Loading state on button

  "دوبارہ بھیجیں" link:
  - Disabled with countdown: "60 seconds میں"
  - Enabled when countdown reaches 0

Error display: red box with error message
Success: brief green checkmark animation → redirect

Use useAuthViewModel for all logic.
Use Reanimated for shake animation on wrong OTP.