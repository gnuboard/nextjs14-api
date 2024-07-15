// src/app/(board)/board/[bo_table]/[wr_id]/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  Typography, Box, CircularProgress, Paper, Avatar,
  Grid, Button, ButtonGroup, CardMedia, Card
} from '@mui/material';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { deepPurple } from '@mui/material/colors';
import Comment, { CommentForm } from '@/components/Comment';
import { get_img_url } from '@/utils/commonUtils';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';

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
  const [commentLoading, setCommentLoading] = useState(false);
  const { memberInfo } = useAuth();

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
  }, [bo_table, wr_id, commentLoading]);

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
      <Paper elevation={3} sx={{
         p: 4,
         maxWidth: '800px',
         width: '100%',
         '& img': {
            maxWidth: '100%',
            height: 'auto',
         }
      }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {write.wr_subject}
        </Typography>
        <Box display={"flex"} justifyContent={"space-between"}>
          <Box>
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
          </Box>
          {write.mb_id === memberInfo?.mb_id && (
            <Box>
              <Link href={`/board/${bo_table}/write/${wr_id}`}>
                <Button sx={{
                  borderWidth: "0px",
                  borderRadius: "10px",
                  backgroundColor: "#99ccff",
                  minHeight: "20px",
                  mr: "10px",
                  color: "black"
                  
                }}>
                  수정
                </Button>
              </Link>
            </Box>
          )}
        </Box>
        {write?.images.map((img, index) => (
          <Card key={`card_${index}`} sx={{boxShadow: 'none'}}>
            <CardMedia
              component="img"
              image={get_img_url(img.bf_file)}
              alt={`Image ${index + 1}`}
              sx={{
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'scale-down',
              }}
            />
          </Card>
        ))}
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
        <CommentForm
          commentLoading={commentLoading}
          setCommentLoading={setCommentLoading} 
        />
      </Paper>
    </Box>
  );
}

export default WriteDetailsPage;
