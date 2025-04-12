export type Team = {
    name: string,
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