# Cloud4Feed Mobile SDK — Örnek Uygulamalar

Cloud4Feed Mobile SDK'yı kendi uygulamanıza eklerken referans alabileceğiniz, yayındaki paketleri
kullanan küçük demo uygulamalar. Her uygulamada alt navigasyon, sekmeler (Mens / Womens), butonlar
ve uzun bir scroll listesi var; altı tetikleyici tipinin hepsi (button, scroll, navigation, tab
change, app launch, exit) denenebilir.

| Klasör | Platform | SDK paketi | Sürüm |
|---|---|---|---|
| [`android-native/`](android-native) | Android (Kotlin, Views) | JitPack `com.github.cloud4feed:c4f_mobile_sdk` | `v2.0.25` |
| [`ios-native/`](ios-native) | iOS (Swift, UIKit + SwiftUI) | Swift Package `https://github.com/cloud4feed/c4f_mobile_sdk_ios` | `1.0.1` |
| [`react-native/`](react-native) | Android + iOS | npm `cloud4feed-mobilesdk-react-native` | `^1.3.8` |
| [`expo/`](expo) | Android + iOS | npm `cloud4feed-mobilesdk-react-native` + config plugin | `^1.3.8` |
| [`flutter/`](flutter) | Android + iOS | pub.dev `cloud4feed_mobilesdk_flutter` | `^1.3.6` |

React Native, Expo ve Flutter projeleri tek kod tabanıyla iki platformda çalışır; böylece 5 proje
8 platform örneği verir (4 Android + 4 iOS).

## 1. API anahtarınızı girin

Hiçbir örnekte API anahtarı yoktur. Kendi anahtarınızı (Configuration Manager → Mobile SDK
Management → yapılandırmanız → API Key) şu satıra yazın:

| Örnek | Dosya | Satır |
|---|---|---|
| Android | `android-native/app/src/main/java/com/example/surveysdktestapp/MainActivity.kt` | `API_KEY = "YOUR_API_KEY"` |
| iOS | `ios-native/SurveySDKTestApp/AppDelegate.swift` | `apiKey = "YOUR_API_KEY"` |
| React Native | `react-native/App.js` | `apiKey = "YOUR_API_KEY"` |
| Expo | `expo/app/(tabs)/index.tsx` | `API_KEY = 'YOUR_API_KEY'` |
| Flutter | `flutter/lib/main.dart` | `"YOUR_API_KEY"` |

## 2. Paneli örneklere göre ayarlayın

Örnekler aynı adları kullanır; tek bir yapılandırma beş uygulamada da çalışır. Panelde her
tetikleyici için ayrı bir anket girişi önerilir (bkz. kullanıcı kılavuzu, "Her ankete tek
tetikleyici").

| Tetikleyici | Paneldeki değer | Örnekte nerede |
|---|---|---|
| Button | Button Trigger ID `my_custom_button` (veya boş bırakın: `survey_button` önceden tanımlı) | Home ekranındaki butonlar |
| Scroll | Scroll Threshold örn. `250` (fiziksel piksel), Trigger Screens boş | Home ekranındaki liste |
| Navigation | Trigger Screens `Notifications` | Notifications sekmesi |
| Exit | Trigger Screens `Notifications` (o ekrandan çıkınca) veya boş (uygulamadan çıkıp dönünce) | — |
| Tab Change | Trigger Tabs `Womens` | Mens / Womens sekmeleri |
| App Launch | — (Trigger Type Delayed + `5000` ms denenebilir) | Uygulama açılışı |

Örneklerin hazır gönderdiği veriler (custom parametre / hariç tutma kuralı denemek için):

| Kaynak | Anahtar → değer |
|---|---|
| STORAGE | `customerId` → `1011`, `user_tier` → `gold`, `cart_items` → `3` |
| SESSION | `promo_code` → `WELCOME10`, `current_screen` → o anki ekran |
| Açılış parametresi | `customerId` → `1011` (transactional anket eşleştirmesi için) |
| URL (Deep Link) | `campaign` — uygulamayı `<scheme>://open?campaign=summer` ile açın |

Deep link scheme'leri: iOS native `surveytest`, React Native `shopnow`, Expo `expotest`, Flutter
`fluttertest`.

## 3. Çalıştırın

Her klasörün kendi README'sinde adım adım komutlar var. Özet:

| Örnek | Gerekenler | Komut |
|---|---|---|
| Android | Android Studio, JDK 17 | Android Studio ile `android-native` klasörünü açın → Run |
| iOS | Mac, Xcode 15+ (iOS 15+), XcodeGen | `cd ios-native && xcodegen && open SurveySDKTestApp.xcodeproj` |
| React Native | Node 18+, Android Studio / Xcode + CocoaPods | `npm install` → `npx react-native run-android` / `cd ios && pod install && cd .. && npx react-native run-ios` |
| Expo | Node 18+, development build (Expo Go çalışmaz) | `npm install` → `npx expo prebuild` → `npx expo run:android` / `run:ios` (iOS için `expo/README.md` adımları) |
| Flutter | Flutter 3.x | `flutter pub get` → `flutter run` |

## Doğrulama notu

Bu örnekler, SDK geliştirilirken uçtan uca test edilen uygulamalardan alınmıştır: Android tarafı
emülatörde yayındaki paketlerle, iOS tarafı (native, React Native, Expo, Flutter) iOS 27.1
simülatöründe test edildi. Bu depoya taşınırken yalnızca API anahtarları, yerel geliştirme
ayarları ve derleme çıktıları temizlendi; kopyalar ayrıca yeniden derlenmedi. Sorun görürseniz
lütfen bildirin.

## Daha fazla bilgi

- Kullanıcı ve entegrasyon kılavuzu: panel ayarları, tetikleyiciler, custom parametreler,
  platform farkları, sık karşılaşılan durumlar.
- Android SDK: https://github.com/cloud4feed/c4f_mobile_sdk
- iOS SDK: https://github.com/cloud4feed/c4f_mobile_sdk_ios
