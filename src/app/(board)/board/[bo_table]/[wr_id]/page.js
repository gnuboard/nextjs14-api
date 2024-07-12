// src/app/(board)/board/[bo_table]/[wr_id]/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Typography, Box, CircularProgress, Paper, Avatar, Grid, Button, ButtonGroup } from '@mui/material';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { deepPurple } from '@mui/material/colors';
import Comment from '@/components/Comment';

async function fetchWriteById(bo_table, wr_id) {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/boards/${bo_table}/writes/${wr_id}`);
  return response.data;
}

function WriteDetailsPage() {
  const { bo_table, wr_id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [write, setWrite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bo_table && wr_id) {
      fetchWriteById(bo_table, wr_id)
        .then((data) => {
          setWrite(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching write details:', error);
          setLoading(false);
        });
    }
  }, [bo_table, wr_id]);

  const handleNavigation = (path) => {
    const query = searchParams.toString();
    router.push(`${path}?${query}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!write) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">게시물을 찾을 수 없습니다.</Typography>
      </Box>
    );
  }

  return (
    <Box p={3} display="flex" justifyContent="center">
      <Paper elevation={3} sx={{ p: 4, maxWidth: '800px', width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {write.wr_subject}
        </Typography>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item>
            <Avatar sx={{ bgcolor: deepPurple[500] }}>
              {write.wr_name.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">
              작성자: {write.wr_name}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              작성일: {new Date(write.wr_datetime).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="body1" component="div" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(write.wr_content) }} />
        <ButtonGroup variant="outlined" fullWidth sx={{ mt: 3 }}>
          <Button onClick={() => handleNavigation(`/board/${bo_table}`)}>목록</Button>
          <Button onClick={() => handleNavigation(`/board/${bo_table}/write`)}>쓰기</Button>
          <Button onClick={() => handleNavigation(`/board/${bo_table}/previous/${wr_id}`)}>이전글</Button>
          <Button onClick={() => handleNavigation(`/board/${bo_table}/next/${wr_id}`)}>다음글</Button>
        </ButtonGroup>
        {write?.comments.map((comment, index) => (
          <Comment 
            key={index}
            index={index}
            comment={comment}
          />
        ))}
      </Paper>
    </Box>
  );
}

export default WriteDetailsPage;
