
import React, { useRef, useEffect, useState } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  onVideoLoad: (width: number, height: number, videoElement: HTMLVideoElement) => void;
  width?: number;
  height?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  onVideoLoad, 
  width, 
  height 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [displayDimensions, setDisplayDimensions] = useState({ width: 640, height: 360 });

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedMetadata = () => {
        // Always use 640x360 resolution
        const fixedWidth = 640;
        const fixedHeight = 360;
        
        setDisplayDimensions({ width: fixedWidth, height: fixedHeight });
        onVideoLoad(fixedWidth, fixedHeight, video);
      };

      const handleResize = () => {
        // Always maintain 640x360 even on resize
        const fixedWidth = 640;
        const fixedHeight = 360;
        setDisplayDimensions({ width: fixedWidth, height: fixedHeight });
        onVideoLoad(fixedWidth, fixedHeight, video);
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('resize', handleResize);
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('resize', handleResize);
      };
    }
  }, [onVideoLoad]);

  const videoStyle = {
    width: '640px',
    height: '360px',
    display: 'block',
    objectFit: 'fill' as const
  };

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      controls
      className="rounded-lg shadow-sm"
      style={videoStyle}
    >
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
