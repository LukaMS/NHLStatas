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
        abbr: record.teamAbbrev?.default || '',
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

export async function fetchScores(date?: string): Promise<any[]> {
  const targetDate = date || new Date().toISOString().slice(0, 10);
  const baseUrl = `https://api-web.nhle.com/v1/scoreboard/${targetDate}`;
  const url = Platform.OS === 'web'
    ? `https://cors-anywhere.herokuapp.com/${baseUrl}`
    : baseUrl;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching scores: ${response.statusText}`);
    }
    const data = await response.json();
    const games = data.gamesByDate?.find((d: any) => d.date === targetDate)?.games || [];
    return games;
  } catch (error) {
    console.error('Error fetching NHL scores:', error);
    throw error;
  }
}

export async function fetchTeamSchedule(team: string): Promise<any[]> {
  const baseUrl = `https://api-web.nhle.com/v1/club-schedule-season/${team}/now`;
  const url = Platform.OS === 'web'
    ? `https://cors-anywhere.herokuapp.com/${baseUrl}`
    : baseUrl;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching schedule: ${response.statusText}`);
    }
    const data = await response.json();
    return data.games || [];
  } catch (error) {
    console.error('Error fetching team schedule:', error);
    throw error;
  }
}

export async function fetchTeamRoster(team: string): Promise<any> {
  const season = '20242025';
  const baseUrl = `https://api-web.nhle.com/v1/roster/${team}/${season}`;
  const url = Platform.OS === 'web'
    ? `https://cors-anywhere.herokuapp.com/${baseUrl}`
    : baseUrl;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching roster: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching team roster:', error);
    throw error;
  }
}

export async function fetchGameDetails(gameId: string): Promise<any> {
  const baseUrl = `https://api-web.nhle.com/v1/gamecenter/${gameId}/landing`;
  const url =
    Platform.OS === 'web'
      ? `https://cors-anywhere.herokuapp.com/${baseUrl}`
      : baseUrl;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching game details: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching game details:', error);
    throw error;
  }
}
