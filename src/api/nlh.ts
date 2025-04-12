import { DivisionStandings, Team } from "@/types";

export async function fetchStandings(): Promise<DivisionStandings[]> {
    // Replace the URL below with your actual endpoint from the NHL API Reference
    const url = 'https://cors-anywhere.herokuapp.com/https://api-web.nhle.com/v1/standings/now'; 
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching standings: ${response.statusText}`);
      }
      const data = await response.json();
  
      // data.standings is expected to be an array of team records
      // Group the records by divisionName
      const divisionGroups: Record<string, Team[]> = {};
  
      data.standings.forEach((record: any) => {
        const division = record.divisionName; // e.g., "Central", "Metropolitan", etc.
        // Map the record into our TeamStanding structure
        const team: Team = {
          name: record.teamName.default,
          wins: record.wins,
          losses: record.losses,
          otl: record.otLosses,
          points: record.points,
          gb: 0, // We will compute this below
          logo: record.teamLogo, // Optionally use this for an Image in your UI
        };
  
        if (!divisionGroups[division]) {
          divisionGroups[division] = [];
        }
        divisionGroups[division].push(team);
      });
  
      // Now, for each division group, compute the GB based on the team with the highest points.
      const divisions: DivisionStandings[] = Object.entries(divisionGroups).map(
        ([divisionName, teams]) => {
          // Sort teams descending by points so that the first team is the division leader
          teams.sort((a, b) => b.points - a.points);
          const leaderPoints = teams[0].points;
          // Compute GB for each team: (leader points - team points) / 2
          teams.forEach((team) => {
            team.gb = parseFloat(((leaderPoints - team.points) / 2).toFixed(1));
          });
  
          return {
            divisionName,
            teams,
          };
        }
      );
  
      return divisions;
    } catch (error) {
      console.error('Error fetching NHL standings:', error);
      throw error;
    }
  }