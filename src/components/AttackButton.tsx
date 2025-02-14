import React from 'react';
import { Player } from '../interfaces/Player';

interface AttackButtonProps {
  onClick: () => void;
  isMyTurn: boolean;
  selectedPlayer?: Player | undefined;
  player: Player | undefined;
}

const AttackButton: React.FC<AttackButtonProps> = ({ onClick, isMyTurn, selectedPlayer, player }) => {
  console.log('AttackButton rendered, selectedPlayer is betrayer? ', selectedPlayer?.isBetrayer);

  const sameFaction = player?.isBetrayer === selectedPlayer?.isBetrayer;
  const isDisabled = !isMyTurn || sameFaction;

  return (
    <button
      className={`relative px-25 py-10 text-2xl font-bold text-gray-100 ${
        isMyTurn && !sameFaction ? 'animate-saturation' : ''
      }`}
      style={{
        backgroundImage: 'url(/images/attack-button.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: isMyTurn && !sameFaction ? 'saturate(1)' : 'saturate(0)',
      }}
      onClick={onClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      data-testid="attack-button"
    >
      <span className="absolute inset-0 w-full h-full border-0 border-gray-400 rounded-lg opacity-20"></span>
    </button>
  );
};

export default AttackButton;
