import React, { useEffect, useState } from 'react';
import Actions from '../components/Actions';
import Avatar from '../components/Avatar';
import BlockedScreen from '../components/BlockedScreen';
import CarouselContainer from '../components/CarouselContainer';
import GameEndingModal from '../components/GameEndingModal';
import HitPointsBar from '../components/HitPointsBar';
import NickName from '../components/NickName';
import PotionModal from '../components/PotionModal';
import StaminaBar from '../components/StaminaBar';
import Waiting from '../components/Waiting';
import { Factions } from '../interfaces/Factions';
import { Potion } from '../interfaces/Potion';
import { SOCKET_EMIT_EVENTS } from '../sockets/events';
import socket from '../sockets/socket';
import { clearListenToServerEventsBattleScreen, listenToChangeTurn, listenToGameEnded, listenToGameReset, listenToRemovePlayer, listenToServerEventsBattleScreen, listenToUpdatePlayer } from '../sockets/socketListeners';
import useStore from '../store/useStore';
import DeadScreen from './DeadScreen';



const BattleScreen: React.FC = () => {
  const {
    player,
    isMyTurn,
    setIsMyTurn,
    setPlayer,
    setIsLoggedIn,
    setEmail,
    selectedPotion,
    setSelectedPotion,
    isPotionModalOpen,
    setIsPotionModalOpen,
    selectedPlayer,
    setSelectedPlayer,
    selectedPlayerIndex,
    setSelectedPlayerIndex,
    kaotikaPlayers,
    dravokarPlayers,
    setDravokarPlayers,
    setKaotikaPlayers,
    updateDravokarPlayerStatus, 
    updateKaotikaPlayerStatus, 
    updatePlayerStatus,
    updateDravokarPlayerHitPoints,
    updateKaotikaPlayerHitPoints,
    updatePlayerHitPoints
  } = useStore();


  const [showWaitingScreen, setShowWaitingScreen] = useState<boolean>(true);
  const [filteredFaction, setFilteredFaction] = useState<Factions | undefined>(player?.isBetrayer ? 'KAOTIKA' : 'DRAVOKAR');
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [winner, setWinner] = useState<string>('Kaotika');

  useEffect(() => {
    listenToServerEventsBattleScreen(setKaotikaPlayers, setDravokarPlayers);
    listenToUpdatePlayer(updateDravokarPlayerHitPoints, updateKaotikaPlayerHitPoints, updatePlayerHitPoints, player);
    listenToRemovePlayer(updateDravokarPlayerStatus, updateKaotikaPlayerStatus, updatePlayerStatus, player);
    listenToChangeTurn(setIsMyTurn, player, kaotikaPlayers, dravokarPlayers, setSelectedPlayerIndex, setFilteredFaction);
    listenToGameEnded(setGameEnded, setWinner); 
    listenToGameReset(setGameEnded, setIsMyTurn, setIsLoggedIn, setEmail, setPlayer, setKaotikaPlayers, setDravokarPlayers);

    console.log('KAOTIKA PLAYERS: ', kaotikaPlayers);
    console.log('DRAVOKAR PLAYERS: ', dravokarPlayers);
    
    return () => {
      clearListenToServerEventsBattleScreen();
    };
  }, [kaotikaPlayers, dravokarPlayers, player]);

  useEffect(() => {
    if (isMyTurn) {
      if (player && !player?.isBetrayer) {
        if (dravokarPlayers.length > 0) {
          console.log('Setting filtered faction to DRAVOKAR');
          setFilteredFaction('DRAVOKAR');
        } else {
          console.log('No dravokar players available');
        }
      } else {
        if (kaotikaPlayers.length > 0) {
          console.log('Setting filtered faction to KAOTIKA');
          setFilteredFaction('KAOTIKA');
        } else {
          console.log('No kaotika players available');
        }
      }
    }
  }, [isMyTurn]);

  useEffect(() => {
    console.log('Emitting Socket: ', SOCKET_EMIT_EVENTS.SET_SELECTED_PLAYER, ' with ', selectedPlayer?._id);
    if (isMyTurn && selectedPlayer) socket.emit(SOCKET_EMIT_EVENTS.SET_SELECTED_PLAYER, selectedPlayer._id);
  }, [selectedPlayer, isMyTurn]);

  const openModal = (potion: Potion) => {
    setSelectedPotion(potion);
    setIsPotionModalOpen(true);
  };

  const closeModal = () => {
    setIsPotionModalOpen(false);
  };

  let frameBackground;

  if(player){
    frameBackground = player?.isBetrayer ? 'url(/images/frame-betrayer.webp)' : 'url(/images/frame-loyal.webp)';
  }


  return (
    <>
      {!isMyTurn && player.isAlive && !showWaitingScreen &&<> <BlockedScreen /></> }
      {!player.isAlive && <DeadScreen />}

      {showWaitingScreen && (
        <Waiting 
          setShowWaitingScreen={setShowWaitingScreen}
        />)
      }

      {/* MAIN FRAME */}
      <div
        className='w-screen h-screen flex flex-col items-center justify-center top-0 z-20'
        style={{ backgroundImage: frameBackground, backgroundSize: '100% 100%' }}
        data-testid="battle-screen"
      >
        <StaminaBar/>
        <HitPointsBar/>

        {/* AVATAR */}
        <Avatar
          avatar={player?.avatar}
          faction={player?.isBetrayer}/>

        {/* CAROUSEL CONTAINER */}
        <CarouselContainer
          setSelectedPlayer={setSelectedPlayer}
          filteredFaction={filteredFaction}
          setFilteredFaction={setFilteredFaction}
          selectedPlayerIndex={selectedPlayerIndex}
          setSelectedPlayerIndex={setSelectedPlayerIndex}
          isMyTurn={isMyTurn}
        />
        
        {/* SELECTED PLAYER NICK */}
        <NickName nickname={selectedPlayer?.nickname} />

        {/* ACTION BUTTONS */}
        <Actions
          openModal={openModal}
        />

      </div>

      {isPotionModalOpen && selectedPotion && (
        <PotionModal
          potion={selectedPotion}
          closeModal={closeModal}
        />
      )}

      {gameEnded && (
        <GameEndingModal
          winner={winner}  // Pass winner to GameEndingModal
        />
      )}
    </>
  );
};

export default BattleScreen;