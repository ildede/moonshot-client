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
}

type Action =
  | { type: 'START', payload: { username: string, location: Locations }}
  | { type: 'NEW_MESSAGE', payload: { message: MessageType }};

export type { MessageType, InitialStateType, Action }
export { Locations }