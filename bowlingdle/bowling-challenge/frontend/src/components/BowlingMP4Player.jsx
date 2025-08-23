import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const BowlingMP4Player = ({ src, startTime, freezeTime, endTime, phase, onPhaseComplete }) => {
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(Number(startTime) || 0);

  // Sync video time with phase
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    if (phase === 'initial') {
      video.currentTime = Number(startTime) || 0;
      video.pause();
      setIsPlaying(false);
    } else if (phase === 'reveal') {
      video.currentTime = Number(freezeTime) || 0;
      video.play();
      setIsPlaying(true);
    }
  }, [phase, startTime, freezeTime]);

  // Monitor playback for pause triggers
  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    intervalRef.current = setInterval(() => {
      if (!video) return;
      setCurrentTime(video.currentTime);

      if (phase === 'initial' && video.currentTime >= (Number(freezeTime) || 0)) {
        video.pause();
        setIsPlaying(false);
        onPhaseComplete?.('initial');
      } else if (phase === 'reveal' && video.currentTime >= (Number(endTime) || 0)) {
        video.pause();
        setIsPlaying(false);
        onPhaseComplete?.('reveal');
      }
    }, 50); // check every 50ms for precision

    return () => clearInterval(intervalRef.current);
  }, [phase, freezeTime, endTime, onPhaseComplete]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleReplay = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = phase === 'initial' ? (Number(startTime) || 0) : (Number(freezeTime) || 0);
    videoRef.current.pause();
    setIsPlaying(false);
    setCurrentTime(videoRef.current.currentTime);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden">
      <div className="aspect-video bg-gray-900 relative">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          controls={false}
        />

        {/* Phase indicator */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded text-sm">
          {phase === 'initial' ? 'Watch the approach...' : phase === 'reveal' ? 'See the result!' : 'Loading...'}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 text-center">
        <div className="text-white text-sm mb-2">
          {(Number(currentTime) || 0).toFixed(2)}s / {(phase === 'initial' ? Number(freezeTime) : Number(endTime)) || 0}s
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={handlePlayPause}
            className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full text-white"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button
            onClick={handleReplay}
            className="flex items-center justify-center w-12 h-12 bg-gray-600 hover:bg-gray-700 rounded-full text-white"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        <div className="text-gray-400 text-sm mt-2">
          {phase === 'initial' ? 'Video will pause before pin impact. Make your prediction!' : 'Watching the pin fall result...'}
        </div>
      </div>
    </div>
  );
};

export default BowlingMP4Player;
