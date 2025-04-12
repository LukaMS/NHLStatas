import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import DivisionBox from '@/components/DivisionBox';
import { DivisionStandings } from '@/types';
import { fetchStandings } from '@/api/nlh';

export default function HomeScreen() {
  const [standings, setStandings] = useState<DivisionStandings[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStandings() {
      try {
        const data = await fetchStandings();
        setStandings(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load standings.');
      } finally {
        setLoading(false);
      }
    }
    loadStandings();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={styles.loading} />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  } 

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>NHL Standings</Text>
        {standings.map((division, index) => (
          <DivisionBox
            key={index}
            divisionName={division.divisionName}
            teams={division.teams}
          />
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
