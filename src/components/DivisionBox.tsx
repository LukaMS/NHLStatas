import { StyleSheet, View, Text } from 'react-native';
import TeamRow from './TeamRow';

export default function DivisionBox({ divisionName, teams }) {
    return (
        <View style={styles.divisionBox}>
          <Text style={styles.divisionTitle}>{divisionName}</Text>
          {/* Header row for the statistics */}
          <View style={styles.statsHeader}>
            {/* A placeholder to align with the team logo column */}
            <View style={styles.logoPlaceholder} />
            <Text style={[styles.statsHeaderText, { flex: 3 }]}>Team</Text>
            <Text style={styles.statsHeaderText}>W</Text>
            <Text style={styles.statsHeaderText}>L</Text>
            <Text style={styles.statsHeaderText}>OTL</Text>
            <Text style={styles.statsHeaderText}>PTS</Text>
            <Text style={styles.statsHeaderText}>GB</Text>
          </View>
          {teams.map((team, index) => (
            <TeamRow
              key={index}
              name={team.name}
              abbr={team.abbr}
              wins={team.wins}
              losses={team.losses}
              otl={team.otl}
              points={team.points}
              gb={team.gb}
              logo={team.logo}
            />
          ))}
        </View>
      );
}

const styles = StyleSheet.create({
    divisionBox: {
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      divisionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      statsHeader: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#ddd',
        paddingBottom: 4,
        marginBottom: 8,
        alignItems: 'center',
      },
      logoPlaceholder: {
        width: 40, // Same as the team logo width
        marginRight: 12,
      },
      statsHeaderText: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
      },
})