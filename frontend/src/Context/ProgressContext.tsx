import React, { useState } from "react";

export interface IProgressContext {
  progress: number;
  updateProgress: () => void;
  reduceProgress: () => void;
}

interface IProgressProps {
  children: React.ReactNode;
}

export const ProgressContext = React.createContext<IProgressContext>({
  progress: 0,
  updateProgress: () => {},
  reduceProgress: () => {},
});

export const ProgressProvider: React.FC<IProgressProps> = ({ children }) => {
  const [progress, setProgress] = useState<number>(1);
  const updateProgress = () => {
    if (progress < 3) {
      setProgress((prevState) => prevState + 1);
    }
  };
  const reduceProgress = () => {
    if (progress > 0) {
      setProgress((prevState) => prevState - 1);
    }
  };
  const contextValue: IProgressContext = {
    progress,
    updateProgress,
    reduceProgress,
  };
  return (
    <ProgressContext.Provider value={contextValue}>
      {children}
    </ProgressContext.Provider>
  );
};
