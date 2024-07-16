// src/hooks/useBoardConfig.js

import { useState, useEffect } from 'react';
import { fetchBoardDataRequest } from '@/app/axios/server_api';

export const useBoardConfig = (bo_table) => {
  const [boardConfig, setBoardConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoardConfig = async () => {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/boards/${bo_table}/writes`;
      
      try {
        const response = await fetchBoardDataRequest(bo_table);
        setBoardConfig(response.data);
      } catch (error) {
        console.error('Error fetching board settings:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardConfig();
  }, [bo_table]);

  return { boardConfig, loading, error };
};
