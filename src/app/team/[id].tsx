import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import TeamLogo from '@/components/TeamLogo';
import { useLocalSearchParams } from 'expo-router';
import { fetchTeamRoster, fetchTeamSchedule, getCurrentSeason, fetchTeamStats, fetchTopScorers } from '@/api/nhl';

export default function TeamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const logoUri = `https://assets.nhle.com/logos/nhl/svg/${id}_light.svg`;
  const [schedule, setSchedule] = useState<any[]>([]);
  const [roster, setRoster] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamStats, setTeamStats] = useState<{wins:number; losses:number; otl:number; points:number} | null>(null);
  const [topScorers, setTopScorers] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const season = getCurrentSeason();
        const [s, r, stats, scorers] = await Promise.all([
          fetchTeamSchedule(id as string),
          fetchTeamRoster(id as string, season),
          fetchTeamStats(id as string),
          fetchTopScorers(id as string, season),
        ]);
        setSchedule(s);
        setRoster(r);
        setTeamStats(stats);
        setTopScorers(scorers);
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
        <View style={styles.headerRow}>
          <TeamLogo uri={logoUri} style={styles.teamLogo} />
          <Text style={styles.headerText}>{id} Roster</Text>
        </View>
        {teamStats && (
          <Text style={styles.summaryText}>
            Record: {teamStats.wins}-{teamStats.losses}-{teamStats.otl} ({teamStats.points} pts)
          </Text>
        )}
        {topScorers.length > 0 && (
          <View style={styles.summarySection}>
            {topScorers.map((p) => (
              <Text key={p.id} style={styles.text}>
                {p.firstName} {p.lastName}: {p.points} pts
              </Text>
            ))}
          </View>
        )}
        {roster && (
          <View>
            {['forwards', 'defensemen', 'goalies'].map((grp) =>
              roster[grp] ? (
                <View key={grp} style={styles.rosterSection}>
                  <Text style={styles.sectionHeader}>
                    {grp.charAt(0).toUpperCase() + grp.slice(1)}
                  </Text>
                  {roster[grp].map((p: any) => (
                    <Text key={p.id} style={styles.text}>
                      {p.sweaterNumber} - {p.firstName.default} {p.lastName.default}
                    </Text>
                  ))}
                </View>
              ) : null
            )}
          </View>
        )}
        <Text style={styles.sectionHeader}>Schedule</Text>
        <View style={styles.section}>
          {schedule.map((g) => (
            <View key={g.id} style={styles.scheduleItem}>
              <Text style={styles.text}>
                {g.gameDate}: {g.awayTeam.abbrev} @ {g.homeTeam.abbrev}
              </Text>
            </View>
          ))}
        </View>
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
    marginBottom: 10,
  },
  teamLogo: {
    marginRight: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    paddingTop: 10,
  },
  rosterSection: {
    marginBottom: 16,
  },
  scheduleItem: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
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
  summaryText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  summarySection: {
    marginBottom: 8,
    alignItems: 'center',
  },
});
