// @/components/Board.js

"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const Board = ({ bo_table }) => {
  const [board, setBoard] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/boards/${bo_table}/writes`, {
          params: {
            bo_table,
          },
        });

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