import 'package:flutter/material.dart';
import 'package:cloud4feed_mobilesdk_flutter/cloud4feed_mobilesdk_flutter.dart';

void main() {
  runApp(const RealSurveyTestApp());
}

class RealSurveyTestApp extends StatelessWidget {
  const RealSurveyTestApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Survey SDK Real Test',
      theme: ThemeData(primarySwatch: Colors.blue, useMaterial3: true),
      // 1. KEEPS WATCHING FOR REAL SCREEN PUSHES (Optional for Tab apps, but good to keep)
      // navigatorObservers: [SurveyNavigationObserver()],
      home: const RealTestHomePage(),
    );
  }
}

class RealTestHomePage extends StatefulWidget {
  const RealTestHomePage({super.key});

  @override
  State<RealTestHomePage> createState() => _RealTestHomePageState();
}

class _RealTestHomePageState extends State<RealTestHomePage> {
  @override
  void initState() {
    super.initState();
    _initializeSDK();
  }

  Future<void> _initializeSDK() async {
    try {
      print('🚀 SDK Initializing...');

      // STORAGE source values — written to native SharedPreferences (survey_sdk_data),
      // which StorageUtils.findSpecificData scans. Feeds STORAGE custom params / exclusion
      // rules. These write to prefs directly (no SDK instance needed) so they can run before init.
      await MobileSdkFlutter.setUserProperty("customerId", "1011");
      await MobileSdkFlutter.setUserProperty("user_tier", "gold");
      await MobileSdkFlutter.setUserProperty("cart_items", "3");

      // 2. INIT & AUTO-SETUP (params sent to backend as sdkParams; used by transactional matching)
      await MobileSdkFlutter.initialize(
        "YOUR_API_KEY", // Configuration Manager -> API Key
        params: [
          {"userID": "5586925"},
          {"rank": "chef"},
          {"customerId": "1011"},
        ],
      );

      // SESSION source value — needs the SDK instance, so it must run AFTER initialize().
      await MobileSdkFlutter.setSessionData("promo_code", "WELCOME10");

      await MobileSdkFlutter.autoSetup();
      print('✅ SDK Ready');
    } catch (e) {
      print('❌ Init Error: $e');
    }
  }

  // 🔵 FIXED: THIS FUNCTION NOW TRIGGERS THE SDK
  void _handleTabChange(String screenName) {
    print('📍 Tab Changed: $screenName');

    // 🔥 CRITICAL: Manually tell the SDK we are on a new "screen"
    // This allows the Native SDK to check its "triggerScreens" list.
    MobileSdkFlutter.triggerNavigation(screenName);
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 4,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Survey SDK - Scroll & Nav Test'),
          bottom: TabBar(
            onTap: (index) {
              // Map index to Screen Names that match your Config JSON
              final screenNames = [
                'Home',
                'Notifications',
                'Profile',
                'Products',
              ];
              _handleTabChange(screenNames[index]);
            },
            tabs: const [
              Tab(icon: Icon(Icons.home), text: 'Home'),
              Tab(icon: Icon(Icons.notifications), text: 'Notifs'),
              Tab(icon: Icon(Icons.person), text: 'Profile'),
              Tab(icon: Icon(Icons.shopping_bag), text: 'Products'),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            HomeTab(), // Scroll Test is here
            NotificationsTab(), // Button Test
            ProfileTab(), // Static Page
            ProductsScreen(), // Products Page
          ],
        ),
      ),
    );
  }
}

class ProductsScreen extends StatelessWidget {
  const ProductsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Products'),
          bottom: TabBar(
            onTap: (index) {
              final tabNames = ['Mens', 'Womens', 'Kids'];
              print('🔴 TAB TAPPED: ${tabNames[index]}'); // ADD THIS

              // MANUALLY trigger tab change (temporary test)
              MobileSdkFlutter.triggerNavigation(
                tabNames[index],
              ); // TEST: try as navigation
              // MobileSdkFlutter.triggerByTabChange(tabNames[index]); // We need this method
            },
            tabs: const [
              Tab(text: 'Mens'),
              Tab(text: 'Womens'),
              Tab(text: 'Kids'),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            Center(child: Text('Mens Products')),
            Center(child: Text('Womens Products')),
            Center(child: Text('Kids Products')),
          ],
        ),
      ),
    );
  }
}

// -----------------------------------------------------------------------------
// TAB 1: HOME (SCROLL TEST)
// -----------------------------------------------------------------------------
class HomeTab extends StatelessWidget {
  const HomeTab({super.key});

  @override
  Widget build(BuildContext context) {
    // 3. USING SURVEY SCROLL VIEW
    return SurveyScrollView(
      child: Column(
        children: [
          Container(
            height: 250,
            color: Colors.blue.shade50,
            alignment: Alignment.center,
            child: const Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.swipe_down, size: 50, color: Colors.blue),
                SizedBox(height: 10),
                Text(
                  "👇 SCROLL DOWN 👇",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                Text(
                  "(Target: Handled by JSON)",
                  style: TextStyle(color: Colors.grey),
                ),
              ],
            ),
          ),
          // Generate enough items to ensure scrolling is possible
          ...List.generate(
            15,
            (index) => Card(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: ListTile(
                leading: CircleAvatar(child: Text("${index + 1}")),
                title: Text("Product Item ${index + 1}"),
                subtitle: Text("Scroll position: ${(index + 1) * 80}px approx"),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// -----------------------------------------------------------------------------
// TAB 2: NOTIFICATIONS (BUTTON TRIGGER - WORKING)
// -----------------------------------------------------------------------------
class NotificationsTab extends StatelessWidget {
  const NotificationsTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text(
            "Trigger Scenarios",
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 30),

          // ==============================================================
          // SCENARIO 1: SPECIFIC CUSTOM ID
          // Matches config: buttonTriggerId = "my_custom_button"
          // ==============================================================
          SurveyTrigger(
            triggerId: "my_custom_button",
            child: ElevatedButton.icon(
              onPressed: () {
                print("Custom Button Logic");
                ScaffoldMessenger.of(
                  context,
                ).showSnackBar(const SnackBar(content: Text("Custom Clicked")));
              },
              icon: const Icon(Icons.verified),
              label: const Text("Test Custom Trigger\n(ID: my_custom_button)"),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue.shade100,
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 15,
                ),
              ),
            ),
          ),

          const SizedBox(height: 30),

          // ==============================================================
          // SCENARIO 2: GENERIC PREDEFINED ID
          // Matches config: buttonTriggerId = null (Using 'survey_button' from predefined list)
          // ==============================================================
          SurveyTrigger(
            triggerId: "survey_button",
            child: ElevatedButton.icon(
              onPressed: () {
                print("Generic Button Logic");
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Generic Clicked")),
                );
              },
              icon: const Icon(Icons.public),
              label: const Text("Test Generic Trigger\n(ID: survey_button)"),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green.shade100,
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 15,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// -----------------------------------------------------------------------------
// TAB 3: PROFILE (NAVIGATION TEST)
// -----------------------------------------------------------------------------
class ProfileTab extends StatelessWidget {
  const ProfileTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.person, size: 100, color: Colors.blue),
          const SizedBox(height: 20),
          const Text(
            "Profile Screen",
            style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 10),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 40),
            child: Text(
              "Just by tapping the 'Profile' tab, the SDK received a navigation signal for 'Profile'.",
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey, fontSize: 16),
            ),
          ),
        ],
      ),
    );
  }
}
