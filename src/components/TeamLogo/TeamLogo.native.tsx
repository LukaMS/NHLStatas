// Test snippet in TeamLogo.native.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { SvgXml } from 'react-native-svg';

const dummySvg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="blue"/>
</svg>`;

const TeamLogo = ({ uri }: { uri: string }) => {
  const [svgXml, setSvgXml] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // Temporarily comment out the fetch and use dummySvg
    setSvgXml(dummySvg);
    // Otherwise, if you want to test remote fetching, add console.logs here.
  }, [uri]);

  if (error) {
    return (
      <View style={[styles.fallback, styles.center]}>
        <Text style={styles.fallbackText}>Logo</Text>
      </View>
    );
  }

  if (!svgXml) {
    return <ActivityIndicator style={styles.loader} />;
  }

  return <SvgXml xml={svgXml} width={40} height={40} />;
};

const styles = StyleSheet.create({
  loader: {
    width: 40,
    height: 40,
  },
  fallback: {
    width: 40,
    height: 40,
    backgroundColor: '#ccc',
    borderRadius: 20,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 10,
    color: '#333',
  },
});

export default TeamLogo;
