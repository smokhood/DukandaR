# Mock OTP Testing for DukandaR

## Quick Start - Test OTP Flow Immediately

### Step 1: Start Expo App
```bash
npm start
# or
npx expo start
```

Press `w` for web, `a` for Android, or `i` for iOS.

### Step 2: Test OTP Flow

**Test Phone Number:** Without spaces - `3001234567`

**Test OTP Code:** `123456`

#### Flow:
1. Click "اپنا موبائل نمبر داخل کریں" (Enter mobile number)
2. Type 10 digits without spaces: `3001234567` (or any number starting with 3)
3. Click "OTP بھیجیں" 
4. You'll see in the console: **`🧪 DEV MODE: Test OTP is: 123456`**
5. Enter `123456` in the OTP boxes
6. Auto-logged in! ✅

---

## How It Works

In **development mode** (`__DEV__`):
- Phone number validation works normally
- OTP generation is mocked as `123456`
- Any phone number is accepted
- Console logs show: `🧪 DEV MODE: Test OTP is: 123456`
- No Firebase connection needed

In **production mode**:
- Real Firebase Phone Auth kicks in
- OTP sent via SMS to real Pakistani numbers
- Requires Firebase Phone Auth enabled

---

## Moving to Production

When you're ready for real OTP via SMS:

1. **Remove the mock code:**
   - Open `src/viewModels/useAuthViewModel.ts`
   - Delete the `if (__DEV__)` mock block
   - Keep only the Firebase Phone Auth logic

2. **Test with real phone numbers:**
   - Phone must be valid Pakistani format: `3XX-XXXXXXX`
   - OTP will be sent via SMS
   - Verify with real code

### Example Production Code
```typescript
// Remove this:
if (__DEV__) {
  const testOtp = '123456';
  console.log('🧪 DEV MODE: Test OTP is:', testOtp);
  // ...
}

// Keep only this:
const confirmation = await signInWithPhoneNumber(auth, formattedPhone, undefined);
confirmationResultRef.current = confirmation;
```

---

## Troubleshooting

**OTP screen not showing?**
- Check console for errors
- Make sure phone number validation passes (10 digits, starts with 3)

**"Cannot read property confirm"?**
- It's the mock in action - working as expected!
- Enter `123456` to verify

**Want different test OTP?**
- Edit `src/viewModels/useAuthViewModel.ts`, line ~62
- Change `const testOtp = '123456'` to any 6-digit code

---

## Architecture

```
┌─ app/
│  └─ (auth)/
│     └─ otp.tsx ────────┐
│                        │
│                 useAuthViewModel()
│                        │
├─ src/viewModels/       │
│  └─ useAuthViewModel.ts◄┘
│     ├─ __DEV__ ✓ Mock OTP: 123456
│     └─ Prod   → Firebase Phone Auth
│
├─ src/services/
│  └─ firebase.ts (production credentials)
│
└─ .env (Firebase config)
```

---

## Features Ready for Testing

✅ Phone number validation (Pakistani format)  
✅ OTP input with 6 digit boxes  
✅ Auto-focus between boxes  
✅ Resend OTP countdown (60s)  
✅ Error handling & shake animation  
✅ Auto-login after OTP verify  
✅ Role selection (customer/owner)  
✅ Voice-over-IP (VoIP) support  
✅ Biometric auth support (ready for later)

---

## Want Firebase Emulator Instead?

See the original branch or follow:
https://firebase.google.com/docs/emulator-suite/connect_firestore

Requires:
- Java 11+ installed
- firebase-tools properly installed
- Ports 9099 & 8080 free

