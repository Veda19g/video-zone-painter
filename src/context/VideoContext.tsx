
import React, { createContext, useContext, useState, useCallback } from 'react';
import { VideoItem } from '@/types/video';

interface VideoContextType {
  videos: VideoItem[];
  addVideo: (video: Omit<VideoItem, 'id' | 'uploadDate'>) => void;
  getVideo: (id: string) => VideoItem | undefined;
  deleteVideo: (id: string) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
};

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);

  const addVideo = useCallback((video: Omit<VideoItem, 'id' | 'uploadDate'>) => {
    const newVideo: VideoItem = {
      ...video,
      id: `video-${Date.now()}`,
      uploadDate: new Date(),
    };
    setVideos(prev => [...prev, newVideo]);
  }, []);

  const getVideo = useCallback((id: string) => {
    return videos.find(video => video.id === id);
  }, [videos]);

  const deleteVideo = useCallback((id: string) => {
    setVideos(prev => prev.filter(video => video.id !== id));
  }, []);

  return (
    <VideoContext.Provider value={{ videos, addVideo, getVideo, deleteVideo }}>
      {children}
    </VideoContext.Provider>
  );
};
