import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchTeamRoster, fetchTeamSchedule } from '@/api/nhl';

export default function TeamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [schedule, setSchedule] = useState<any[]>([]);
  const [roster, setRoster] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [s, r] = await Promise.all([
          fetchTeamSchedule(id as string),
          fetchTeamRoster(id as string),
        ]);
        setSchedule(s);
        setRoster(r);
      } catch (err: any) {
        setError(err.message || 'Failed to load team info.');
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>{id} Roster</Text>
        {roster && (
          <View style={styles.section}>
            {['forwards','defense','goalies'].map((grp) => roster[grp] && roster[grp].map((p: any) => (
              <Text key={p.id} style={styles.text}>{p.sweaterNumber} - {p.firstName.default} {p.lastName.default}</Text>
            )))}
          </View>
        )}
        <Text style={styles.header}>Schedule</Text>
        {schedule.map((g) => (
          <Text key={g.id} style={styles.text}>
            {g.gameDate}: {g.awayTeam.abbrev} @ {g.homeTeam.abbrev}
          </Text>
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
    marginBottom: 10,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginVertical: 2,
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
