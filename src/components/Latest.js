// @/components/Latest.js

"use client";

import React, { useEffect, useState } from 'react';
import Board from './Board';
import { useTheme } from '@mui/material/styles';
import { truncateText, formatDate } from '@/utils/commonUtils';
import { 
  List, 
  ListItem, 
  Container, 
  Paper,
  Typography,
  useMediaQuery
} from '@mui/material';
import Link from 'next/link';
import { fetchBoardNewDataRequest } from '@/app/axios/server_api';

// 작성자 이니셜을 얻는 함수
const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const Latest = ({ bo_table, view_type, rows }) => {
  const [boardData, setBoardData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBoardNewDataRequest(bo_table, { bo_table, view_type, rows });
        const data = response.data;
        if (Array.isArray(data)) {
          setBoardData(data);
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
      <Paper sx={{ mt: 2, p: 2 }}>
        <Board bo_table={bo_table} />
        {boardData.length > 0 ? (
          <List>
            {boardData.map((board) => (
              <Link key={board.wr_id} href={`/board/${bo_table}/${board.wr_id}`}>
                <ListItem 
                  disableGutters 
                  sx={{
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    py: 1,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '&:last-child': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  <ListItem>
                    <Typography variant="body1" sx={{ fontSize: '0.875rem', mr: '5px'}}>
                      {truncateText(board.wr_subject, 20)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {board.wr_comment > 0 && `[${board.wr_comment}]`}
                    </Typography>
                  </ListItem>
                  <Typography variant="body2" sx={{ color: 'text.secondary', width: '80px', textAlign: 'right', fontSize: '0.75rem' }}>
                    {formatDate(board.wr_datetime)}
                  </Typography>
                </ListItem>
              </Link>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
            로딩중이거나 데이터가 없습니다.
          </Typography>
        )}
      </Paper>
    </div>
  );
};

export default Latest;
