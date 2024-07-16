// @/components/Board.js

"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { fetchBoardDataRequest } from '@/app/axios/server_api';

const Board = ({ bo_table }) => {
  const [board, setBoard] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await fetchBoardDataRequest(bo_table, { bo_table });
        const data = response.data;
        if (data.board) {
          setBoard(data.board);
        } else {
          console.error('Board data not found in the response:', data);
        }
      } catch (error) {
        console.error('Error fetching board data:', error);
      }
    };

    fetchBoardData();
  }, [bo_table]);

  return (
    <Link href={`/board/${bo_table}`} passHref style={{ textDecoration: 'none' }}>
      <Typography variant="h4" sx={{ mb: 2, fontSize: '1.5rem' }}>
        {board?.bo_subject}
      </Typography>
    </Link>
  );
};

export default Board;