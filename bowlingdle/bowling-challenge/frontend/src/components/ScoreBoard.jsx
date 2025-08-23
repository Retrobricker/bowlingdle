import React from 'react';

const ScoreBoard = ({ gameState }) => {
  const getScoreColor = (score) => {
    if (score >= 50) return 'text-green-600';
    if (score >= 25) return 'text-yellow-600';
    if (score > 0) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreText = (score) => {
    if (score === 100) return 'Perfect!';
    if (score >= 50) return 'Great!';
    if (score >= 25) return 'Good Try';
    if (score > 0) return 'Some Credit';
    return 'Try Again Tomorrow';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Daily Challenge</h2>
      
      {gameState.phase === 'guess' && (
        <div className="text-gray-600">
          <div className="text-4xl mb-2">🎳</div>
          <p>Make your strike prediction!</p>
        </div>
      )}

      {gameState.phase === 'pins' && (
        <div className="text-gray-600">
          <div className="text-4xl mb-2">📌</div>
          <p>Now guess the standing pins!</p>
          {gameState.strikeCorrect ? (
            <p className="text-sm text-green-600 mt-2">Strike guess: ✓ Correct (100 pts)</p>
          ) : (
            <p className="text-sm text-red-600 mt-2">Strike guess: ✗ Wrong (0 pts so far)</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {gameState.strikeCorrect ? 'Already maxed out!' : 'Up to 50 pts available for pins'}
          </p>
        </div>
      )}

      {gameState.phase === 'complete' && (
        <div className="text-center">
          <div className="text-4xl mb-2">
            {gameState.score >= 50 ? '🎉' : gameState.score > 0 ? '👍' : '❌'}
          </div>
          <div className={`text-3xl font-bold mb-2 ${getScoreColor(gameState.score)}`}>
            {gameState.score}
          </div>
          <div className={`text-lg font-bold mb-2 ${getScoreColor(gameState.score)}`}>
            {getScoreText(gameState.score)}
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Strike: {gameState.strikeCorrect ? '✓' : '✗'}</p>
            {gameState.standingPins && (
              <div>
                <p>Pins: {gameState.pinsScore}/{gameState.standingPins.length} correct</p>
                {!gameState.strikeCorrect && gameState.standingPins.length > 0 && (
                  <p className="text-xs">
                    ({Math.round(50 / gameState.standingPins.length)} pts per pin)
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;