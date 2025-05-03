export type Player = 'X' | 'O';
export type CellValue = Player | null;

export interface CellState {
  value: CellValue;
  id: number | null;
}

export interface GameState {
  board: CellState[];
  currentPlayer: Player;
  xMoves: number[];
  oMoves: number[];
  winner: Player | 'DRAW' | null;
  gameOver: boolean;
  moveCount: number;
  player1Name: string;
  player2Name: string;
}

export interface GameContextType {
  gameState: GameState;
  placeMarker: (index: number) => void;
  resetGame: () => void;
  setPlayerNames: (player1: string, player2: string) => void;
}