// src/app/(board)/board/[bo_table]/List.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { List, ListItem, Divider, Typography, Grid, useMediaQuery, useTheme, Box } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { truncateText, formatDate } from '@/utils/commonUtils';
import { useSearchParams } from 'next/navigation';

function ListWrites({ board, writes, subCheckboxes, setSubCheckboxes }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isVerySmallScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const [ mainChecked, setMainChecked ] = useState(false);

  const handleMainCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setMainChecked(isChecked);

    const updatedSubCheckboxes = Object.fromEntries(
      Object.keys(subCheckboxes).map(key => [key, isChecked])
    );

    setSubCheckboxes(updatedSubCheckboxes);
  };

  const handleSubCheckboxChange = (id) => {
    setSubCheckboxes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const maxLengthSubject = isVerySmallScreen ? 20 : isSmallScreen ? 25 : 35;
  const maxLengthName = isVerySmallScreen ? 5 : isSmallScreen ? 6 : 10;

  return (
    <div>
      <List>
        {/* Header Row */}
        <ListItem>
          <Grid item xs={isSmallScreen ? 10 : 8} mr="20px">
            <input type="checkbox" checked={mainChecked} onChange={handleMainCheckboxChange} />
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={isSmallScreen ? 10 : 8}>
              <Typography variant="h6" component="div">
                제목
              </Typography>
            </Grid>
            {!isSmallScreen && (
              <Grid item xs={2}>
                <Typography variant="h6" component="div">
                  작성자
                </Typography>
              </Grid>
            )}
            <Grid item xs={2}>
              <Typography variant="h6" component="div">
                날짜
              </Typography>
            </Grid>
          </Grid>
        </ListItem>
        <Divider component="li" />
        {/* Data Rows or No Data Message */}
        {writes.length === 0 ? (
          <ListItem>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1" align="center">
                  게시물이 없습니다.
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
        ) : (
          writes.map((write) => (
            <React.Fragment key={write.wr_id}>
              <ListItem alignItems="flex-start">
                <Grid item xs={isSmallScreen ? 10 : 8} mr="20px">
                  <input type="checkbox" id={write.wr_id} checked={subCheckboxes[write.wr_id]} onChange={() => handleSubCheckboxChange(write.wr_id)} />
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={isSmallScreen ? 10 : 8}>
                    <Box display="flex">
                      <Typography variant="body1" component="div" mr="5px">
                        <Link href={`/board/${board.bo_table}/${write.wr_id}?${query}`} passHref>
                          {write.wr_option.includes('secret') ? <LockIcon color="action" fontSize="small" /> : ''}
                          {truncateText(write.wr_subject, maxLengthSubject)}
                        </Link>
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {write.wr_comment > 0 && `[${write.wr_comment}]`}
                      </Typography>
                    </Box>
                  </Grid>
                  {!isSmallScreen && (
                    <Grid item xs={2}>
                      <Typography variant="body2" color="textSecondary">
                        {truncateText(write.wr_name, maxLengthName)}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={2}>
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(write.wr_datetime)}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))
        )}
      </List>
    </div>
  );
}

export default ListWrites;
