export interface ChatMessage {
  location: 'MOON' | 'EARTH';
  message: string;
}

export interface Piece {
  color: string;
  shape: string;
  part: string;
  version: number;
  selected?: boolean;
}