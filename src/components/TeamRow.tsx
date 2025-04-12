import { StyleSheet, View, Text } from 'react-native';
import TeamLogo from './TeamLogo';

export default function TeamRow({ name, wins, losses, otl, points, gb, logo }) {
    return (
        <View style={styles.teamRow}>
          <View style={styles.logoContainer}>
          <TeamLogo uri={logo} />
          </View>
          <Text style={[styles.teamName, { flex: 3 }]}>{name}</Text>
          <Text style={styles.statText}>{wins}</Text>
          <Text style={styles.statText}>{losses}</Text>
          <Text style={styles.statText}>{otl}</Text>
          <Text style={styles.statText}>{points}</Text>
          <Text style={styles.statText}>{gb}</Text>
        </View>
      );
}

const styles = StyleSheet.create({
	teamRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      },
      logoContainer: {
        width: 40,
        height: 40,
        marginRight: 12,
      },
      logoText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
      teamName: {
        fontSize: 16,
        fontWeight: '500',
      },
      statText: {
        fontSize: 16,
        textAlign: 'center',
        flex: 1,
      },
})