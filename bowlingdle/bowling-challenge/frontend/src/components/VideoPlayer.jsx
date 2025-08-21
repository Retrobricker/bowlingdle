import React from 'react';

const VideoPlayer = ({ videoId, freezeFrame, showResult }) => {
  // This is a placeholder - in production you'd integrate with YouTube API
  // or use actual video files
  
  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-900 rounded-lg overflow-hidden">
      <div className="aspect-video bg-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🎳</div>
          <p className="text-lg mb-2">Video ID: {videoId}</p>
          <p className="text-sm text-gray-300">
            {showResult ? 'Playing result...' : `Frozen at frame ${freezeFrame}`}
          </p>
        </div>
      </div>
      
      {!showResult && (
        <div className="p-4 bg-gray-700 text-white text-center">
          <p className="text-sm">
            Video frozen just before ball hits pins. Make your guess!
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;