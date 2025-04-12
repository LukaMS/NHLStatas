import { Platform } from 'react-native';
import { DivisionStandings, Team } from "@/types";

export async function fetchStandings(): Promise<DivisionStandings[]> {
  // Base URL for the NHL API endpoint
  const baseUrl = 'https://api-web.nhle.com/v1/standings/now';

  // Use the CORS proxy on web; use the direct URL on mobile
  const url =
    Platform.OS === 'web'
      ? `https://cors-anywhere.herokuapp.com/${baseUrl}`
      : baseUrl;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching standings: ${response.statusText}`);
    }
    const data = await response.json();

    // Group the records by divisionName
    const divisionGroups: Record<string, Team[]> = {};

    data.standings.forEach((record: any) => {
      const division = record.divisionName; // e.g., "Central", "Metropolitan", etc.
      // Map the record into our Team structure
      const team: Team = {
        name: record.teamName.default,
        wins: record.wins,
        losses: record.losses,
        otl: record.otLosses,
        points: record.points,
        gb: 0, // We'll compute this below
        logo: record.teamLogo, // Optionally use this for an Image in your UI
      };

      if (!divisionGroups[division]) {
        divisionGroups[division] = [];
      }
      divisionGroups[division].push(team);
    });

    // For each division group, compute GB based on the division leader.
    const divisions: DivisionStandings[] = Object.entries(divisionGroups).map(
      ([divisionName, teams]) => {
        // Sort teams descending by points so that the first team is the leader
        teams.sort((a, b) => b.points - a.points);
        const leaderPoints = teams[0].points;
        teams.forEach((team) => {
          team.gb = parseFloat(((leaderPoints - team.points) / 2).toFixed(1));
        });

        return { divisionName, teams };
      }
    );

    return divisions;
  } catch (error) {
    console.error('Error fetching NHL standings:', error);
    throw error;
  }
}
