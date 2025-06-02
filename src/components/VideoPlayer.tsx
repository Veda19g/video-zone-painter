
import React, { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  onVideoLoad: (width: number, height: number, videoElement: HTMLVideoElement) => void;
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  onVideoLoad, 
  width, 
  height, 
  maintainAspectRatio = true 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedMetadata = () => {
        onVideoLoad(video.videoWidth, video.videoHeight, video);
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    }
  }, [onVideoLoad]);

  const getVideoStyle = () => {
    const baseStyle: React.CSSProperties = { display: 'block' };
    
    if (width && height) {
      return {
        ...baseStyle,
        width: `${width}px`,
        height: maintainAspectRatio ? 'auto' : `${height}px`,
        maxWidth: `${width}px`,
        maxHeight: maintainAspectRatio ? 'none' : `${height}px`,
      };
    }
    
    if (width && !height) {
      return {
        ...baseStyle,
        width: `${width}px`,
        height: 'auto',
        maxWidth: `${width}px`,
      };
    }
    
    if (!width && height) {
      return {
        ...baseStyle,
        width: 'auto',
        height: `${height}px`,
        maxHeight: `${height}px`,
      };
    }
    
    return baseStyle;
  };

  const getVideoClassName = () => {
    if (width || height) {
      return "rounded-lg shadow-sm";
    }
    return "w-full h-auto max-h-[70vh] rounded-lg shadow-sm";
  };

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      controls
      className={getVideoClassName()}
      style={getVideoStyle()}
    >
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
