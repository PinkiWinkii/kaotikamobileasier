import React, { useState, useEffect } from 'react';
import { SOCKET_EMIT_EVENTS } from '../sockets/events';
import socket from '../sockets/socket';
import { Player } from '../interfaces/Player';

interface GameEndingModalProps {
  role: string;
  winner: string;
  player: Player | null;
}

const GameEndingModal: React.FC<GameEndingModalProps> = ({ winner, role, player }) => {

  const [winnerSide] = useState<string>(winner);
  const [resultTextColor, setResultTextColor] = useState<string>('text-medievalSepia');

  useEffect(() => {
    console.log('Winner:', winner);
    console.log('Player:', player);

    const getResultTextColor = () => {
      if (winner === 'Draw') {
        return 'text-medievalSepia';
      }
      if (player?.isBetrayer) {
        return winner === 'Dravokar' ? 'text-green-500' : 'text-red-500';
      } else {
        return winner === 'Kaotika' ? 'text-green-500' : 'text-red-500';
      }
    };
    const color = getResultTextColor();
    console.log('Result Text Color:', color);
    setResultTextColor(color);
  }, [winner, player]);

  const handleReconnect = () => {
    console.log('Reconnect button clicked');
    socket.emit(SOCKET_EMIT_EVENTS.GAME_RESET);
  };

  const imgUrl: string = (winnerSide === 'Kaotika') ? 'url(/images/kaotikaWinner.webp)' :
    (winnerSide === 'Dravokar') ? 'url(/images/dravokarWinner.webp)' :
      'url(/images/login-background.webp)';
  console.log('Image URL:', imgUrl);

  const getResultText = () => {
    if (winner === 'Draw') {
      return 'NO ONE WON THE BATTLE';
    }
    if (player?.isBetrayer) {
      return winner === 'Dravokar' ? 'YOU WIN' : 'YOU LOST';
    } else {
      return winner === 'Kaotika' ? 'YOU WIN' : 'YOU LOST';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-51">

      <div
        className="grid grid-cols-1 grid-rows-2 flex-grow bg-black p-8 rounded shadow-lg text-center w-full h-full items-center"
        style={{ backgroundImage: imgUrl, backgroundSize: '100% 100%' }}>
        <div className='border-2  bg-darkBlue/50 rounded-lg'>
          <h2 className="text-6xl font-bold mb-4 text-medievalSepia">Game Over</h2>
          <p className={`mb-4 text-4xl ${resultTextColor}`}>{getResultText()}</p>  {/* Show result based on player status and winner */}
        </div>

        <div>{role === 'mortimer' && (

          <button
            className="text-medievalSepia p-20 place-self-item rounded text-3xl"
            onClick={handleReconnect}
            style={{
              backgroundImage: 'url(/images/end-button.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}


        </div>
      </div>
    </div>
  );
};

export default GameEndingModal;
