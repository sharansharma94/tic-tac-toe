import React from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '../context/GameContext';

const GameStatus: React.FC = () => {
  const { gameState, resetGame } = useGameContext();
  const { winner, currentPlayer, gameOver, player1Name, player2Name } = gameState;

  const getStatusMessage = () => {
    if (winner === 'DRAW') {
      return "It's a draw!";
    } else if (winner) {
      const winnerName = winner === 'X' ? player1Name : player2Name;
      return `${winnerName} wins!`;
    } else {
      const currentPlayerName = currentPlayer === 'X' ? player1Name : player2Name;
      return `${currentPlayerName}'s turn`;
    }
  };

  const getStatusColor = () => {
    if (winner === 'DRAW') return 'text-purple-600';
    if (winner === 'X' || currentPlayer === 'X') return 'text-blue-500';
    if (winner === 'O' || currentPlayer === 'O') return 'text-teal-600';
    return '';
  };

  return (
    <div className="text-center my-4">
      <motion.h2 
        className={`text-2xl font-bold mb-4 ${getStatusColor()}`}
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