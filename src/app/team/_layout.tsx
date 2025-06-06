import { Stack } from 'expo-router';

export default function TeamLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ title: 'Team Info' }} />
    </Stack>
  );
}
