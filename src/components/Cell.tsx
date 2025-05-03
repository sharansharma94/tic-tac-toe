import React from 'react';
import { motion } from 'framer-motion';
import { CellState } from '../types/game';
import { useGameContext } from '../context/GameContext';

interface CellProps {
  cell: CellState;
  index: number;
  isNextToDelete: boolean;
}

const Cell: React.FC<CellProps> = ({ cell, index, isNextToDelete }) => {
  const { placeMarker, gameState } = useGameContext();
  
  const handleClick = () => {
    if (!gameState.gameOver && cell.value === null) {
      placeMarker(index);
    }
  };

  return (
    <motion.div
      className={`
        aspect-square flex items-center justify-center text-4xl md:text-5xl font-bold
        border-2 border-gray-300 rounded-md cursor-pointer
        ${cell.value === null ? 'hover:bg-gray-100' : ''}
        ${isNextToDelete ? 'ring-2 ring-red-500 ring-opacity-70' : ''}
        transition-colors duration-300
      `}
      onClick={handleClick}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: cell.value ? 1 : 0.8,
        backgroundColor: isNextToDelete ? 'rgba(254, 202, 202, 0.3)' : 'transparent'
      }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: cell.value === null ? 1.05 : 1 }}
    >
      {cell.value === 'X' && (
        <motion.span 
          className="text-blue-500"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          key={`x-${index}`}
        >
          X
        </motion.span>
      )}
      {cell.value === 'O' && (
        <motion.span 
          className="text-teal-600"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          key={`o-${index}`}
        >
          O
        </motion.span>
      )}
    </motion.div>
  );
};

export default Cell;