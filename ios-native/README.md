# iOS (Swift) örneği

Cloud4Feed Mobile SDK'yı native bir iOS uygulamasında kullanan örnek (UIKit + bir SwiftUI sekmesi).
SDK Swift Package Manager ile GitHub'dan gelir: `https://github.com/cloud4feed/c4f_mobile_sdk_ios`,
`from: 1.0.1`.

## Çalıştırma (Mac)

1. `SurveySDKTestApp/AppDelegate.swift` içinde `apiKey = "YOUR_API_KEY"` satırına kendi API
   anahtarınızı yazın.
2. Xcode projesi [XcodeGen](https://github.com/yonaskolb/XcodeGen) ile `project.yml`'den üretilir:
   ```bash
   brew install xcodegen
   cd ios-native
   xcodegen
   open SurveySDKTestApp.xcodeproj
   ```
3. Xcode paketi indirir (File → Packages → Resolve). Bir iPhone simülatörü seçip **Run**.
   Simülatör için imza gerekmez; gerçek cihazda kendi Team'inizi seçin.

Gereksinimler: iOS 15+, Xcode 15+.

## SDK'nın eklendiği yerler

| Dosya | Ne yapılıyor |
|---|---|
| `project.yml` | Swift Package bağımlılığı, iOS 15, UIScene manifest, `surveytest` URL scheme |
| `AppDelegate.swift` | `MobileSDK.initialize(apiKey:parameters:)`, `autoSetup()`, STORAGE (UserDefaults), `setSessionData`, callback'ler |
| `SceneDelegate.swift` | Alt sekmeler (Home / Dashboard / Notifications / SwiftUI) ve deep link: `MobileSDK.handle(url:)` |
| `HomeViewController.swift` | `SurveyScreenNameProviding`, `accessibilityIdentifier` ile butonlar, scroll view |
| `DashboardViewController.swift` | `UISegmentedControl` ile Mens / Womens sekmeleri, Notifications ekranı |
| `SwiftUIDemoView.swift` | SwiftUI modifier'ları: `.surveyScreen`, `.surveyTrigger`, `SurveyScrollView` |

Deep link denemesi (Mac terminali, uygulama simülatörde kuruluyken):
```bash
xcrun simctl openurl booted "surveytest://open?campaign=summer"
```

SDK logları: Xcode konsolu veya Console.app, subsystem `com.cloud4feed.mobilesdk`.
