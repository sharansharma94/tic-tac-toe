import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CellState, GameState, Player, GameContextType } from '../types/game';

const checkWinner = (board: CellState[]): Player | null => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const [a, b, c] of lines) {
    if (
      board[a].value && 
      board[a].value === board[b].value && 
      board[a].value === board[c].value
    ) {
      return board[a].value as Player;
    }
  }

  return null;
};

const checkDraw = (board: CellState[], winner: Player | null): boolean => {
  return !winner && board.every(cell => cell.value !== null);
};

const initialGameState: GameState = {
  board: Array(9).fill(null).map(() => ({ value: null, id: null })),
  currentPlayer: 'X',
  xMoves: [],
  oMoves: [],
  winner: null,
  gameOver: false,
  moveCount: 0,
  player1Name: '',
  player2Name: ''
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const placeMarker = (index: number) => {
    if (gameState.gameOver || gameState.board[index].value !== null) {
      return;
    }

    const newBoard = [...gameState.board];
    const newMoveCount = gameState.moveCount + 1;
    
    const playerMoves = gameState.currentPlayer === 'X' ? [...gameState.xMoves] : [...gameState.oMoves];
    
    if (playerMoves.length >= 3) {
      const oldestMoveIndex = playerMoves.shift() as number;
      newBoard[oldestMoveIndex] = { value: null, id: null };
    }
    
    playerMoves.push(index);
    
    newBoard[index] = { 
      value: gameState.currentPlayer, 
      id: newMoveCount
    };
    
    const winner = checkWinner(newBoard);
    const isDraw = checkDraw(newBoard, winner);
    
    setGameState({
      ...gameState,
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
      xMoves: gameState.currentPlayer === 'X' ? playerMoves : gameState.xMoves,
      oMoves: gameState.currentPlayer === 'O' ? playerMoves : gameState.oMoves,
      winner: winner || (isDraw ? 'DRAW' : null),
      gameOver: !!winner || isDraw,
      moveCount: newMoveCount
    });
  };

  const resetGame = () => {
    setGameState({
      ...initialGameState,
      player1Name: gameState.player1Name,
      player2Name: gameState.player2Name
    });
  };

  const setPlayerNames = (player1: string, player2: string) => {
    setGameState({
      ...gameState,
      player1Name: player1,
      player2Name: player2
    });
  };

  return (
    <GameContext.Provider value={{ gameState, placeMarker, resetGame, setPlayerNames }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};