import React from 'react';
import Cell from './Cell';
import { useGameContext } from '../context/GameContext';

const Board: React.FC = () => {
  const { gameState } = useGameContext();
  const { board, xMoves, oMoves, currentPlayer } = gameState;

  // Determine which cell will be deleted next (the oldest one)
  const getNextToDeleteIndex = (): number | null => {
    const moves = currentPlayer === 'X' ? xMoves : oMoves;
    return moves.length === 3 ? moves[0] : null;
  };

  const nextToDeleteIndex = getNextToDeleteIndex();

  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-md">
      {board.map((cell, index) => (
        <Cell 
          key={index}
          cell={cell}
          index={index}
          isNextToDelete={index === nextToDeleteIndex}
        />
      ))}
    </div>
  );
};

export default Board;