import React from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '../context/GameContext';

const GameStatus: React.FC = () => {
  const { gameState, resetGame } = useGameContext();
  const { winner, currentPlayer, gameOver } = gameState;

  const getStatusMessage = () => {
    if (winner === 'DRAW') {
      return "It's a draw!";
    } else if (winner) {
      return `Player ${winner} wins!`;
    } else {
      return `Player ${currentPlayer}'s turn`;
    }
  };

  return (
    <div className="text-center my-4">
      <motion.h2 
        className={`text-2xl font-bold mb-4 ${
          winner === 'X' ? 'text-blue-500' : 
          winner === 'O' ? 'text-teal-600' : 
          winner === 'DRAW' ? 'text-purple-600' : 
          currentPlayer === 'X' ? 'text-blue-500' : 'text-teal-600'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={getStatusMessage()} // Re-animate when message changes
      >
        {getStatusMessage()}
      </motion.h2>

      {gameOver && (
        <motion.button
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full mt-2 transition-colors"
          onClick={resetGame}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          New Game
        </motion.button>
      )}
    </div>
  );
};

export default GameStatus;