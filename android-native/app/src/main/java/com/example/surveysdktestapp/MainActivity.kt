package com.example.surveysdktestapp

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.c4f.mobileSDK.MobileSDK
import com.example.surveysdktestapp.fragments.DashboardFragment
import com.example.surveysdktestapp.fragments.HomeFragment
import com.example.surveysdktestapp.fragments.NotificationsFragment
import com.google.android.material.bottomnavigation.BottomNavigationView

class MainActivity : AppCompatActivity() {

    companion object {
        // Get this from your Cloud4Feed account (Configuration Manager -> API Key).
        private const val API_KEY = "YOUR_API_KEY"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        setupNavigation()

        // Your app stores its own user/customer data in SharedPreferences.
        // STORAGE-based custom parameters and exclusion rules read these values on
        // the device, by key. These are the values a custom parameter with
        // source = STORAGE will pick up.
        getSharedPreferences("app_prefs", MODE_PRIVATE)
            .edit()
            .putString("customerId", "1011")      // STORAGE key: customerId
            .putString("user_tier", "gold")        // STORAGE key: user_tier
            .putInt("cart_items", 3)               // STORAGE key: cart_items
            .apply()

        // 1. Initialize the SDK with your API key and (optionally) user parameters.
        MobileSDK.initialize(
            this,
            API_KEY,
            "userID" to "5586925",
            "rank" to "chef",
            "customerId" to "1011"
        )

        // 2. Enable automatic trigger detection for this Activity.
        //    This app's BottomNavigationView keeps its own listener, so enable
        //    navigation safety to let the SDK observe it passively.
        MobileSDK.getInstance().enableNavigationSafety().autoSetup(this)

        // A SESSION custom parameter with source = SESSION and key = "promo_code"
        // reads values the app sets at runtime via setSessionData.
        MobileSDK.getInstance().setSessionData("promo_code", "WELCOME10")
    }

    private fun setupNavigation() {
        val bottomNavigation = findViewById<BottomNavigationView>(R.id.bottom_navigation)

        // Load the default screen.
        loadFragment(HomeFragment())

        bottomNavigation.setOnNavigationItemSelectedListener { item ->
            val screen = when (item.itemId) {
                R.id.navigation_home -> {
                    loadFragment(HomeFragment())
                    "Home"
                }
                R.id.navigation_dashboard -> {
                    loadFragment(DashboardFragment())
                    "Dashboard"
                }
                R.id.navigation_notifications -> {
                    loadFragment(NotificationsFragment())
                    "Notifications"
                }
                else -> null
            }

            // Report the current screen name to the SDK so navigation and exit
            // triggers fire. The name must match the "Trigger Screens" entries in
            // the dashboard. This also feeds the exit trigger (leaving the previous
            // screen) because the SDK tracks the previous screen on every report.
            if (screen != null) {
                MobileSDK.getInstance().triggerByNavigation(screen, this)
            }

            screen != null
        }
    }

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.nav_host_fragment, fragment)
            .commitNow()
    }
}
