import React from 'react';
import { useDailyChallenge } from './hooks/useDailyChallenge';
import BowlingMP4Player from './components/BowlingMP4Player';
// DEPRECATED import BowlingVideoPlayer from './components/BowlingVideoPlayer';
import GuessPanel from './components/GuessPanel';
import PinSelector from './components/PinSelector';
import ScoreBoard from './components/ScoreBoard';

function App() {
  const {
    challenge,
    loading,
    error,
    gameState,
    submitStrikeGuess,
    submitPinsGuess
  } = useDailyChallenge();

  const handleStrikeGuess = async (guess) => {
    await submitStrikeGuess(guess);
  };

  const handlePinsSelected = (pins) => {
    // Just for debugging
    console.log('User selected pins:', pins);
  };

  const handlePinsSubmit = (pins) => {
    submitPinsGuess(pins);
  };

  const handleVideoPhaseComplete = (completedPhase) => {
    // Video phase completed, but don't auto-advance game state
    console.log(`Video phase ${completedPhase} completed`);
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
          // Change this line in your VideoPlayer usage:
            {

              /* DEPRECATED YOUTUBE PLAYER
               <BowlingVideoPlayer
                videoId={challenge.videoId}
                startTime={challenge.startTime}
                freezeTime={challenge.freezeTime}
                endTime={challenge.endTime}
                phase={gameState.videoPhase}
                onPhaseComplete={handleVideoPhaseComplete}
              /> */

              <BowlingMP4Player
                src={`/videos/${challenge.videoId}.mp4`}
                startTime={challenge.startTime}
                freezeTime={challenge.freezeTime}
                endTime={challenge.endTime}
                phase={gameState.videoPhase}
                onPhaseComplete={handleVideoPhaseComplete}
              />


            }

            {/* Strike/Not Strike buttons */}
            {gameState.phase === 'guess' && (
              <GuessPanel
                onGuess={handleStrikeGuess}
                disabled={false}
                showResult={false}
                currentGuess={null}
              />
            )}

            {/* Show strike result */}
            {gameState.phase !== 'guess' && (
              <div className={`text-center p-6 rounded-lg ${gameState.strikeCorrect
                ? 'bg-green-100 border-2 border-green-300'
                : 'bg-red-100 border-2 border-red-300'
                }`}>
                <div className="text-xl font-bold mb-2">
                  Your guess: <span className="capitalize">{gameState.strikeGuess.replace('_', ' ')}</span>
                </div>
                <div className="text-lg mb-2">
                  Correct answer: <span className="capitalize font-bold">
                    {gameState.revealedAnswer.replace('_', ' ')}
                  </span>
                </div>
                <p className={`text-lg ${gameState.strikeCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {gameState.strikeCorrect ? 'Nice one! What pins were standing!' : '❌ Wrong, but you can still earn partial credit!'}
                </p>
              </div>
            )}

            {/* Pin selector for non-strike results */}
            {gameState.phase === 'pins' && gameState.standingPins && (
              <PinSelector
                onPinsSelected={handlePinsSelected}
                onSubmit={handlePinsSubmit}
                disabled={false}
                showAnswer={false}
                correctPins={null}
                userGuess={null}
                isComplete={false}
              />
            )}

            {/* Show final pin results */}
            {gameState.phase === 'complete' && gameState.standingPins && gameState.pinsGuess.length > 0 && (
              <PinSelector
                onPinsSelected={() => { }}
                onSubmit={() => { }}
                disabled={true}
                showAnswer={true}
                correctPins={gameState.standingPins}
                userGuess={gameState.pinsGuess}
                isComplete={true}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ScoreBoard gameState={gameState} />

            {gameState.phase === 'complete' && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <h3 className="text-lg font-bold mb-2">Challenge Complete!</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Come back tomorrow for a new challenge
                </p>
                <div className="text-xs text-gray-500">
                  Final Score: {gameState.score}/100
                </div>
                {gameState.standingPins && gameState.pinsGuess.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Pins: {gameState.pinsScore}/{gameState.standingPins.length} correct
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;