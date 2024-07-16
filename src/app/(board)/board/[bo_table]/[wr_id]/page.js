// src/app/(board)/board/[bo_table]/[wr_id]/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  Typography, Box, CircularProgress, Paper, Avatar,
  Grid, Button, ButtonGroup, CardMedia, Card
} from '@mui/material';
import DOMPurify from 'dompurify';
import { deepPurple } from '@mui/material/colors';
import Comment, { CommentForm } from '@/components/Comment';
import { get_img_url } from '@/utils/commonUtils';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';
import { fetchWriteRequest, deleteWriteRequest } from '@/app/axios/server_api';

async function deleteWrite(bo_table, wr_id) {
  const confirm = window.confirm('정말로 삭제하시겠습니까?');
  if (!confirm) {
    return;
  }

  try {
    const response = await deleteWriteRequest(bo_table, wr_id);
    if (response.data.result === 'deleted') {
      alert('게시물이 삭제되었습니다.');
      window.location.href = `/board/${bo_table}`;
    }
  } catch (error) {
    alert(error);
    console.error(error);
  }
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
      fetchWriteRequest(bo_table, wr_id)
        .then((response) => {
          setWrite(response.data);
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
          {(!write.mb_id || write.mb_id === memberInfo?.mb_id) && (
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
              <Button
                onClick={() => {deleteWrite(bo_table, wr_id)}}
                sx={{
                  borderWidth: "0px",
                  borderRadius: "10px",
                  backgroundColor: "#bfbfbf",
                  minHeight: "20px",
                  color: "black"
                }}
              >
                삭제
              </Button>
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
