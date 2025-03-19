import { Tabs } from 'expo-router';
import { useUnistyles } from 'react-native-unistyles';

import { TabBarIcon } from '~/components/TabBarIcon';

export default function TabLayout() {
  const { theme } = useUnistyles();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: theme.colors.astral,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
      }}>
      <Tabs.Screen
        name="productList"
        options={{
          title: 'Product list',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="productAdd"
        options={{
          title: 'Add Product',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  );
}
