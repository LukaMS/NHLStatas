// components/TeamLogo/index.ts
import { Platform } from 'react-native';

let TeamLogo;

if (Platform.OS === 'web') {
  // Use the web version on the web
  TeamLogo = require('./TeamLogo.web').default;
} else {
  // Otherwise, use the native version (iOS/Android)
  TeamLogo = require('./TeamLogo.native').default;
}

export default TeamLogo;
