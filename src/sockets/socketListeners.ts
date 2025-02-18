import { Modifier } from '../interfaces/Modifier';
import { Player } from '../interfaces/Player';
import { SOCKET_EVENTS } from './events';
import socket from './socket';
import { resetAllStates } from '../utils/resetGame';
import { Factions } from '../interfaces/Factions';

export const listenToServerEventsBattleScreen = (setKaotikaPlayers: (players: Player[]) => void, setDravokarPlayers: (players: Player[]) => void) => {
  socket.on(SOCKET_EVENTS.RECIVE_USERS, (players: {kaotika: Player[], dravokar: Player[]}) => {
    console.log(`'${SOCKET_EVENTS.RECIVE_USERS}' socket received.`);    
    
    setKaotikaPlayers(players.kaotika);
    setDravokarPlayers(players.dravokar);
    console.log('Kaotika players received:', players.kaotika);
    console.log('Dravokar players received:', players.dravokar);
    
  });
};

export const listenToChangeTurn = (setIsMyTurn: (turn: boolean) => void,player: Player | null, kaotikaPlayers: Player[], dravokarPlayers: Player[], setSelectedPlayerIndex: (index: number) => void, setFilteredFactions: React.Dispatch<React.SetStateAction<Factions | undefined>>) => {
  socket.on(SOCKET_EVENTS.TURN_CHANGE, (_id: string) => {
    console.log(`'${SOCKET_EVENTS.TURN_CHANGE}' socket received.`);
    console.log('FIRST DRAVOKAR PLAYER NOW: ', dravokarPlayers);
    console.log('FIRST KAOTIKA PLAYER NOW: ', kaotikaPlayers);
    if (player?._id === _id) {
      setIsMyTurn(true);
      if (player && !player.isBetrayer) {
        setFilteredFactions('DRAVOKAR');
        setSelectedPlayerIndex(dravokarPlayers.length);
        setSelectedPlayerIndex(1);
      }
      else {
        setFilteredFactions('KAOTIKA');
        setSelectedPlayerIndex(kaotikaPlayers.length);
        setSelectedPlayerIndex(1);
      }
    } else {
      setIsMyTurn(false);
    }
  });
};

export const listenToInsufficientPlayers = (setInsufficientPlayers: (turn: boolean) => void) =>{
  socket.on(SOCKET_EVENTS.INSUFFICIENT_PLAYERS, () => {
    console.log(`'${SOCKET_EVENTS.INSUFFICIENT_PLAYERS}' socket received.`);
    setInsufficientPlayers(true);
  });
};  

export const listenToGameStart = (setShowWaitingScreen: React.Dispatch<React.SetStateAction<boolean>>) => {
  socket.on(SOCKET_EVENTS.GAME_STARTED, () => {
    console.log(`'${SOCKET_EVENTS.GAME_STARTED}' socket received.`);
    setShowWaitingScreen(false);
  });
};

export const listenToUpdatePlayer = (updateDravokarPlayerHitPoints: (id: string, hitpoints: number)=> void, updateKaotikaPlayerHitPoints: (id: string, hitpoints: number)=> void, updatePlayerHitPoints: (hitpoints: number)=> void, player: Player) => {
  socket.on(SOCKET_EVENTS.UPDATE_PLAYER, (updatedPlayer: {_id: string, attributes: Modifier, totalDamage: number, isBetrayer: boolean}) => {
    console.log(`'${SOCKET_EVENTS.UPDATE_PLAYER}' socket received.`);
    updateDravokarPlayerHitPoints(updatedPlayer._id, updatedPlayer.attributes.hit_points);
    updateKaotikaPlayerHitPoints(updatedPlayer._id, updatedPlayer.attributes.hit_points);
    if (player._id === updatedPlayer._id) updatePlayerHitPoints(updatedPlayer.attributes.hit_points);
  });
};

export const listenToRemovePlayer = (updateDravokarPlayerStatus: (playerId: string, status: boolean) => void, updateKaotikaPlayerStatus: (playerId: string, status: boolean) => void, updatePlayerStatus: (status: boolean) => void, player: Player) => {
  socket.on(SOCKET_EVENTS.REMOVE_PLAYER, (playerId: string) => {

    console.log(`'${SOCKET_EVENTS.REMOVE_PLAYER}' socket received.`);
    console.log('Player ID to remove:', playerId);

    updateDravokarPlayerStatus(playerId, false);
    updateKaotikaPlayerStatus(playerId, false);
    if (player._id === playerId) updatePlayerStatus(false);
  });

  socket.on(SOCKET_EVENTS.KILLED_PLAYER, (playerId: string) => {

    console.log(`'${SOCKET_EVENTS.KILLED_PLAYER}' socket received.`);
    console.log('Player ID to remove:', playerId);

    updateDravokarPlayerStatus(playerId, false);
    updateKaotikaPlayerStatus(playerId, false);
    if (player._id === playerId) updatePlayerStatus(false);
  });
};

export const listenToDisconnections = (setdisconnection: (disconnection: boolean) => void) => {
  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log(`'${SOCKET_EVENTS.DISCONNECT}' socket received.`);
    setdisconnection(true);
  });
  socket.on(SOCKET_EVENTS.CONNECT, () => {
    console.log(`'${SOCKET_EVENTS.CONNECT}' socket received.`);
    setdisconnection(false);
  });
};

export const listenToGameReset = (setGameEnded: (gameEnded: boolean) => void, 
  setIsMyTurn: (turn: boolean) => void, 
  setIsLoggedIn: (turn: boolean) => void, 
  setEmail: (email: string) => void, 
  setPlayer: (players: Player) => void,
  setKaotikaPlayers: (players: Player[]) => void, 
  setDravokarPlayers: (players: Player[]) => void) => {
  socket.on(SOCKET_EVENTS.GAME_RESET, () => {
    console.log(`'${SOCKET_EVENTS.GAME_RESET}' socket received.`);
    resetAllStates(setGameEnded, setIsMyTurn, setIsLoggedIn, setEmail, setPlayer, setKaotikaPlayers, setDravokarPlayers);
  });
};

export const listenToGameEnded = (setGameEnded: (gameEnded: boolean) => void, setWinner: (winner: string) => void) => {
  socket.on(SOCKET_EVENTS.GAME_END, (winner: string) => {
    console.log(`'${SOCKET_EVENTS.GAME_END}' socket received.`);
    setGameEnded(true);
    setWinner(winner);
  });
};

// ---- SOCKET OFFS ---- //

export const clearListenToServerEventsBattleScreen = (): void => {
  socket.off(SOCKET_EVENTS.RECIVE_USERS);
  console.log(`'${SOCKET_EVENTS.RECIVE_USERS}' socket cleared.`);

  socket.off(SOCKET_EVENTS.GAME_END);
  console.log(`'${SOCKET_EVENTS.GAME_END}' socket cleared.`);

  socket.off(SOCKET_EVENTS.UPDATE_PLAYER);
  console.log(`'${SOCKET_EVENTS.UPDATE_PLAYER}' socket cleared.`);

  socket.off(SOCKET_EVENTS.TURN_CHANGE);
  console.log(`'${SOCKET_EVENTS.TURN_CHANGE}' socket cleared.`);

  socket.off(SOCKET_EVENTS.GAME_RESET);
  console.log(`'${SOCKET_EVENTS.GAME_RESET}' socket cleared.`);
  
};

export const clearWaitingScreenEvents = ():void => {
  socket.off(SOCKET_EVENTS.INSUFFICIENT_PLAYERS);
  console.log(`'${SOCKET_EVENTS.INSUFFICIENT_PLAYERS}' socket cleared.`);
};

