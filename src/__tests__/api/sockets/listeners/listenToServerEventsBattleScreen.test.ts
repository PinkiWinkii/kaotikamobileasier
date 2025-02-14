import { listenToServerEventsBattleScreen } from '../../../../sockets/socketListeners';
import { mockDividedPlayers } from '../../../../__mocks__/mockPlayers';
import { Player } from '../../../../interfaces/Player';
import { SOCKET_EVENTS } from '../../../../sockets/events';
import socket from '../../../../sockets/socket';

jest.mock('../../../../sockets/socket', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  emit: jest.fn(),
  on: jest.fn()
}));

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {}); // Silence console errors
  jest.spyOn(console, 'warn').mockImplementation(() => {}); // Silence console warnings
  jest.spyOn(console, 'log').mockImplementation(() => {}); // Silence console logs
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('listenToServerEventsBattleScreen', () => {
  it('Should Set new array to each state', () => {
    const players: {kaotika: Player[], dravokar: Player[]} = mockDividedPlayers;
    const setKaotikaPlayers = jest.fn();
    const setDravokarPlayers = jest.fn();

    listenToServerEventsBattleScreen(setKaotikaPlayers, setDravokarPlayers);

    //Mocks the emit of SOCKET_EVENTS.RECIVE_USERS with players as the data received in the event
    const callback = (socket.on as jest.Mock).mock.calls.find(([event]) => event === SOCKET_EVENTS.RECIVE_USERS)?.[1];
    callback(players);

    //Value of the data used on the first call of the mocked functions
    const newKaotikaPlayers = setKaotikaPlayers.mock.calls[0][0]; 
    const newDravokarPlayers = setDravokarPlayers.mock.calls[0][0]; 

    expect(setKaotikaPlayers).toHaveBeenCalledTimes(1);
    expect(setDravokarPlayers).toHaveBeenCalledTimes(1);

    expect(setKaotikaPlayers).toHaveBeenCalledWith(mockDividedPlayers.kaotika);
    expect(setDravokarPlayers).toHaveBeenCalledWith(mockDividedPlayers.dravokar);

    expect(newKaotikaPlayers).toEqual(mockDividedPlayers.kaotika);
    expect(newDravokarPlayers).toEqual(mockDividedPlayers.dravokar);
  });
});