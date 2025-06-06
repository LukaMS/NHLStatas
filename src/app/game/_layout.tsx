import { Stack } from 'expo-router';

export default function GameLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ title: 'Game Details' }} />
    </Stack>
  );
}
