import React from 'react';

const GuessPanel = ({ onGuess, disabled, showResult, currentGuess }) => {
  if (showResult) {
    return (
      <div className="text-center p-4">
        <p className="text-lg mb-4">
          Your guess: <span className="font-bold">{currentGuess}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 justify-center p-6">
      <button
        onClick={() => onGuess('strike')}
        disabled={disabled}
        className="px-8 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 
                   text-white font-bold rounded-lg text-xl transition-colors
                   disabled:cursor-not-allowed"
      >
        Strike! ⚡
      </button>
      
      <button
        onClick={() => onGuess('not_strike')}
        disabled={disabled}
        className="px-8 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 
                   text-white font-bold rounded-lg text-xl transition-colors
                   disabled:cursor-not-allowed"
      >
        Not Strike 📌
      </button>
    </div>
  );
};

export default GuessPanel;