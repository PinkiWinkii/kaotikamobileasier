import { mockDividedPlayers } from '../../../../__mocks__/mockPlayers';
import { SOCKET_EVENTS } from '../../../../sockets/events';
import socket from '../../../../sockets/socket';
import { listenToChangeTurn } from '../../../../sockets/socketListeners';

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {}); // Silence console logs
  jest.spyOn(console, 'error').mockImplementation(() => {}); // Silence console errors
  jest.spyOn(console, 'warn').mockImplementation(() => {}); // Silence console warnings
});

jest.mock('../../../../sockets/socket', () => ({
  on: jest.fn(),
  emit: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Socket Listeners', () => {


  it('should change the turn correctly and emits the selected player', () => {
    const setIsMyTurn = jest.fn();
    const setSelectedPlayerIndex = jest.fn();
    const setFilteredFactions = jest.fn();
  
    const dravokarPlayers = mockDividedPlayers.dravokar;
    const kaotikaPlayers = mockDividedPlayers.kaotika;
    const mockPlayer = mockDividedPlayers.kaotika[0];
  
    listenToChangeTurn(setIsMyTurn, mockPlayer, kaotikaPlayers, dravokarPlayers, setSelectedPlayerIndex, setFilteredFactions);
  
    const callback = (socket.on as jest.Mock).mock.calls.find(([event]) => event === SOCKET_EVENTS.TURN_CHANGE)?.[1];
        
    callback(mockPlayer._id);

    console.log('Llamadas a setIsMyTurn:', setIsMyTurn.mock.calls);
  
    expect(setIsMyTurn).toHaveBeenCalledWith(true);
    expect(setSelectedPlayerIndex).toHaveBeenCalledWith(dravokarPlayers.length);
    expect(setSelectedPlayerIndex).toHaveBeenCalledWith(1);
  });
});
 