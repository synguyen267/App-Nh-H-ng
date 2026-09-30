import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GioHangProvider } from './src/context/GioHangContext';
import { BanProvider } from './src/context/BanContext';
import ChonBanScreen from './src/screens/ChonBanScreen';
import MenuScreen from './src/screens/MenuScreen';
import GioHangScreen from './src/screens/GioHangScreen';
import DatMonThanhCongScreen from './src/screens/DatMonThanhCongScreen';
import BepScreen from './src/screens/BepScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <BanProvider>
      <GioHangProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator
            initialRouteName="ChonBan"
            screenOptions={{ headerStyle: { backgroundColor: '#FFFFFF' }, headerShadowVisible: true, headerTintColor: '#1A1A1A', headerTitleStyle: { fontWeight: '800' } }}
          >
            <Stack.Screen name="ChonBan" component={ChonBanScreen} options={{ title: 'Chọn bàn', headerShown: false }} />
            <Stack.Screen name="ThucDon" component={MenuScreen} options={{ title: 'Thực đơn' }} />
            <Stack.Screen name="GioHang" component={GioHangScreen} options={{ title: 'Giỏ hàng' }} />
            <Stack.Screen
              name="DatMonThanhCong"
              component={DatMonThanhCongScreen}
              options={{ title: 'Xác nhận', headerBackVisible: false }}
            />
            <Stack.Screen name="Bep" component={BepScreen} options={{ title: 'Màn hình bếp' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </GioHangProvider>
    </BanProvider>
  );
}