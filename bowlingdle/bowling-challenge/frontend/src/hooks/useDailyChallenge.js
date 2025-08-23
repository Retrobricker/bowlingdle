import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

export const useDailyChallenge = () => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameState, setGameState] = useState({
    phase: 'guess', // 'guess', 'reveal', 'pins', 'complete'
    videoPhase: 'initial', // 'initial', 'reveal'  <-- ADD THIS
    strikeGuess: null,
    strikeCorrect: false,
    pinsGuess: [],
    pinsCorrect: false,
    revealedAnswer: null,
    standingPins: null,
    score: 0,
    pinsScore: 0
  });

  // Fetch today's challenge
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/challenge/today`);
        if (!response.ok) {
          throw new Error('Failed to fetch challenge');
        }
        const data = await response.json();
        setChallenge(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, []);

  // Submit strike/not strike guess
  const submitStrikeGuess = async (guess) => {
    if (!challenge) return;

    try {
      const response = await fetch(`${API_BASE_URL}/challenge/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess, date: challenge.date })
      });

      if (!response.ok) throw new Error('Failed to verify guess');

      const result = await response.json();
      const isStrikeCorrect = result.correct;

      // Initial score
      const initialScore = isStrikeCorrect ? 50 : 0;

      setGameState(prev => {
        const nextState = {
          ...prev,
          strikeGuess: guess,
          strikeCorrect: isStrikeCorrect,
          revealedAnswer: result.answer,
          standingPins: result.standingPins,
          videoPhase: 'reveal',
          score: initialScore
        };

        // Decide next phase
        nextState.phase = result.answer === 'strike' ? 'complete' : 'pins';

        return nextState;
      });

      return result;

    } catch (err) {
      setError(err.message);
      return null;
    }
  };



  const handleVideoPhaseComplete = (completedPhase) => {
    if (completedPhase === 'initial') {
      // Initial phase done, now show guess buttons
      // Video stays paused at freeze frame
    }
    // Don't automatically advance - let user control when to see reveal
  };

  // Submit pins guess
  const submitPinsGuess = (selectedPins) => {
    if (!gameState.standingPins) return;

    const correctPins = new Set(gameState.standingPins);
    const guessedPins = new Set(selectedPins);

    const correctGuesses = Array.from(guessedPins).filter(pin => correctPins.has(pin)).length;
    const totalPins = correctPins.size;

    let finalScore = gameState.score; // start from strike guess

    // Only add pins points if the answer was "not_strike"
    if (gameState.revealedAnswer === 'not_strike') {
      if (totalPins === 0) {
        finalScore += 0; // unlikely, just safety
      } else if (correctGuesses === totalPins && guessedPins.size === totalPins) {
        finalScore += 50; // got all pins exactly
      } else {
        const pointsPerPin = 50 / totalPins;
        finalScore += Math.round(pointsPerPin * correctGuesses); // partial credit
      }
    }

    setGameState(prev => ({
      ...prev,
      pinsGuess: selectedPins,
      pinsCorrect: correctGuesses === totalPins && guessedPins.size === totalPins,
      phase: 'complete',
      score: finalScore,
      pinsScore: correctGuesses
    }));
  };



  return {
    challenge,
    loading,
    error,
    gameState,
    submitStrikeGuess,
    submitPinsGuess,
    handleVideoPhaseComplete
  };
};