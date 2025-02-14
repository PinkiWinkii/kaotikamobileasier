
export const getPlayerByEmail = async (email: string) => {
  const response = await fetch(`${import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'}/api/player/${email.toLowerCase()}`);

  if (!response.ok) {
    if (response.status === 500) {
      throw new Error('Email not found');
    } else if (response.status === 403) {
      throw new Error('Game already started');
    } else if (response.status === 409) {
      throw new Error('User already logged in');
    } else {
      throw new Error('Failed to fetch player data');
    }
  }

  const playerData = await response.json();
  return playerData.data;
};
