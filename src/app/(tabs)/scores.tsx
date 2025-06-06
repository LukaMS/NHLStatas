import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { fetchScores } from '@/api/nhl';

export default function ScoresScreen() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchScores();
        setGames(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load scores.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={styles.loading} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Today's Games</Text>
        {games.length === 0 && <Text>No games scheduled.</Text>}
        {games.map((game) => (
          <View key={game.id} style={styles.gameRow}>
            <Text style={styles.gameText}>
              {game.awayTeam.abbrev} {game.awayTeam.score} @ {game.homeTeam.abbrev} {game.homeTeam.score}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  gameRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  gameText: {
    fontSize: 16,
    textAlign: 'center',
  },
  loading: {
    marginTop: 50,
  },
  errorText: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
});
