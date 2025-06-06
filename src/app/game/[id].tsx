import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import TeamLogo from '@/components/TeamLogo';
import { fetchGameDetails } from '@/api/nhl';

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [game, setGame] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGameDetails(id as string);
        setGame(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load game details.');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

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

  const scoringPlays: any[] = [];
  if (game?.summary?.scoring) {
    game.summary.scoring.forEach((period: any) => {
      period.goals.forEach((goal: any) => {
        scoringPlays.push({
          period: period.periodDescriptor.number,
          time: goal.timeInPeriod,
          player: `${goal.firstName.default} ${goal.lastName.default}`,
          team: goal.teamAbbrev.default,
        });
      });
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.teamColumn}>
            <TeamLogo uri={game.awayTeam.logo} />
            <Text style={styles.teamText}>{game.awayTeam.abbrev}</Text>
          </View>
          <Text style={styles.scoreText}>
            {game.awayTeam.score} - {game.homeTeam.score}
          </Text>
          <View style={styles.teamColumn}>
            <TeamLogo uri={game.homeTeam.logo} />
            <Text style={styles.teamText}>{game.homeTeam.abbrev}</Text>
          </View>
        </View>
        <Text style={styles.sectionHeader}>Goal Scorers</Text>
        {scoringPlays.map((goal, index) => (
          <View key={index} style={styles.goalRow}>
            <Text style={styles.goalText}>
              P{goal.period} {goal.time} - {goal.player} ({goal.team})
            </Text>
          </View>
        ))}
        {scoringPlays.length === 0 && (
          <Text style={styles.goalText}>No goals yet.</Text>
        )}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  teamColumn: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  teamText: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
  },
  goalRow: {
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  goalText: {
    fontSize: 16,
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
