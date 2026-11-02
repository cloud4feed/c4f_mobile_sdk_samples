import React, { useEffect, useState, useRef } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NativeModules } from "react-native";

const { MobileSDK } = NativeModules;

console.log("NativeModules", NativeModules);
console.log("MobileSDK", MobileSDK);

const Tab = createBottomTabNavigator();

// ===== SDK INITIALIZATION =====
const initializeSDK = async (apiKey) => {
  try {
    console.log("🔧 [MobileSDK] Initializing...");
    if (!apiKey) throw new Error("API key is required");

    // STORAGE source values — written to native SharedPreferences (survey_sdk_data),
    // which StorageUtils.findSpecificData scans. Feeds STORAGE custom params / exclusion rules.
    await MobileSDK.setUserProperty("customerId", "1011");
    await MobileSDK.setUserProperty("user_tier", "gold");
    await MobileSDK.setUserProperty("cart_items", "3");

    // initialize params (sent to backend as sdkParams; used by transactional matching)
    await MobileSDK.initializeWithParams(apiKey, [
      { userID: "5586925" },
      { rank: "chef" },
      { customerId: "1011" },
    ]);

    // SESSION source value (in-memory, kept until process ends).
    // setSessionData SDK baslatildiktan SONRA cagrilmali ("MobileSDK not initialized" hatasi).
    await MobileSDK.setSessionData("promo_code", "WELCOME10");
    console.log("✅ [MobileSDK] Initialized successfully");
    return true;
  } catch (error) {
    console.error("❌ [MobileSDK] Initialization failed:", error);
    return false;
  }
};

const autoSetupSDK = async () => {
  try {
    console.log("⚙️ [MobileSDK] Setting up auto-triggers...");
    const result = await MobileSDK.autoSetupReact();
    if (result) {
      console.log("✅ [MobileSDK] Auto-triggers enabled successfully");
      return true;
    }
    return false;
  } catch (error) {
    console.error("❌ [MobileSDK] Auto-setup failed:", error);
    return false;
  }
};

// ===== CUSTOM IN-PAGE TABS COMPONENT =====
function CustomTabs() {
  const [activeTab, setActiveTab] = useState("mens");

  const tabs = [
    { id: "mens", label: "MENS", icon: "man" },
    { id: "womens", label: "WOMENS", icon: "woman" },
    { id: "kids", label: "KIDS", icon: "happy" },
  ];

  const handleTabPress = (tabId) => {
    console.log(`👆 Tab pressed: ${tabId}`);
    setActiveTab(tabId);
    // NO MANUAL TRIGGER - SDK auto-detects via accessibility
  };

  // Log when tab becomes active (for debugging)
  useEffect(() => {
    console.log(`📌 Active tab changed to: ${activeTab}`);
  }, [activeTab]);

  const renderContent = () => {
    const products = {
      mens: [1, 2, 3, 4],
      womens: [1, 2, 3, 4],
      kids: [1, 2, 3, 4],
    };

    const titles = {
      mens: "👕 Men's Collection",
      womens: "👚 Women's Collection",
      kids: "🧸 Kids Collection",
    };

    return (
      <View
        style={styles.tabContent}
        accessibilityLabel={`${activeTab}_tab_content`}
        importantForAccessibility="yes"
      >
        <Text style={styles.tabTitle}>{titles[activeTab]}</Text>
        {products[activeTab].map((i) => (
          <TouchableOpacity key={i} style={styles.productCard}>
            <View style={styles.productImage} />
            <View>
              <Text style={styles.productName}>
                {activeTab === "mens" && "Classic Shirt "}
                {activeTab === "womens" && "Summer Dress "}
                {activeTab === "kids" && "Kids Item "}
                {i}
              </Text>
              <Text style={styles.productPrice}>
                {activeTab === "mens" && "$49.99"}
                {activeTab === "womens" && "$59.99"}
                {activeTab === "kids" && "$29.99"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.customTabsContainer}>
      {/* Tab Headers */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabHeaders}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabHeader,
              activeTab === tab.id && styles.activeTabHeader,
            ]}
            onPress={() => handleTabPress(tab.id)}
            accessibilityLabel={`tab_${tab.id}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab.id }}
            importantForAccessibility="yes"
          >
            <Ionicons
              name={tab.icon}
              size={20}
              color={activeTab === tab.id ? "#FF6B6B" : "#666"}
            />
            <Text
              style={[
                styles.tabHeaderText,
                activeTab === tab.id && styles.activeTabHeaderText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tab Content */}
      {renderContent()}
    </View>
  );
}

// ===== HOME SCREEN =====
function HomeScreen() {
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: "$99",
      category: "Electronics",
    },
    { id: 2, name: "Running Shoes", price: "$129", category: "Sports" },
    { id: 3, name: "Coffee Maker", price: "$79", category: "Home" },
    { id: 4, name: "Yoga Mat", price: "$29", category: "Fitness" },
    { id: 5, name: "Smart Watch", price: "$199", category: "Electronics" },
    { id: 6, name: "Backpack", price: "$49", category: "Accessories" },
  ];

  const handleDebugPress = async () => {
    try {
      const status = await MobileSDK.getDebugStatus();
      console.log("📊 SDK Status:", status);
      Alert.alert("SDK Status", status);
    } catch (error) {
      console.error("Debug failed:", error);
    }
  };

  return (
    <ScrollView style={styles.screenContainer}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛍️ ShopNow</Text>
        <Text style={styles.headerSubtitle}>SDK Auto-Detection Test</Text>
      </View>

      <View style={styles.infoBanner}>
        <Ionicons name="information-circle" size={20} color="#2196F3" />
        <Text style={styles.infoText}>
          Auto-Detection Active - No Manual Triggers
        </Text>
      </View>

      <TouchableOpacity style={styles.debugButton} onPress={handleDebugPress}>
        <Ionicons name="bug-outline" size={20} color="#FFF" />
        <Text style={styles.debugButtonText}>Debug SDK Status</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.heroBanner}
        accessibilityLabel="survey_button"
      >
        <Text style={styles.heroText}>Summer Sale - 50% Off</Text>
      </TouchableOpacity>

      {/* Custom button trigger: accessibilityLabel / testID = buttonTriggerId in the panel */}
      <TouchableOpacity
        style={styles.debugButton}
        accessibilityLabel="my_custom_button"
        testID="my_custom_button"
      >
        <Text style={styles.debugButtonText}>Custom: my_custom_button</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          📜 Featured Products (Scroll Test)
        </Text>
        {products.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.productCard}
            accessibilityLabel={`product_${item.name
              .toLowerCase()
              .replace(/\s/g, "_")}`}
          >
            <View style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productCategory}>{item.category}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

// ===== PRODUCTS SCREEN =====
function ProductsScreen() {
  const isFocused = useIsFocused();
  const hasLoggedRef = useRef(false);

  useEffect(() => {
    if (isFocused && !hasLoggedRef.current) {
      console.log("🔄 Products screen focused - tabs ready");
      console.log("   • Tap WOMENS tab to trigger Survey 177 (auto-detected)");
      hasLoggedRef.current = true;
    }
  }, [isFocused]);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>🛒 Products</Text>
        <Text style={styles.screenSubtitle}>In-page tabs - Auto-detected</Text>
      </View>
      <CustomTabs />
    </View>
  );
}

// ===== NOTIFICATIONS SCREEN =====
function NotificationsScreen() {
  return (
    <View style={[styles.screenContainer, styles.centerContent]}>
      <Ionicons name="notifications-outline" size={80} color="#DDD" />
      <Text style={styles.emptyText}>No notifications</Text>
      <TouchableOpacity
        style={styles.testButton}
        accessibilityLabel="take_survey"
        testID="take_survey"
        nativeID="take_survey"
      >
        <Text style={styles.testButtonText}>Test Button (Auto-detected)</Text>
      </TouchableOpacity>
    </View>
  );
}

// ===== PROFILE SCREEN =====
function ProfileScreen() {
  const isFocused = useIsFocused();
  const hasExitedRef = useRef(false);

  useEffect(() => {
    if (isFocused) {
      console.log("📍 ENTERED Profile screen");
      hasExitedRef.current = false;
    } else {
      if (!hasExitedRef.current) {
        console.log(
          "📍 EXITED Profile screen - SDK should auto-trigger Survey 177"
        );
        hasExitedRef.current = true;
      }
    }
  }, [isFocused]);

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>👤 Profile</Text>
        <Text style={styles.screenSubtitle}>
          Exit trigger test (leave this screen)
        </Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <Text style={styles.profileName}>John Doe</Text>
        <Text style={styles.profileEmail}>john.doe@example.com</Text>

        <TouchableOpacity
          style={styles.editButton}
          accessibilityLabel="edit_profile_button"
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.menuItem}
          accessibilityLabel="wishlist_button"
        >
          <Ionicons name="heart-outline" size={22} color="#FF6B6B" />
          <Text style={styles.menuText}>Wishlist</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          accessibilityLabel="settings_button"
        >
          <Ionicons name="settings-outline" size={22} color="#666" />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="exit-outline" size={20} color="#FF6B6B" />
        <Text style={styles.infoBoxText}>
          Exit Trigger: Navigate away from this screen to see Survey 177
        </Text>
      </View>
    </ScrollView>
  );
}

// ===== MAIN APP =====
export default function App() {
  const navigationRef = useNavigationContainerRef();
  const previousRouteRef = useRef(null);

  // 🛡️ ADD THIS: A lock to prevent early tracking
  const isSdkReady = useRef(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        const apiKey = "YOUR_API_KEY"; // Configuration Manager -> API Key
        const initialized = await initializeSDK(apiKey);

        if (initialized) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await autoSetupSDK();

          // 🛡️ UNLOCK THE SDK
          isSdkReady.current = true;
          console.log("✅ SDK Ready for Navigation Events");

          // 🛡️ Manually track the initial screen now that we are ready
          if (navigationRef.current) {
            const initialRoute = navigationRef.current.getCurrentRoute()?.name;
            if (initialRoute) {
              previousRouteRef.current = initialRoute;
              MobileSDK.trackScreenView(initialRoute.toLowerCase());
            }
          }
        }
      } catch (error) {
        console.error("❌ Init failed:", error);
      }
    };

    initApp();
  }, []);

  // Capture all subsequent transitions (This calculates the EXIT!)
  const onStateChange = () => {
    // 🛡️ If SDK is not initialized yet, ignore the navigation event!
    if (!isSdkReady.current || !navigationRef.current) return; 

    const currentRoute = navigationRef.current.getCurrentRoute();
    const currentRouteName = currentRoute?.name;

    if (currentRouteName && previousRouteRef.current !== currentRouteName) {
      console.log(`🧭 Navigation detected: ${previousRouteRef.current || "start"} → ${currentRouteName}`);

      // Now this is safe!
      MobileSDK.trackScreenView(currentRouteName.toLowerCase());
      previousRouteRef.current = currentRouteName;
    }
  };

  return (
    <NavigationContainer ref={navigationRef} onStateChange={onStateChange}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home")
              iconName = focused ? "home" : "home-outline";
            else if (route.name === "Products")
              iconName = focused ? "grid" : "grid-outline";
            else if (route.name === "Notifications")
              iconName = focused ? "notifications" : "notifications-outline";
            else if (route.name === "Profile")
              iconName = focused ? "person" : "person-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#FF6B6B",
          tabBarInactiveTintColor: "gray",
          headerShown: false,
          tabBarAccessibilityLabel: route.name.toLowerCase(),
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Products" component={ProductsScreen} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// ===== STYLES ===== (keep all your existing styles - they're perfect!)
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    margin: 20,
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  infoText: {
    marginLeft: 8,
    color: "#2196F3",
    fontSize: 14,
    flex: 1,
  },
  debugButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9C27B0",
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
  },
  debugButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  heroBanner: {
    backgroundColor: "#FF6B6B",
    margin: 20,
    marginTop: 0,
    padding: 25,
    borderRadius: 10,
    alignItems: "center",
  },
  heroText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#FFF",
    margin: 20,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    backgroundColor: "#DDD",
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  productCategory: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginTop: 4,
  },
  screenHeader: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  screenSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  customTabsContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  tabHeaders: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  tabHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginRight: 5,
  },
  activeTabHeader: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF6B6B",
  },
  tabHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginLeft: 8,
  },
  activeTabHeaderText: {
    color: "#FF6B6B",
  },
  tabContent: {
    flex: 1,
    padding: 15,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 10,
    marginBottom: 20,
  },
  testButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  testButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  profileCard: {
    backgroundColor: "#FFF",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFF",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  editButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    margin: 20,
    marginTop: 0,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  infoBoxText: {
    marginLeft: 10,
    color: "#FF6B6B",
    fontSize: 14,
    flex: 1,
  },
});
