import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useUnistyles } from 'react-native-unistyles';

import { HeaderButton } from '../../components/HeaderButton';

const DrawerLayout = () => {
  const { theme } = useUnistyles();

  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTitleStyle: {
          color: theme.colors.typography,
        },
        headerTintColor: theme.colors.typography,
        drawerStyle: {
          backgroundColor: theme.colors.background,
        },
        drawerLabelStyle: {
          color: theme.colors.typography,
        },
        drawerInactiveTintColor: theme.colors.typography,
      }}>
      <Drawer.Screen
        name="index"
        options={{
          headerTitle: 'Home',
          drawerLabel: 'Home',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="login"
        options={{
          headerTitle: 'Login',
          drawerLabel: 'Login',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="register"
        options={{
          headerTitle: 'Register',
          drawerLabel: 'Register',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerTitle: 'Tabs',
          drawerLabel: 'Tabs',
          drawerIcon: ({ size, color }) => (
            <MaterialIcons name="border-bottom" size={size} color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />
    </Drawer>
  );
};

export default DrawerLayout;
