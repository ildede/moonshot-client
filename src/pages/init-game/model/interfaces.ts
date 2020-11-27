export interface WaitingGame {
  gameId: string;
  location: Locations;
  creationTime: string;
  username: string;
}
export enum Locations {
  Earth = 'EARTH',
  Moon = 'MOON'
}