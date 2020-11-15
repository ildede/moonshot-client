enum Locations {
  Earth = 'EARTH',
  Moon = 'MOON',
  NotKnown = 'NOT_KNOWN'
}

type MessageType = {
  type: string;
  timestamp: string;
  sender: string;
  content: string;
}

type InitialStateType = {
  messages: MessageType[];
  username: string;
  location: Locations;
  game: string;
}

type Action =
  | { type: 'TO_LOBBY', payload: { username: string }}
  | { type: 'NEW_GAME', payload: { }}
  | { type: 'TO_GAME', payload: { game: string, location: Locations }};

export type { MessageType, InitialStateType, Action }
export { Locations }