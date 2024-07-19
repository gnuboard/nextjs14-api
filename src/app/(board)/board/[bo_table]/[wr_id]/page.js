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
import { FileDownloadCard } from '@/components/FileDownload';
import {
  fetchWriteRequest, fetchSecretWriteRequest,
  deleteWriteRequest, deleteNoneMemberWriteRequest,
} from '@/app/axios/server_api';

async function deleteWrite(bo_table, write) {
  let wr_password;

  if (!write.mb_id) {
    wr_password = prompt('비회원 게시글 삭제시 비밀번호가 필요합니다.');
    if (!wr_password) {
      return;
    }
  }

  const confirm = window.confirm('정말로 삭제하시겠습니까?');
  if (!confirm) {
    return;
  }

  try {
    let response;
    if (write.mb_id) {
      response = await deleteWriteRequest(bo_table, write.wr_id);
    } else {
      response = await deleteNoneMemberWriteRequest(bo_table, write.wr_id, wr_password);
    }

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
  const [password, setPassword] = useState('');
  let inputPassword;

  const getSecretWrite = async () => {
    if (!password) {
      inputPassword = prompt('비밀번호를 입력해주세요.');
      if (!inputPassword) {
        router.push(`/board/${bo_table}`);
        return;
      }
      setPassword(inputPassword);
    }

    const availablePassword = password || inputPassword;

    try {
      const response = await fetchSecretWriteRequest(bo_table, wr_id, availablePassword);
      if (response.status === 200) {
        setWrite(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      if (error.response.status === 403) {
        alert(error.response.data.detail);
      }
      router.push(`/board/${bo_table}`);
    }
  }

  useEffect(() => {
    if (bo_table && wr_id) {
      fetchWriteRequest(bo_table, wr_id)
        .then((response) => {
          setWrite(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching write details:', error);
          if (error.response.status === 403) {
            if (error.response.data.detail === '비밀글 입니다.') {
              getSecretWrite();
            }
          }
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
                onClick={() => {deleteWrite(bo_table, write)}}
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
        {write.images?.map((file, index) => (
          <FileDownloadCard key={index} bo_table={bo_table} wr_id={write.wr_id} fileName={file.bf_source} fileIndex={file.bf_no} downloadDate={file.bf_datetime} />
        ))}
        {write.normal_files?.map((file, index) => (
          <FileDownloadCard key={index} bo_table={bo_table} wr_id={write.wr_id} fileName={file.bf_source} fileIndex={file.bf_no} downloadDate={file.bf_datetime} />
        ))}
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
            bo_table={bo_table}
            write={write}
            comment={comment}
            commentLoading={commentLoading}
            setCommentLoading={setCommentLoading}
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
