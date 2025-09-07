'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VideoContextType {
  hasPlayedVideo: boolean;
  setHasPlayedVideo: (played: boolean) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};

interface VideoProviderProps {
  children: ReactNode;
}

export const VideoProvider: React.FC<VideoProviderProps> = ({ children }) => {
  const [hasPlayedVideo, setHasPlayedVideo] = useState(false);

  return (
    <VideoContext.Provider value={{ hasPlayedVideo, setHasPlayedVideo }}>
      {children}
    </VideoContext.Provider>
  );
};
