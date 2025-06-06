export type Team = {
    name: string,
    abbr: string,
    wins: number,
    losses: number,
    otl: number,
    points: number,
    gb: number;
    logo?: string;
}

export type DivisionStandings = {
    divisionName: string,
    teams: Team[],
}

export type PlayerStat = {
    id: number,
    firstName: string,
    lastName: string,
    goals: number,
    assists: number,
    points: number,
}