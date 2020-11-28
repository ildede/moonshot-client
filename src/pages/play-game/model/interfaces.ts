export interface ChatMessage {
  location: 'MOON' | 'EARTH';
  message: string;
}

export interface Piece {
  part: string;
  version: number;
  selected?: boolean;
}