import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';
import LoginScreen from '~/screen/Login';
import RegisterScreen from '~/screen/Register';

export default function Register() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <Container>
        {/* <ScreenContent path="app/(drawer)/index.tsx" title="Home" /> */}
        <RegisterScreen />
      </Container>
    </>
  );
}
