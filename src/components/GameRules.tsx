import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InfoIcon, X } from 'lucide-react';

const GameRules: React.FC = () => {
  const [showRules, setShowRules] = useState(false);

  return (
    <>
      <motion.button
        className="absolute top-4 right-4 text-gray-600 hover:text-purple-600 focus:outline-none"
        onClick={() => setShowRules(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <InfoIcon size={24} />
      </motion.button>

      <AnimatePresence>
        {showRules && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRules(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Game Rules</h2>
                <button 
                  onClick={() => setShowRules(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-3 text-gray-700">
                <p>This is a special version of Tic Tac Toe with the following rules:</p>
                
                <ol className="list-decimal ml-5 space-y-2">
                  <li>Each player can only have a maximum of <strong>3 markers</strong> on the board at any time.</li>
                  <li>When you place a 4th marker, your oldest marker will be <strong>automatically removed</strong>.</li>
                  <li>The marker that will be removed next is <strong>highlighted in red</strong>.</li>
                  <li>The first player to get 3 of their markers in a row (horizontally, vertically, or diagonally) wins.</li>
                </ol>
                
                <p className="italic mt-2">This twist on the classic game requires more strategic thinking about marker placement and timing!</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GameRules;