// @/components/Latest.js

"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Board from './Board';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { truncateText, formatDate } from '@/utils/commonUtils';

const Latest = ({ bo_table, view_type, rows }) => {
  const [boardData, setBoardData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/board-new/writes/${bo_table}`, {
          params: {
            bo_table,
            view_type,
            rows
          }
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

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div>
      <h5>
        <Board bo_table={bo_table} />
      </h5>
      {boardData.length > 0 ? (
        <div>
          {boardData.map((board) => (
            <React.Fragment key={board.wr_id}>
              <ListItem alignItems="flex-start">
                <Grid container spacing={2}>
                  <Grid item xs={isSmallScreen ? 10 : 8}>
                    <Typography variant="body1" component="div">
                      {truncateText(board.wr_subject, 20)}
                    </Typography>
                  </Grid>
                  <Grid item xs={isSmallScreen ? 2 : 2}>
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(board.wr_datetime)}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
            </React.Fragment>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Latest;
