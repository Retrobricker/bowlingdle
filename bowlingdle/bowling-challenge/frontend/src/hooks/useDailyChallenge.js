import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

export const useDailyChallenge = () => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameState, setGameState] = useState({
    attempts: 0,
    isComplete: false,
    currentGuess: null,
    showResult: false,
    points: 0
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

  // Submit guess
  const submitGuess = async (guess) => {
    if (!challenge) return;

    try {
      const response = await fetch(`${API_BASE_URL}/challenge/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guess,
          date: challenge.date
        })
      });

      if (!response.ok) {
        throw new Error('Failed to verify guess');
      }

      const result = await response.json();
      
      setGameState(prev => ({
        ...prev,
        attempts: prev.attempts + 1,
        currentGuess: guess,
        showResult: true,
        isComplete: result.correct || prev.attempts >= 2, // Max 3 attempts
        points: result.correct ? Math.max(30 - (prev.attempts * 10), 10) : prev.points
      }));

      // Update challenge with revealed answer if needed
      if (!result.correct && result.standingPins) {
        setChallenge(prev => ({
          ...prev,
          standingPins: result.standingPins,
          answer: result.answer
        }));
      }

      return result;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // Reset for next attempt
  const nextAttempt = () => {
    setGameState(prev => ({
      ...prev,
      showResult: false,
      currentGuess: null
    }));
  };

  return {
    challenge,
    loading,
    error,
    gameState,
    submitGuess,
    nextAttempt
  };
};