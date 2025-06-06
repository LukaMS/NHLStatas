import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, ActivityIndicator, Pressable } from 'react-native';
import { Link } from 'expo-router';
import TeamLogo from '@/components/TeamLogo';
import { fetchScores } from '@/api/nhl';

export default function ScoresScreen() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formattedDate = selectedDate.toISOString().slice(0, 10);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchScores(formattedDate);
        setGames(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load scores.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [formattedDate]);

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

  const changeDate = (days: number) => {
    setSelectedDate((prev) => new Date(prev.getTime() + days * 24 * 60 * 60 * 1000));
  };

  const formatTime = (utc: string) => {
    const d = new Date(utc);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dateRow}>
        <Pressable onPress={() => changeDate(-1)} style={styles.dateButton}>
          <Text>{'<'}</Text>
        </Pressable>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <Pressable onPress={() => changeDate(1)} style={styles.dateButton}>
          <Text>{'>'}</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Games</Text>
        {games.length === 0 && <Text>No games scheduled.</Text>}
        {games.map((game) => (
          <Link key={game.id} href={`/game/${game.id}`} asChild>
            <Pressable style={styles.gameRow}>
              <View style={styles.teamColumn}>
                <TeamLogo uri={game.awayTeam.logo} />
                <Text style={styles.teamText}>{game.awayTeam.abbrev}</Text>
              </View>
              <View style={styles.centerColumn}>
                <Text style={styles.scoreText}>
                  {game.awayTeam.score} - {game.homeTeam.score}
                </Text>
                <Text style={styles.timeText}>{formatTime(game.startTimeUTC)}</Text>
              </View>
              <View style={styles.teamColumn}>
                <TeamLogo uri={game.homeTeam.logo} />
                <Text style={styles.teamText}>{game.homeTeam.abbrev}</Text>
              </View>
            </Pressable>
          </Link>
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
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  dateButton: {
    paddingHorizontal: 12,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  teamColumn: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  centerColumn: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  teamText: {
    fontSize: 14,
    marginTop: 4,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
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
