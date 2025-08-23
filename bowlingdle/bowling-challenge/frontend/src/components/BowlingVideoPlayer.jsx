import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const BowlingVideoPlayer = ({ videoId, startTime, freezeTime, endTime, phase, onPhaseComplete }) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const freezeReachedRef = useRef(false);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);

  // Load YouTube API
  useEffect(() => {
    const loadYouTubeAPI = () => {
      return new Promise(resolve => {
        if (window.YT && window.YT.Player) return resolve();

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(tag, firstScript);

        window.onYouTubeIframeAPIReady = resolve;
      });
    };

    loadYouTubeAPI().then(() => {
      if (containerRef.current) initializePlayer();
    });

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  const initializePlayer = () => {
    playerRef.current = new window.YT.Player(containerRef.current, {
      width: '100%',
      height: '400',
      videoId,
      playerVars: {
        controls: 0,
        modestbranding: 1,
        disablekb: 1,
        rel: 0,
        showinfo: 0,
        fs: 0,
        iv_load_policy: 3,
        autoplay: 0,
        mute: 0,
        playsinline: 1,
        start: Math.floor(startTime) // rough start, decimal handled in seek
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
  };

  const onPlayerReady = () => {
    setIsReady(true);
    seekTo(startTime); // precise decimal start


    intervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const current = playerRef.current.getCurrentTime();
        setCurrentTime(current);

        const buffer = 0.15; // small margin to account for frame rounding

        if (phase === 'initial' && current >= freezeTime - buffer && !freezeReachedRef.current) {
          freezeReachedRef.current = true;
          handlePause();
          onPhaseComplete?.('initial');
        } else if (phase === 'reveal' && current >= endTime - buffer && !freezeReachedRef.current) {
          freezeReachedRef.current = true;
          handlePause();
          onPhaseComplete?.('reveal');
        }
      }
    }, 50); // check every 50ms for precision
  };

  const onPlayerStateChange = (event) => {
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
  };

  // Seek to a precise time
  const seekTo = (time) => {
    if (!playerRef.current || !isReady) return;
    playerRef.current.seekTo(time, true);
    setCurrentTime(time);
  };

  const handlePlay = () => {
    if (!playerRef.current || !isReady) return;

    const phaseStart = phase === 'initial' ? startTime : freezeTime;
    const phaseEnd = phase === 'initial' ? freezeTime : endTime;
    const current = playerRef.current.getCurrentTime();

    if (current >= phaseEnd) seekTo(phaseStart);

    freezeReachedRef.current = false; // allow interval to trigger again
    playerRef.current.playVideo();
  };

  const handlePause = () => playerRef.current?.pauseVideo();

  const handleReplay = () => {
    const replayTime = phase === 'initial' ? startTime : freezeTime;
    seekTo(replayTime);
    setIsPlaying(false);
    freezeReachedRef.current = false;
  };

  const getPhaseText = () => (phase === 'initial' ? 'Watch the approach...' : 'See the result!');

  const getPhaseEnd = () => (phase === 'initial' ? freezeTime : endTime);

  return (
    <div className="w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden">
      <div className="aspect-video bg-gray-900 relative">
        <div ref={containerRef} className="w-full h-full" />
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="text-white text-center">
              <div className="text-4xl mb-4">🎳</div>
              <p className="text-lg">Loading video...</p>
            </div>
          </div>
        )}
        {isReady && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded text-sm">
            {getPhaseText()}
          </div>
        )}
      </div>

      <div className="bg-gray-800 p-4">
        <div className="text-white text-sm text-center mb-4">
          {Number(currentTime || 0).toFixed(1)}s / {Number(getPhaseEnd() || 0).toFixed(1)}s
          ({phase === 'initial' ? 'Approach' : 'Impact'})
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            disabled={!isReady}
            className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 
                       disabled:bg-gray-600 rounded-full text-white transition-colors
                       disabled:cursor-not-allowed"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button
            onClick={handleReplay}
            disabled={!isReady}
            className="flex items-center justify-center w-12 h-12 bg-gray-600 hover:bg-gray-700 
                       disabled:bg-gray-600 rounded-full text-white transition-colors
                       disabled:cursor-not-allowed"
            title="Replay phase"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        <div className="text-center mt-4 text-sm text-gray-400">
          {phase === 'initial'
            ? 'Video will pause before pin impact. Make your prediction!'
            : 'Watching the pin fall result...'
          }
        </div>
      </div>
    </div>
  );
};

export default BowlingVideoPlayer;
