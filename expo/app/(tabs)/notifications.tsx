import React, { useCallback } from 'react';
import { NativeModules, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

const { MobileSDK } = NativeModules;

// Navigation / exit trigger: the screen name must match Trigger Screens in the dashboard.
export default function NotificationsScreen() {
  useFocusEffect(
    useCallback(() => {
      MobileSDK.trackScreenView('notifications').catch(() => {});
    }, []),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <Text>No notifications</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
});
