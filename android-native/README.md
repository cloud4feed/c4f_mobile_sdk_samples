# Android (Kotlin) örneği

Cloud4Feed Mobile SDK'yı native bir Android uygulamasında kullanan örnek. SDK JitPack'ten gelir:
`com.github.cloud4feed:c4f_mobile_sdk:v2.0.25`.

## Çalıştırma

1. `app/src/main/java/com/example/surveysdktestapp/MainActivity.kt` içinde `API_KEY = "YOUR_API_KEY"`
   satırına kendi API anahtarınızı yazın.
2. Android Studio → **Open** → bu klasör (`android-native`). Gradle senkronizasyonu bitince
   **Run**. Komut satırından: `./gradlew :app:installDebug` (JDK 17).

Gereksinimler: `minSdk` 24 (SDK'nın kendisi 21+), `compileSdk` 34, JDK 17.

## SDK'nın eklendiği yerler

| Dosya | Ne yapılıyor |
|---|---|
| `settings.gradle.kts` | `maven("https://jitpack.io")` deposu |
| `app/build.gradle.kts` | `implementation("com.github.cloud4feed:c4f_mobile_sdk:v2.0.25")` |
| `MainActivity.kt` | `MobileSDK.initialize(...)`, `enableNavigationSafety().autoSetup(this)`, STORAGE değerleri (`app_prefs`), `setSessionData`, alt menüde `triggerByNavigation` |
| `fragments/HomeFragment.kt` + `res/layout/fragment_home.xml` | Butonlar (`survey_button`, `my_custom_button` …) ve uzun scroll içerik |
| `fragments/DashboardFragment.kt` | TabLayout + ViewPager2 sekmeleri, `triggerByTabChange` |
| `res/values/ids.xml` | Kodda oluşturulan butonların id'leri |

Ekran adları: `Home`, `Dashboard`, `Notifications`. Sekmeler: `Mens`, `Womens`.

Logcat'te `MobileSDK` ve `SurveyApiService` etiketleriyle SDK'nın çalıştığını görebilirsiniz.
