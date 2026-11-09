# React Native örneği ("ShopNow")

Cloud4Feed Mobile SDK'yı bare React Native (0.74) uygulamasında kullanan örnek; Android ve iOS.
SDK npm'den gelir: `cloud4feed-mobilesdk-react-native` (`^1.3.8`).

## Hazırlık

1. `App.js` içinde `apiKey = "YOUR_API_KEY"` satırına kendi API anahtarınızı yazın.
2. Paketleri kurun (`.npmrc` içindeki `legacy-peer-deps=true`, react-navigation sürümlerindeki
   zararsız peer uyarısını geçer):
   ```bash
   npm install
   ```

## Android

```bash
npx react-native run-android
```

SDK'nın Android kütüphanesi JitPack'ten gelir; bu yüzden `android/build.gradle` içinde
`allprojects → repositories` altında `maven { url 'https://jitpack.io' }` vardır. Kendi
uygulamanıza da eklemeniz gerekir.

## iOS (Mac)

```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

Bu projede iOS için gerekenler hazır:
- `ios/Podfile`: `platform :ios, "15.0"` ve `post_install` içinde tüm pod'lara
  `IPHONEOS_DEPLOYMENT_TARGET = 15.0` (Xcode 27, iOS 15 altını derlemez).
- `ios/ReactNativeProject/SceneDelegate.h/.m` + `Info.plist` `UIApplicationSceneManifest`:
  iOS 27 SDK ile derlenen uygulama UIScene kullanmazsa açılışta kapanır. SceneDelegate deep
  link'leri `RCTLinkingManager`'a iletir.
- `Info.plist`: `shopnow` URL scheme.

## SDK'nın kullanıldığı yerler (`App.js`)

- `MobileSDK.setUserProperty(...)` (STORAGE, initialize'dan önce), `initializeWithParams(apiKey, [...])`,
  `setSessionData(...)` (initialize'dan sonra), `autoSetupReact()`.
- Ekran değişimleri: `trackScreenView(routeName)` — `Home`, `Products`, `Notifications`, `Profile`.
- Butonlar: `accessibilityLabel="survey_button"`, `accessibilityLabel="my_custom_button"`.
- Sekmeler: `tab_mens` / `tab_womens` (Products ekranı).
- Scroll: Home ekranındaki ürün listesi otomatik izlenir.

Deep link denemesi: Android `adb shell am start -a android.intent.action.VIEW -d "shopnow://open?campaign=summer"`,
iOS `xcrun simctl openurl booted "shopnow://open?campaign=summer"`.
