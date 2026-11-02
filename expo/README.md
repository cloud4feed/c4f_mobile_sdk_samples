# Expo örneği

Cloud4Feed Mobile SDK'yı Expo (SDK 54, expo-router) uygulamasında kullanan örnek; Android ve iOS.
SDK npm'den gelir: `cloud4feed-mobilesdk-react-native` (`^1.3.5`) ve config eklentisi
`cloud4feed-mobilesdk-react-native/expo-plugin` (`app.json`).

> Paket native kod içerir; **Expo Go'da çalışmaz**. Development build (`expo run:*`) veya EAS
> Build kullanın.

## Hazırlık

1. `app/(tabs)/index.tsx` içinde `API_KEY = 'YOUR_API_KEY'` satırına kendi API anahtarınızı yazın.
2. `app.json` içindeki `com.cloud4feed.sample.expo` paket / bundle id'sini isterseniz kendi
   id'nizle değiştirin.
3. `npm install`

## Android

```bash
npx expo prebuild --platform android
npx expo run:android
```

Config eklentisi JitPack deposunu üretilen Android projesine kendisi ekler.

## iOS (Mac)

`ios/` klasörü `prebuild` ile üretilir ve Expo SDK 54 şablonu iki düzenleme ister. Gereken dosyalar
`ios-setup/` klasöründe:

```bash
npx expo prebuild --platform ios
```

1. **Podfile:** `ios-setup/Podfile.post_install.rb` içindeki satırları `ios/Podfile`'daki
   `post_install do |installer|` bloğunun başına ekleyin (pod'lar için iOS 15.1).
2. **UIScene:** `ios-setup/SceneDelegate.swift`'i `ios/` altına kopyalayıp Xcode'da uygulama
   hedefine ekleyin; `ios-setup/Info.plist.snippet.xml` içeriğini `ios/<App>/Info.plist`'in
   en üst `<dict>`'ine ekleyin.

```bash
cd ios && pod install && cd ..
npx expo run:ios
```

> ⚠️ `npx expo prebuild --clean` `ios/` klasörünü baştan üretir; bu iki adımı tekrarlayın.

## SDK'nın kullanıldığı yerler

- `app/(tabs)/index.tsx`: `setUserProperty` (STORAGE), `initializeWithParams`, `setSessionData`,
  `autoSetupReact`, `trackScreenView('home')`, butonlar (`survey_button`, `my_custom_button`),
  Mens / Womens sekmeleri, scroll listesi.
- `app/(tabs)/notifications.tsx`: `trackScreenView('notifications')`.
- `app.json`: config eklentisi ve `expotest` deep link scheme'i.
