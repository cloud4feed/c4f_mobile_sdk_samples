import React, { useCallback, useState } from 'react';
import { Alert, NativeModules, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

// Same integration as a customer Expo app (development build, not Expo Go):
// npm install cloud4feed-mobilesdk-react-native + the config plugin in app.json.
const { MobileSDK } = NativeModules;

// Get this from your Cloud4Feed account (Configuration Manager -> API Key).
const API_KEY = 'YOUR_API_KEY'; // Configuration Manager -> API Key

let sdkReady = false;

async function initializeSDK() {
  if (sdkReady) return;
  // STORAGE values (custom parameters / exclusion rules read them by key)
  await MobileSDK.setUserProperty('customerId', '1011');
  await MobileSDK.setUserProperty('user_tier', 'gold');
  await MobileSDK.setUserProperty('cart_items', '3');

  // User parameters sent with the configuration request
  await MobileSDK.initializeWithParams(API_KEY, [{ userID: '5586925' }, { rank: 'chef' }, { customerId: '1011' }]);

  // SESSION value: after initialize
  await MobileSDK.setSessionData('promo_code', 'WELCOME10');

  // Automatic detection for React Native / Expo (taps by accessibilityLabel, scroll)
  await MobileSDK.autoSetupReact();
  sdkReady = true;
}

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('mens');

  useFocusEffect(
    useCallback(() => {
      initializeSDK()
        .then(() => MobileSDK.trackScreenView('home'))
        .catch((e: Error) => console.warn('MobileSDK init failed', e));
    }, []),
  );

  const showStatus = async () => {
    const status = await MobileSDK.getDebugStatus();
    Alert.alert('SDK Status', status);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Expo SDK Test</Text>

      <TouchableOpacity style={styles.button} onPress={showStatus}>
        <Text style={styles.buttonText}>Debug SDK Status</Text>
      </TouchableOpacity>

      {/* Button trigger: accessibilityLabel = Button Trigger ID in the dashboard */}
      <TouchableOpacity style={styles.button} accessibilityLabel="my_custom_button" testID="my_custom_button">
        <Text style={styles.buttonText}>Custom: my_custom_button</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} accessibilityLabel="survey_button" testID="survey_button">
        <Text style={styles.buttonText}>Predefined: survey_button</Text>
      </TouchableOpacity>

      {/* Tab trigger: the tab label is matched against Trigger Tabs */}
      <View style={styles.tabs}>
        {['mens', 'womens'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
            accessibilityLabel={`tab_${tab}`}
            accessibilityRole="tab">
            <Text style={styles.tabText}>{tab.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Scroll trigger */}
      <Text style={styles.section}>Scroll down (scroll trigger)</Text>
      {Array.from({ length: 40 }, (_, i) => (
        <View key={i} style={styles.row}>
          <Text>Product {i + 1}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 70, backgroundColor: '#f5f5f5' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 16 },
  button: { backgroundColor: '#6a1b9a', padding: 14, borderRadius: 8, marginBottom: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  tabs: { flexDirection: 'row', marginVertical: 12 },
  tab: { flex: 1, padding: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#ddd' },
  tabActive: { borderBottomColor: '#ff6b6b' },
  tabText: { fontWeight: '600' },
  section: { fontSize: 18, fontWeight: '600', marginVertical: 12 },
  row: { backgroundColor: '#fff', padding: 18, borderRadius: 8, marginBottom: 8 },
});
