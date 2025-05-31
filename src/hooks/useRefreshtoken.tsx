import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/store/useAuth'


function TokenRefresher() {
  const { refreshToken, setTokens } = useAuth();

  async function refreshAccessToken() {
    if (!refreshToken) return;

    const res = await axios.post(
      'https://findcourse.net.uz/api/users/refreshToken',
      { refreshToken },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    if (res?.data?.accessToken) {
      setTokens(res.data.accessToken, refreshToken);
      console.log('✅ accessToken обновлён');
    }
  }

  useEffect(() => {
    refreshAccessToken();

    const intervalId = setInterval(() => {
      refreshAccessToken();
    }, 10 * 60 * 1000); 

    return () => clearInterval(intervalId);
  }, []);

  return null;
}

export default TokenRefresher;
