import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { COLORS } from './constants/theme';
import { useNotifications } from "./hooks/useNotifications";

export default function RootLayout() {
  useNotifications();

  return (
    <AuthProvider>
      <AppProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.background,
            },
            headerTintColor: COLORS.text,
            headerTitleStyle: {
              fontWeight: '600',
            },
            contentStyle: {
              backgroundColor: COLORS.background,
            },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(auth)/login"
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="(auth)/register"
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="(auth)/forgot-password"
            options={{
              title: 'Reset Password',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="create-post"
            options={{
              title: 'Create Post',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="subscription"
            options={{
              title: 'Subscription Plans',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="payment"
            options={{
              title: 'Payment',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="connect-accounts"
            options={{
              title: 'Connect Accounts',
              presentation: 'modal',
            }}
          />
        </Stack>
      </AppProvider>
    </AuthProvider>
  );
}