import React from 'react';
import { useDailyChallenge } from './hooks/useDailyChallenge';
import VideoPlayer from './components/VideoPlayer';
import GuessPanel from './components/GuessPanel';
import PinSelector from './components/PinSelector';
import ScoreBoard from './components/ScoreBoard';

function App() {
  const {
    challenge,
    loading,
    error,
    gameState,
    submitGuess,
    nextAttempt
  } = useDailyChallenge();

  const handleGuess = async (guess) => {
    const result = await submitGuess(guess);
    
    // If incorrect and not complete, show next attempt after delay
    if (result && !result.correct && !gameState.isComplete) {
      setTimeout(() => {
        nextAttempt();
      }, 3000);
    }
  };

  const handlePinsSelected = (pins) => {
    // This would be used for bonus points or verification
    console.log('Selected pins:', pins);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎳</div>
          <div className="text-lg">Loading today's challenge...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-lg">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">📅</div>
          <div className="text-lg">No challenge available for today</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎳 Daily Bowling Challenge
          </h1>
          <p className="text-gray-600">
            Will it be a strike? Make your prediction!
          </p>
        </header>

        <div className="max-w-4xl mx-auto grid gap-6 lg:grid-cols-3">
          {/* Main game area */}
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayer
              videoId={challenge.videoId}
              freezeFrame={challenge.freezeFrame}
              showResult={gameState.showResult}
            />

            {!gameState.isComplete && (
              <GuessPanel
                onGuess={handleGuess}
                disabled={gameState.showResult}
                showResult={gameState.showResult}
                currentGuess={gameState.currentGuess}
              />
            )}

            {/* Show pin selector if it's not a strike */}
            {challenge.standingPins && gameState.showResult && (
              <PinSelector
                standingPins={challenge.standingPins}
                onPinsSelected={handlePinsSelected}
                disabled={gameState.isComplete}
              />
            )}

            {gameState.showResult && !gameState.isComplete && (
              <div className="text-center p-4 bg-yellow-100 rounded-lg">
                <p className="text-yellow-800">
                  {gameState.currentGuess === challenge.answer?.toLowerCase()
                    ? '🎉 Correct!'
                    : '❌ Incorrect. Try again in a moment...'}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ScoreBoard
              attempts={gameState.attempts}
              points={gameState.points}
              isComplete={gameState.isComplete}
            />

            {gameState.isComplete && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <h3 className="text-lg font-bold mb-2">Challenge Complete!</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Come back tomorrow for a new challenge
                </p>
                <div className="text-xs text-gray-500">
                  Share your score: {gameState.points} points in {gameState.attempts} attempts
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;