import React from 'react';
import { GamesSection } from './GamesSection';

interface GamesViewProps {
  onAddStars?: (amount: number) => void;
  onGoHome?: () => void;
}

export const GamesView: React.FC<GamesViewProps> = ({ onGoHome }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-28">
      <GamesSection onGoHome={onGoHome} />
    </div>
  );
};
