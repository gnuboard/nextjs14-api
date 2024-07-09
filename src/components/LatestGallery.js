// @/components/LatestGallery.js

"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ImageList, ImageListItem, ImageListItemBar, Typography, useMediaQuery, useTheme } from '@mui/material';
import { truncateText, formatDate } from '@/utils/commonUtils';
import Board from '@/components/Board';

const LatestGallery = ({ bo_table, view_type, rows }) => {
  const [boardData, setBoardData] = useState([]);
  const theme = useTheme();

  const isExtraLargeScreen = useMediaQuery(theme.breakpoints.up('xl')); // ≥ 1536px
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg')); // ≥ 1200px
  const isMediumScreen = useMediaQuery(theme.breakpoints.up('md')); // ≥ 900px

  const getColumns = () => {
    if (isExtraLargeScreen) return 4;
    if (isLargeScreen) return 3;
    if (isMediumScreen) return 2;
    return 1;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/board-new/writes/${bo_table}`, {
          params: { bo_table, view_type, rows }
        });

        const data = response.data;
        if (data[bo_table] && Array.isArray(data[bo_table])) {
          setBoardData(data[bo_table]);
        } else {
          console.error('API response data is not in the expected format:', data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [bo_table, view_type, rows]);

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        <Board bo_table={bo_table} />
      </Typography>
      <ImageList variant="masonry" cols={getColumns()} gap={8}>
        {boardData.length > 0 ? (
          boardData.map((board) => (
            <ImageListItem key={board.wr_id}>
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${board.thumbnail.src}`}
                alt={truncateText(board.wr_subject, 20)}
                loading="lazy"
                style={{ borderRadius: '8px', width: '100%', height: 'auto' }}
              />
              <ImageListItemBar
                title={truncateText(board.wr_subject, 20)}
                subtitle={formatDate(board.wr_datetime)}
                position="below"
              />
            </ImageListItem>
          ))
        ) : (
          <Typography>Loading...</Typography>
        )}
      </ImageList>
    </div>
  );
};

export default LatestGallery;
