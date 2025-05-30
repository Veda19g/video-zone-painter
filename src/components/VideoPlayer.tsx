
import React, { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  onVideoLoad: (width: number, height: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onVideoLoad }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedMetadata = () => {
        onVideoLoad(video.videoWidth, video.videoHeight);
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    }
  }, [onVideoLoad]);

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      controls
      className="w-full h-auto max-h-[70vh] rounded-lg shadow-sm"
      style={{ display: 'block' }}
    >
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
