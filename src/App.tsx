import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GameProvider } from './context/GameContext';
import Board from './components/Board';
import GameStatus from './components/GameStatus';
import GameRules from './components/GameRules';
import PlayerInfo from './components/PlayerInfo';
import { useGameContext } from './context/GameContext';

const PlayerNameForm: React.FC = () => {
  const { setPlayerNames } = useGameContext();
  const [player1Input, setPlayer1Input] = useState('');
  const [player2Input, setPlayer2Input] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedPlayer1 = player1Input.trim();
    const trimmedPlayer2 = player2Input.trim();

    if (!trimmedPlayer1 || !trimmedPlayer2) {
      setError('Both player names are required');
      return;
    }

    if (trimmedPlayer1 === trimmedPlayer2) {
      setError('Players must have different names');
      return;
    }

    if (trimmedPlayer1.length < 2 || trimmedPlayer2.length < 2) {
      setError('Names must be at least 2 characters long');
      return;
    }

    if (trimmedPlayer1.length > 15 || trimmedPlayer2.length > 15) {
      setError('Names must be less than 15 characters');
      return;
    }

    setPlayerNames(trimmedPlayer1, trimmedPlayer2);
  };

  return (
    <motion.div
      className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">
        Enter Player Names
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="player1" className="block text-sm font-medium text-gray-700 mb-1">
            Player 1 (X)
          </label>
          <input
            type="text"
            id="player1"
            value={player1Input}
            onChange={(e) => setPlayer1Input(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter name"
          />
        </div>

        <div>
          <label htmlFor="player2" className="block text-sm font-medium text-gray-700 mb-1">
            Player 2 (O)
          </label>
          <input
            type="text"
            id="player2"
            value={player2Input}
            onChange={(e) => setPlayer2Input(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter name"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors font-medium"
        >
          Start Game
        </button>
      </form>
    </motion.div>
  );
};

const Game: React.FC = () => {
  const { gameState } = useGameContext();
  const { player1Name, player2Name } = gameState;

  if (!player1Name || !player2Name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-8">
          Tic Tac Toe
        </h1>
        <PlayerNameForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-center p-4 relative">
      <GameRules />
      
      <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-6">
        Tic Tac Toe
      </h1>
      
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full flex flex-col items-center">
        <PlayerInfo />
        <Board />
        <GameStatus />
        
        <div className="mt-4 text-sm text-gray-500 text-center">
          <p>Red highlight shows which marker will be removed next</p>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-gray-500">
        Each player can only have 3 markers at a time. Place strategically!
      </p>
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}

export default App;