import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';

import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';
export default function Home() {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem('userToken').then((token) => {
      if (initialized && !token) {
        router.replace('/(auth)/login');
      }
    });
  }, [initialized]);
  useEffect(() => {
    setInitialized(true);
  }, []);
  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <Container>
        <ScreenContent path="app/(drawer)/index.tsx" title="Home" />
      </Container>
    </>
  );
}
