// src/app/(board)/board/write/[bo_table]/page.js

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, TextField, Button, Box, FormControlLabel, Checkbox, Grid, Paper, Input } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '@/components/AuthContext';
import { useBoardConfig } from '@/hooks/useBoardConfig';
import MenuItem from '@mui/material/MenuItem';
import FileUpload from '@/components/FileUpload';
import { updateWriteRequest, fetchMemberRequest, fetchWriteRequest, fileUploadRequest } from '@/app/axios/server_api';

async function submitWriteUpdate(bo_table, wr_id, formData) {

  // 불리언 값을 문자열로 변환
  const dataToSend = {
    ...formData,
    html: formData.html ? 'html1' : '',
    mail: formData.mail ? 'mail' : '',
    secret: formData.secret ? 'secret' : '',
    notice: formData.notice ? true : false
  };

  try {
    const response = await updateWriteRequest(bo_table, wr_id, dataToSend);
    return response.data;
  } catch (error) {
    console.error('Error submitting write:', error);
    throw error;
  }
}

export default function WritePage({ params }) {
  const { bo_table, wr_id } = params;
  const router = useRouter();
  const theme = useTheme();
  const { isLogin, memberInfo } = useAuth();
  const { boardConfig, loading, error: boardError } = useBoardConfig(bo_table);

  const [formValues, setFormValues] = useState({
    wr_subject: '',
    wr_content: '',
    wr_name: '',
    wr_password: '',
    wr_email: '',
    wr_homepage: '',
    wr_link1: '',
    wr_link2: '',
    wr_option: '',
    html: false,
    mail: false,
    secret: false,
    ca_name: '',
    notice: false,
    parent_id: 0,
    wr_comment: true,
  });

  const [error, setError] = useState('');
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [writeData, setWriteData] = useState(null);

  useEffect(() => {
    fetchWriteRequest(bo_table, wr_id)
    .then(response => {
      if (response.data.mb_id) {
        fetchMemberRequest()
        .then(memberRes => {
          if (memberRes.data.mb_id !== response.data.mb_id) {
            console.error("작성자만 수정할 수 있습니다.");
            window.location.href="/";
            return;
          }
        })
      }
      return response.data;
    })
    .then(data => {
      setWriteData(data);
      const wrOptionList = data.wr_option.split(',');
      setFormValues(prevValues => ({
        ...prevValues,
        wr_subject: data?.wr_subject,
        wr_content: data?.wr_content,
        wr_name: data?.wr_name,
        wr_email: data?.wr_email,
        wr_link1: data?.wr_link1,
        wr_link2: data?.wr_link2,
        html: wrOptionList.includes('html1'),
        mail: wrOptionList.includes('mail'),
        secret: wrOptionList.includes('secret'),
      }));
    })
  }, [memberInfo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    if (!writeData.mb_id) {
      if (!formValues.wr_name) {
        setError('작성자 이름을 입력해주세요.');
        return;
      }
      if(!formValues.wr_password) {
        setError('비밀번호를 입력해주세요.');
        return;
      }
    }
  
    try {
      const response = await submitWriteUpdate(bo_table, wr_id, formValues);

      // 게시글이 작성된 후 wr_id를 받아서 file upload를 진행, upload할 파일이 없으면 게시글로 이동
      if (response.result === "updated") {
        const fileUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/boards/${bo_table}/writes/${wr_id}/files`;
        const formData = new FormData();
        file1 && formData.append('file1', file1);
        file2 && formData.append('file2', file2);
        if (!writeData.mb_id) {
          formData.append('wr_password', formValues.wr_password);
        }
        if (file1 || file2) {
          const fileResponse = await fileUploadRequest(bo_table, wr_id, formData);
          if (fileResponse.data.result !== "uploaded") {
            alert('게시글 작성 후 파일 업로드 중 오류가 발생했습니다.');
            console.log(fileResponse)
          }
        }
      } else {
        alert(response);
        console.log(response);
      }
      router.push(`/board/${bo_table}/${wr_id}`);
    } catch (error) {
      console.error('Error submitting write:', error);

      // 게시글 작성은 성공했지만 파일 업로드 중 오류가 발생한 경우는 alert후 게시글로 이동
      if (wr_id) {
        alert('게시글 작성 후 파일 업로드 중 오류가 발생했습니다.');
        router.push(`/board/${bo_table}/${wr_id}`);
      }

      if (error.response.status === 429) {
        setError(error.response.data.message);
      } else if (error.response && error.response.data && error.response.data.detail) {
        // detail이 배열인 경우 모든 에러 메시지를 결합
        if (Array.isArray(error.response.data.detail)) {
          const errorMessages = error.response.data.detail.map(err => err.msg).join(', ');
          setError(`Error(s): ${errorMessages}`);
        } else {
          // detail이 문자열인 경우 그대로 사용
          setError(`Error: ${error.response.data.detail}`);
        }
      } else {
        setError('An error occurred while submitting your post. Please try again.');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (boardError) {
    return <div>Error loading board settings.</div>;
  }

  return (
      <Paper elevation={3} sx={{ padding: 3, backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h4" gutterBottom align="center">
          {boardConfig.board.bo_subject} 글쓰기
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="wr_subject"
                label="제목"
                name="wr_subject"
                value={formValues.wr_subject}
                onChange={handleChange}
                autoFocus
                sx={{
                  backgroundColor: theme.palette.background.default,
                  borderRadius: 1,
                  boxSizing: 'border-box',
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="wr_content"
                label="내용"
                id="wr_content"
                value={formValues.wr_content}
                onChange={handleChange}
                multiline
                rows={2}
                sx={{
                  backgroundColor: theme.palette.background.default,
                  borderRadius: 1,
                  boxSizing: 'border-box',
                  minHeight: '9em',
                }}
                InputProps={{
                  sx: {
                    padding: '10px',
                  }
                }}
              />
            </Grid>
            {!writeData?.mb_id && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  name="wr_name"
                  label="작성자 이름"
                  id="wr_name"
                  value={formValues.wr_name}
                  onChange={handleChange}
                  sx={{
                    backgroundColor: theme.palette.background.default,
                    borderRadius: 1,
                    boxSizing: 'border-box',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  name="wr_password"
                  label="비밀번호"
                  id="wr_password"
                  type="password"
                  value={formValues.wr_password}
                  onChange={handleChange}
                  sx={{
                    backgroundColor: theme.palette.background.default,
                    borderRadius: 1,
                    boxSizing: 'border-box',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  name="wr_email"
                  label="작성자 메일"
                  id="wr_email"
                  value={formValues.wr_email}
                  onChange={handleChange}
                  sx={{
                    backgroundColor: theme.palette.background.default,
                    borderRadius: 1,
                    boxSizing: 'border-box',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  name="wr_homepage"
                  label="작성자 홈페이지"
                  id="wr_homepage"
                  value={formValues.wr_homepage}
                  onChange={handleChange}
                  sx={{
                    backgroundColor: theme.palette.background.default,
                    borderRadius: 1,
                    boxSizing: 'border-box',
                  }}
                />
              </Grid>
            </>
            )}
            {(boardConfig.board.bo_link_level == 1 || memberInfo?.mb_level >= boardConfig.board.bo_link_level) && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    name="wr_link1"
                    label="링크1"
                    id="wr_link1"
                    value={formValues.wr_link1}
                    onChange={handleChange}
                    sx={{
                      backgroundColor: theme.palette.background.default,
                      borderRadius: 1,
                      boxSizing: 'border-box',
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    name="wr_link2"
                    label="링크2"
                    id="wr_link2"
                    value={formValues.wr_link2}
                    onChange={handleChange}
                    sx={{
                      backgroundColor: theme.palette.background.default,
                      borderRadius: 1,
                      boxSizing: 'border-box',
                    }}
                  />
                </Grid>
              </>
            )}            
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                fullWidth
                name="wr_option"
                label="글 옵션"
                id="wr_option"
                value={formValues.wr_option}
                onChange={handleChange}
                sx={{
                  backgroundColor: theme.palette.background.default,
                  borderRadius: 1,
                  boxSizing: 'border-box',
                }}
              />
            </Grid>
            <Grid item xs={12}>
              {boardConfig.categories.length > 0 && (
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    fullWidth
                    name="ca_name"
                    label="분류"
                    id="ca_name"
                    value={formValues.ca_name}
                    onChange={handleChange}
                    select
                    sx={{
                      backgroundColor: theme.palette.background.default,
                      borderRadius: 1,
                      boxSizing: 'border-box',
                    }}
                  >
                    {boardConfig.categories.map((category, index) => (
                      <MenuItem key={index} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}
            </Grid>
            <Grid item xs={12}>
              <Input
                type="hidden"
                name="parent_id"
                id="parent_id"
                value={formValues.parent_id}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.html}
                    onChange={handleChange}
                    name="html"
                    color="primary"
                  />
                }
                label="HTML 사용 여부"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.mail}
                    onChange={handleChange}
                    name="mail"
                    color="primary"
                  />
                }
                label="메일발송 여부"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.secret}
                    onChange={handleChange}
                    name="secret"
                    color="primary"
                  />
                }
                label="비밀글 여부"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.notice}
                    onChange={handleChange}
                    name="notice"
                    color="primary"
                  />
                }
                label="공지글 여부"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.wr_comment}
                    onChange={handleChange}
                    name="wr_comment"
                    color="primary"
                  />
                }
                label="댓글 사용 여부"
              />
            </Grid>
            {
              boardConfig.board.bo_upload_level == 1 || boardConfig.board.bo_upload_level <= memberInfo?.mb_level 
              ? (
                <>
                <Grid item xs={12}>
                <FileUpload label="첨부파일 1" onFileSelect={(file) => setFile1(file)} />
                </Grid>
                <Grid item xs={12}>
                  <FileUpload label="첨부파일 2" onFileSelect={(file) => setFile2(file)} />
                </Grid>
                </>
                )
              : null
            }
          </Grid>
          {error && <Typography color="error" align="center" sx={{ mt: 2 }}>{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            제출
          </Button>
        </Box>
      </Paper>
  );
}
