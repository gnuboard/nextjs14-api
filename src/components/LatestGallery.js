// @/components/LatestGallery.js

"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  ImageList, 
  ImageListItem, 
  ImageListItemBar, 
  Typography, 
  useMediaQuery, 
  useTheme,
  Box,
  CircularProgress,
  Container,
  Paper
} from '@mui/material';
import { truncateText, formatDate } from '@/utils/commonUtils';
import Board from '@/components/Board';

const LatestGallery = ({ bo_table, view_type, rows }) => {
  const [boardData, setBoardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const isExtraLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.up('md'));

  const getColumns = () => {
    if (isExtraLargeScreen) return 4;
    if (isLargeScreen) return 3;
    if (isMediumScreen) return 2;
    return 1;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bo_table, view_type, rows]);

  return (
    <Container maxWidth="lg">
      <Paper sx={{ mt: 2, p: 2, overflow: 'hidden' }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', marginBottom: theme.spacing(3) }}>
          <Board bo_table={bo_table} />
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
          </Box>
        ) : boardData.length > 0 ? (
          <Box sx={{ padding: '2.5%' }}>
            <ImageList variant="quilted" cols={getColumns()} gap={16} sx={{ overflow: 'visible' }}>
              {boardData.map((board) => (
                <ImageListItem 
                  key={board.wr_id} 
                  sx={{
                    overflow: 'hidden',
                    borderRadius: '12px',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      zIndex: 1,
                    },
                  }}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${board.thumbnail.src}`}
                    alt={truncateText(board.wr_subject, 20)}
                    loading="lazy"
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover'
                    }}
                  />
                  <ImageListItemBar
                    title={truncateText(board.wr_subject, 20)}
                    subtitle={formatDate(board.wr_datetime)}
                    sx={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', marginTop: theme.spacing(4) }}>
            No images available.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default LatestGallery;