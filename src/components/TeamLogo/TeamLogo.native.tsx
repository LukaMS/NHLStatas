// components/TeamLogo/TeamLogo.native.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

interface TeamLogoProps {
  uri: string;
}

const TeamLogo = ({ uri }: TeamLogoProps) => {
  const [svgXml, setSvgXml] = useState<string | null>(null);

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await fetch(uri);
        const xml = await response.text();
        setSvgXml(xml);
      } catch (error) {
        console.error('Error fetching SVG:', error);
      }
    };
    fetchSvg();
  }, [uri]);

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
});

export default TeamLogo;
