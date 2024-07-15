import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import {
  Typography, Avatar, Stack, Box, Divider,
  TextField, Checkbox, FormControlLabel, Button
} from "@mui/material";
import { SubdirectoryArrowRight } from "@mui/icons-material";
import { get_img_url } from '@/utils/commonUtils';
import { useAuth } from '@/components/AuthContext';

export default function Comment({ index, comment }) {
  return (
    <Box key={index} sx={{ paddingLeft: comment.wr_comment_reply.length * 4 }}>
      <Divider sx={{ marginBottom: "10px" }} />
      <Stack direction="row" alignItems="flex-start" spacing={2} mb={2}>
        {comment.wr_comment_reply.length > 0 && <SubdirectoryArrowRight />}
        <Avatar
          alt={comment.wr_name}
          src={get_img_url(comment.mb_image_path)}
        />
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle1">{comment.wr_name}</Typography>
            <Typography variant="body2">{comment.wr_datetime}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body1">{comment.save_content}</Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

export function CommentForm({ commentLoading, setCommentLoading }) {
  const { bo_table, wr_id } = useParams();
  const { isLogin } = useAuth();
  const [error, setError] = useState('');
  const [commentFormValue, setCommentFormValue] = useState({
    wr_content: '',
    wr_name: '',
    wr_password: '',
    wr_secret_checked: false,
    comment_id: 0,
  });

  async function submitComment(bo_table, wr_id, formData) {
    const token = localStorage.getItem('accessToken');
    const dataToSend = {
      ...formData,
      wr_option: formData.wr_secret_checked ? 'secret' : 'html1',
    }
    let headers = {'Content-Type': 'application/json'}

    if (!dataToSend.wr_content) {
      setError('댓글을 입력해주세요.');
      return;
    }

    if (!isLogin) {
      if (!dataToSend.wr_name) {
        setError('작성자 이름을 입력해주세요.');
        return;
      }
      if(!dataToSend.wr_password) {
        setError('비밀번호를 입력해주세요.');
        return;
      }
    } else {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      setCommentLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/boards/${bo_table}/writes/${wr_id}/comments`,
        dataToSend,
        {headers: headers},
      );
      setCommentFormValue({
        wr_content: '',
        wr_name: '',
        wr_password: '',
        wr_secret_checked: false,
        comment_id: 0,
      });
      setError('');
      return response.data;
    } catch (error) {
      console.error(error);
      if (error.response.status === 429) {
        setError(error.response.data.message);
      } else {
        setError('댓글 등록에 실패했습니다.');
      }
    } finally {
      setCommentLoading(false);
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <TextField
        fullWidth
        multiline
        rows={1}
        variant="outlined"
        required
        name="variables.wr_content"
        placeholder="댓글을 입력하세요..."
        value={commentFormValue.wr_content}
        onChange={(e) => setCommentFormValue({
          ...commentFormValue,
          wr_content: e.target.value
        })}
        sx={{
          '& .MuiOutlinedInput-root': {
            padding: '8px 14px',
          },
        }}
      />
      <Box sx={{mt: 5}}>
        {!isLogin && (
          <Box sx={{display: "flex", flexWrap: "wrap", gap: "4%"}}>
          <TextField
            margin="normal"
            name="wr_name"
            label="작성자 이름"
            value={commentFormValue.wr_name}
            onChange={(e) => setCommentFormValue({
              ...commentFormValue,
              wr_name: e.target.value
            })}
            sx={{ width: "48%"}}
          />
          <TextField
            margin="normal"
            name="wr_password"
            label="비밀번호"
            type="password"
            value={commentFormValue.wr_password}
            onChange={(e) => setCommentFormValue({
              ...commentFormValue,
              wr_password: e.target.value
            })}
            sx={{ width: "48%"}}
          />
        </Box>
        )}
        {error && <Typography color="error" align="center" sx={{ mt: 2 }}>{error}</Typography>}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                name="variables.wr_secret_checked"
                size="small"
                checked={commentFormValue.wr_secret_checked}
                onChange={(e) => setCommentFormValue({
                  ...commentFormValue,
                  wr_secret_checked: e.target.checked
                })}
              />
            }
            label={<span style={{ fontSize: '0.875rem' }}>비밀댓글</span>}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            disabled={commentLoading}
            onClick={() => submitComment(bo_table, wr_id, commentFormValue)}
          >
            댓글등록
          </Button>
        </Box>
      </Box>
    </Box>
  );
}