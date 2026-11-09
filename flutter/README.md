# Flutter örneği

Cloud4Feed Mobile SDK'yı Flutter uygulamasında kullanan örnek; Android ve iOS. SDK pub.dev'den
gelir: `cloud4feed_mobilesdk_flutter: ^1.3.4`.

## Hazırlık

1. `lib/main.dart` içinde `"YOUR_API_KEY"` satırına kendi API anahtarınızı yazın.
2. `flutter pub get`

## Android

```bash
flutter run
```

Gerekenler hazır: `android/build.gradle.kts` içinde JitPack deposu
(`maven { url = uri("https://jitpack.io") }`), `MainActivity` `FlutterFragmentActivity`'den
türer (dialog / bottom sheet anketleri için), manifest'te `fluttertest` deep link scheme'i.

## iOS (Mac)

```bash
cd ios && pod install && cd ..
flutter run
```

Gerekenler hazır: `ios/Podfile` `platform :ios, '15.0'`, Xcode hedefi iOS 15.0,
`ios/Runner/Info.plist` içinde `UIApplicationSceneManifest` (`FlutterSceneDelegate`) ve
`fluttertest` URL scheme'i.

## SDK'nın kullanıldığı yerler (`lib/main.dart`)

- `MobileSdkFlutter.setUserProperty(...)` (STORAGE), `initialize(apiKey, params: ...)`,
  `setSessionData(...)`, `autoSetup()`.
- Ekranlar: alt sekmeler değişince `triggerNavigation(...)` — `Home`, `Notifications`, `Profile`,
  `Products`.
- Butonlar: `SurveyTrigger(triggerId: "my_custom_button", ...)`, `SurveyTrigger(triggerId: "survey_button", ...)`.
- Scroll: Home sekmesinde `SurveyScrollView` (paneldeki Scroll Threshold kullanılır).
- Sekmeler: Products içinde Mens / Womens / Kids.

Deep link denemesi: Android `adb shell am start -a android.intent.action.VIEW -d "fluttertest://open?campaign=summer"`,
iOS `xcrun simctl openurl booted "fluttertest://open?campaign=summer"`.
