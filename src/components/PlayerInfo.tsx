import React from 'react';
import { useGameContext } from '../context/GameContext';

const PlayerInfo: React.FC = () => {
  const { gameState } = useGameContext();
  const { xMoves, oMoves, currentPlayer, player1Name, player2Name } = gameState;

  return (
    <div className="flex justify-between w-full max-w-md mb-4">
      <div className={`p-3 rounded-lg ${currentPlayer === 'X' ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-gray-100'} transition-colors duration-300`}>
        <h3 className="text-blue-500 font-bold mb-1">{player1Name} (X)</h3>
        <p className="text-sm text-gray-600">Markers: {xMoves.length}/3</p>
      </div>
      
      <div className={`p-3 rounded-lg ${currentPlayer === 'O' ? 'bg-teal-100 ring-2 ring-teal-500' : 'bg-gray-100'} transition-colors duration-300`}>
        <h3 className="text-teal-600 font-bold mb-1">{player2Name} (O)</h3>
        <p className="text-sm text-gray-600">Markers: {oMoves.length}/3</p>
      </div>
    </div>
  );
};

export default PlayerInfo