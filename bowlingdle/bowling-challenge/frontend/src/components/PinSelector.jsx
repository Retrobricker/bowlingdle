import React, { useState } from 'react';

const PinSelector = ({ onPinsSelected, onSubmit, disabled, showAnswer, correctPins, userGuess, isComplete }) => {
  const [selectedPins, setSelectedPins] = useState(new Set());

  // Standard bowling pin layout
  const pinPositions = [
    [7, 8, 9, 10],
    [4, 5, 6],
    [2, 3],
    [1]
  ];

  const togglePin = (pinNumber) => {
    if (disabled || showAnswer) return;
    
    const newSelected = new Set(selectedPins);
    if (newSelected.has(pinNumber)) {
      newSelected.delete(pinNumber);
    } else {
      newSelected.add(pinNumber);
    }
    setSelectedPins(newSelected);
    onPinsSelected?.(Array.from(newSelected));
  };

  const handleSubmit = () => {
    onSubmit(Array.from(selectedPins));
  };

  const getPinStyle = (pinNumber) => {
    if (showAnswer && correctPins && userGuess) {
      // Show results: green for correct guesses, red for missed pins, gray for fallen
      const wasCorrect = correctPins.includes(pinNumber);
      const wasGuessed = userGuess.includes(pinNumber);
      
      if (wasCorrect && wasGuessed) {
        return 'bg-green-600 text-white border-green-600'; // Correctly guessed standing pin
      } else if (wasCorrect && !wasGuessed) {
        return 'bg-red-600 text-white border-red-600'; // Missed standing pin
      } else if (!wasCorrect && wasGuessed) {
        return 'bg-orange-500 text-white border-orange-500'; // Incorrectly guessed (pin was fallen)
      } else {
        return 'bg-gray-300 text-gray-600 border-gray-300'; // Fallen pin, not guessed
      }
    } else if (showAnswer && correctPins) {
      // Just show the answer without user guesses
      if (correctPins.includes(pinNumber)) {
        return 'bg-red-600 text-white border-red-600'; // Standing pin
      } else {
        return 'bg-gray-300 text-gray-600 border-gray-300'; // Fallen pin
      }
    } else {
      // User selection mode
      if (selectedPins.has(pinNumber)) {
        return 'bg-blue-600 text-white border-blue-600'; // User selected
      } else {
        return 'bg-white border-2 border-gray-400 text-gray-700 hover:bg-gray-100'; // Not selected
      }
    }
  };

  const getPinBorder = (pinNumber) => {
    // Add a circle border for pins that were guessed (when showing answer)
    if (showAnswer && userGuess && userGuess.includes(pinNumber)) {
      return 'ring-4 ring-blue-400 ring-opacity-60';
    }
    return '';
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold text-center mb-4">
        {showAnswer 
          ? 'Results - Standing Pins:' 
          : 'Which pins do you think are still standing?'
        }
      </h3>
      
      <div className="flex flex-col items-center gap-2">
        {pinPositions.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((pinNumber) => (
              <button
                key={pinNumber}
                onClick={() => togglePin(pinNumber)}
                disabled={disabled || showAnswer}
                className={`w-10 h-10 rounded-full text-sm font-bold transition-colors relative
                  ${getPinStyle(pinNumber)}
                  ${getPinBorder(pinNumber)}
                  ${(disabled || showAnswer) ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {pinNumber}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="text-center mt-4 text-sm text-gray-600">
        {showAnswer && userGuess ? (
          <div className="space-y-1">
            <div><span className="inline-block w-3 h-3 bg-green-600 rounded-full mr-2"></span>Correctly guessed</div>
            <div><span className="inline-block w-3 h-3 bg-red-600 rounded-full mr-2"></span>Missed standing pins</div>
            <div><span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-2"></span>Wrong guesses</div>
            <div><span className="inline-block w-3 h-3 bg-blue-400 rounded-full mr-2"></span>Blue ring = Your guesses</div>
          </div>
        ) : showAnswer ? (
          <>Red = Standing, Gray = Fallen</>
        ) : (
          <>Click pins to select. Blue = Your guess</>
        )}
      </div>

      {!showAnswer && !isComplete && (
        <div className="text-center mt-4">
          <button
            onClick={handleSubmit}
            disabled={disabled}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 
                       text-white font-bold rounded-lg transition-colors
                       disabled:cursor-not-allowed"
          >
            Submit Pin Guess
          </button>
        </div>
      )}
    </div>
  );
};

export default PinSelector;