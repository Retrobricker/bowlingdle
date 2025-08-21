import React from 'react';

const ScoreBoard = ({ attempts, points, isComplete }) => {
  const maxAttempts = 3;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Daily Challenge</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-100 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{points}</div>
          <div className="text-sm text-blue-600">Points</div>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-600">
            {attempts}/{maxAttempts}
          </div>
          <div className="text-sm text-gray-600">Attempts</div>
        </div>
      </div>

      {/* Attempt indicators */}
      <div className="flex justify-center gap-2 mb-4">
        {Array.from({ length: maxAttempts }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < attempts
                ? 'bg-blue-600'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {isComplete && (
        <div className="text-sm text-gray-600">
          {points > 0 ? '🎉 Great job!' : 'Better luck tomorrow!'}
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;