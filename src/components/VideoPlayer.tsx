
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
  const [displayDimensions, setDisplayDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedMetadata = () => {
        let displayWidth = width || video.videoWidth;
        let displayHeight = height;
        
        // If only width is specified, calculate height maintaining aspect ratio
        if (width && !height) {
          const aspectRatio = video.videoHeight / video.videoWidth;
          displayHeight = width * aspectRatio;
        }
        
        // If no dimensions specified, use video's natural dimensions
        if (!width && !height) {
          displayWidth = video.videoWidth;
          displayHeight = video.videoHeight;
        }
        
        setDisplayDimensions({ width: displayWidth, height: displayHeight });
        onVideoLoad(displayWidth, displayHeight, video);
      };

      const handleResize = () => {
        if (video.videoWidth && video.videoHeight) {
          handleLoadedMetadata();
        }
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('resize', handleResize);
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('resize', handleResize);
      };
    }
  }, [onVideoLoad, width, height]);

  const videoStyle = {
    width: displayDimensions.width > 0 ? `${displayDimensions.width}px` : 'auto',
    height: displayDimensions.height > 0 ? `${displayDimensions.height}px` : 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '70vh'
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
