export interface ChatMessage {
  location: 'MOON' | 'EARTH';
  message: string;
}

export interface Piece {
  color: string;
  shape: string;
  selected?: boolean;
}