import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, ActivityIndicator, Pressable, Platform } from 'react-native';
import { Link } from 'expo-router';
import TeamLogo from '@/components/TeamLogo';
import { fetchScores, fetchGameDetails } from '@/api/nhl';

export default function ScoresScreen() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [detailsMap, setDetailsMap] = useState<Record<string, any>>({});

  const formattedDate = selectedDate.toISOString().slice(0, 10);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchScores(formattedDate);
        setGames(data);
        const details = await Promise.all(
          data.map((g: any) => fetchGameDetails(g.id).catch(() => null))
        );
        const map: Record<string, any> = {};
        details.forEach((d, i) => {
          if (d) map[data[i].id] = d;
        });
        setDetailsMap(map);
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

  const getStatusLabel = (state: string) => {
    switch (state) {
      case 'LIVE':
      case 'CRIT':
        return 'Live';
      case 'FUT':
      case 'PRE':
        return 'Scheduled';
      case 'FINAL':
      case 'OFF':
        return 'Final';
      default:
        return state;
    }
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
      <View style={styles.quickRow}>
        <Pressable onPress={() => changeDate(-7)} style={styles.quickButton}>
          <Text>Prev Week</Text>
        </Pressable>
        <Pressable onPress={() => setSelectedDate(new Date())} style={styles.quickButton}>
          <Text>Today</Text>
        </Pressable>
        <Pressable onPress={() => changeDate(7)} style={styles.quickButton}>
          <Text>Next Week</Text>
        </Pressable>
      </View>
      {Platform.OS === 'web' && (
        // @ts-ignore - web only element
        <input
          type="date"
          value={formattedDate}
          onChange={(e) => setSelectedDate(new Date((e.target as HTMLInputElement).value))}
          style={{ marginVertical: 8, padding: 4, borderWidth: 1, borderColor: '#ccc' }}
        />
      )}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Games</Text>
        {games.length === 0 && <Text>No games scheduled.</Text>}
        {games.map((game) => (
          <Link key={game.id} href={`/game/${game.id}`} asChild>
            <Pressable style={[
              styles.gameRow,
              getStatusLabel(game.gameState) === 'Live' && styles.liveRow,
            ]}>
              <View style={styles.teamColumn}>
                <TeamLogo uri={game.awayTeam.logo} />
                <Text style={styles.teamText}>{game.awayTeam.abbrev}</Text>
              </View>
              <View style={styles.centerColumn}>
                <Text style={styles.scoreText}>
                  {game.awayTeam.score} - {game.homeTeam.score}
                </Text>
                <Text style={styles.timeText}>
                  {getStatusLabel(game.gameState) === 'Scheduled'
                    ? formatTime(game.startTimeUTC)
                    : getStatusLabel(game.gameState)}
                </Text>
                {detailsMap[game.id] && (
                  <Text style={styles.periodText}>
                    {detailsMap[game.id].summary?.scoring
                      .map((p: any) => {
                        let h = 0;
                        let a = 0;
                        p.goals.forEach((g: any) => {
                          if (g.teamAbbrev.default === game.homeTeam.abbrev) h += 1;
                          if (g.teamAbbrev.default === game.awayTeam.abbrev) a += 1;
                        });
                        return `${a}-${h}`;
                      })
                      .join('  ')}
                  </Text>
                )}
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
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4,
  },
  quickButton: {
    paddingHorizontal: 8,
  },
  gameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  liveRow: {
    backgroundColor: '#ffeeee',
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
  periodText: {
    fontSize: 12,
    color: '#333',
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
