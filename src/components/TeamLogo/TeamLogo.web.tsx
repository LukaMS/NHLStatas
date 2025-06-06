// components/TeamLogo/TeamLogo.web.tsx
import React from 'react';
import { ImageStyle, StyleProp, StyleSheet } from 'react-native';

interface TeamLogoProps {
  uri: string;
  style?: StyleProp<ImageStyle>;
}

const TeamLogo = ({ uri, style }: TeamLogoProps) => {
  // StyleSheet.flatten handles numbers and arrays from StyleSheet.create
  const flatStyle = StyleSheet.flatten(style) as React.CSSProperties;

  return (
    <img
      src={uri}
      alt="Team Logo"
      style={{ width: 40, height: 40, objectFit: 'contain', ...flatStyle }}
    />
  );
};

export default TeamLogo;
