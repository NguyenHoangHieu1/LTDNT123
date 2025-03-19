import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import AddProductScreen from '~/screen/AddProduct';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Production creation' }} />
      <Container>
        <AddProductScreen />
      </Container>
    </>
  );
}
