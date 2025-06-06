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

export function getCurrentSeason(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const startYear = month >= 8 ? year : year - 1;
  return `${startYear}${startYear + 1}`;
}

export async function fetchTeamRoster(team: string, season?: string): Promise<any> {
  const targetSeason = season || getCurrentSeason();
  const baseUrl = `https://api-web.nhle.com/v1/roster/${team}/${targetSeason}`;
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

export async function fetchTeamStats(team: string): Promise<{wins:number; losses:number; otl:number; points:number}> {
  const baseUrl = 'https://api-web.nhle.com/v1/standings/now';
  const url = Platform.OS === 'web'
    ? `https://cors-anywhere.herokuapp.com/${baseUrl}`
    : baseUrl;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching standings: ${response.statusText}`);
  }
  const data = await response.json();
  const record = data.standings.find((r: any) => r.teamAbbrev?.default === team);
  if (!record) throw new Error('Team not found in standings');
  return {
    wins: record.wins,
    losses: record.losses,
    otl: record.otLosses,
    points: record.points,
  };
}

async function fetchPlayerStats(playerId: number, season: string) {
  const baseUrl = `https://api-web.nhle.com/v1/player/${playerId}/landing`;
  const url = Platform.OS === 'web'
    ? `https://cors-anywhere.herokuapp.com/${baseUrl}`
    : baseUrl;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error fetching player stats: ${res.statusText}`);
  }
  const data = await res.json();
  const totals = (data.seasonTotals || []).find(
    (s: any) => s.season === Number(season) && s.gameTypeId === 2
  );
  return {
    id: playerId,
    firstName: data.firstName?.default || '',
    lastName: data.lastName?.default || '',
    goals: totals?.goals || 0,
    assists: totals?.assists || 0,
    points: totals?.points || 0,
  };
}

export async function fetchTopScorers(team: string, season?: string, limit = 3) {
  const targetSeason = season || getCurrentSeason();
  const roster = await fetchTeamRoster(team, targetSeason);
  const skaters = [...(roster.forwards || []), ...(roster.defensemen || [])];
  const stats = await Promise.all(
    skaters.map((p: any) => fetchPlayerStats(p.id, targetSeason).catch(() => null))
  );
  const valid = stats.filter(Boolean) as any[];
  valid.sort((a, b) => b.points - a.points);
  return valid.slice(0, limit);
}
