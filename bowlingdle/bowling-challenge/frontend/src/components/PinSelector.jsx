import React, { useState } from 'react';

const PinSelector = ({ standingPins, onPinsSelected, disabled }) => {
  const [selectedPins, setSelectedPins] = useState(new Set(standingPins || []));

  // Standard bowling pin layout
  const pinPositions = [
    [7, 8, 9, 10],
    [4, 5, 6],
    [2, 3],
    [1]
  ];

  const togglePin = (pinNumber) => {
    if (disabled) return;
    
    const newSelected = new Set(selectedPins);
    if (newSelected.has(pinNumber)) {
      newSelected.delete(pinNumber);
    } else {
      newSelected.add(pinNumber);
    }
    setSelectedPins(newSelected);
    onPinsSelected?.(Array.from(newSelected));
  };

  if (!standingPins) return null;

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold text-center mb-4">
        Select the pins that are still standing:
      </h3>
      
      <div className="flex flex-col items-center gap-2">
        {pinPositions.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((pinNumber) => (
              <button
                key={pinNumber}
                onClick={() => togglePin(pinNumber)}
                disabled={disabled}
                className={`w-8 h-8 rounded-full text-sm font-bold transition-colors
                  ${selectedPins.has(pinNumber)
                    ? 'bg-red-600 text-white'
                    : 'bg-white border-2 border-gray-400 text-gray-700 hover:bg-gray-100'
                  }
                  ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                `}
              >
                {pinNumber}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="text-center mt-4 text-sm text-gray-600">
        Click pins to toggle. Red = Standing
      </div>
    </div>
  );
};

export default PinSelector;