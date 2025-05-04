import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GameProvider } from './context/GameContext';
import Board from './components/Board';
import GameStatus from './components/GameStatus';
import GameRules from './components/GameRules';
import PlayerInfo from './components/PlayerInfo';
import Auth from './components/Auth';
import UserList from './components/UserList';
import { useGameContext } from './context/GameContext';
import { supabase } from './lib/supabase';

const Game: React.FC = () => {
  const { gameState } = useGameContext();
  const { player1Name, player2Name } = gameState;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const isSignedIn = event === 'SIGNED_IN';
      setIsAuthenticated(isSignedIn);
      
      if (isSignedIn && session?.user) {
        setCurrentUser({
          id: session.user.id,
          name: session.user.user_metadata.full_name
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserSelect = async (userId: string, userName: string) => {
    if (!currentUser) return;

    // Create a new game session
    const { data, error } = await supabase
      .from('game_sessions')
      .insert([
        {
          player1_id: currentUser.id,
          player2_id: userId,
          game_state: {
            board: Array(9).fill(null),
            currentPlayer: 'X',
            player1Name: currentUser.name,
            player2Name: userName
          }
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating game session:', error);
      return;
    }

    // Update the game state with the new session
    if (data) {
      // Handle game session creation success
      console.log('Game session created:', data);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-8">
          Tic Tac Toe
        </h1>
        <Auth onAuthenticated={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!player1Name || !player2Name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-8">
          Tic Tac Toe
        </h1>
        <UserList 
          currentUserId={currentUser.id}
          onUserSelect={handleUserSelect}
        />
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