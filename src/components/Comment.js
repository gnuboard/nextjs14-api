import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Typography, Avatar, Stack, Box, Divider,
  TextField, Checkbox, FormControlLabel, Button
} from "@mui/material";
import { SubdirectoryArrowRight } from "@mui/icons-material";
import LockIcon from '@mui/icons-material/Lock';
import { get_img_url } from '@/utils/commonUtils';
import { useAuth } from '@/components/AuthContext';
import {
  createCommentRequest, updateCommentRequest,
  deleteCommentRequest, deleteNoneMemberCommentRequest
} from '@/app/axios/server_api';

async function deleteComment(bo_table, wr_id, comment, setCommentLoading) {
  const confirm = window.confirm('정말로 삭제하시겠습니까?');
  if (!confirm) {
    return;
  }

  let wr_password;
  if (!comment.mb_id) {
    wr_password = prompt('비회원 댓글 삭제시 비밀번호가 필요합니다.');
    if (!wr_password) {
      return;
    }
  }

  setCommentLoading(true);
  try {
    let response;
    if (comment.mb_id) {
      response = await deleteCommentRequest(bo_table, wr_id, comment.wr_id);
    } else {
      response = await deleteNoneMemberCommentRequest(bo_table, wr_id, comment.wr_id, wr_password);
    }
    console.log(response);
    if (response.data.result === 'deleted') {
      alert('댓글이 삭제되었습니다.');
    }
  } catch (error) {
    if (error.response.status === 403) {
      alert('삭제할 권한이 없습니다.');
    } else {
      alert(error);
    }
    console.error(error);
  } finally {
    setCommentLoading(false);
  }
}

export default function Comment({ index, bo_table, write, comment, setCommentLoading }) {
  const { memberInfo } = useAuth();
  const [ editFormVisible, setEditFormVisible ] = useState(false);
  const editVisible = (
    comment.mb_id === memberInfo?.mb_id ||    // 댓글 작성자: 로그인 유저
    !comment.mb_id                            // 댓글 작성자: 비회원
  );
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
            {editVisible && (
              <>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    maxHeight: "20px",
                    padding: "0px",
                    minWidth: "unset",
                    width: "35px",
                  }}
                  onClick={() => setEditFormVisible(!editFormVisible)}
                >
                  <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                    수정
                  </Typography>
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    maxHeight: "20px",
                    padding: "0px",
                    minWidth: "unset",
                    width: "35px",
                    backgroundColor: 'gray',
                  }}
                  onClick={() => deleteComment(bo_table, write.wr_id, comment, setCommentLoading)}
                >
                  <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                    삭제
                  </Typography>
                </Button>
              </>
            )}
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            {comment.is_secret
              ? (
                <Typography variant="body1" onClick={() => console.log("비밀댓글 조회 함수 필요")} sx={{cursor: 'pointer'}}>
                  <LockIcon color="action" fontSize="small" /> {comment.save_content}
                </Typography>
              )
              : (
                <Typography variant="body1">
                  {comment.save_content}
                </Typography>
              )
            }
          </Stack>
        </Box>
      </Stack>
      <Box display={editFormVisible ? "block" : "none"} mb="10px">
        <UpdateCommentForm commentLoading={false} setCommentLoading={setCommentLoading} comment={comment} setEditFormVisible={setEditFormVisible} />
      </Box>
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
      const response = await createCommentRequest(bo_table, wr_id, dataToSend);
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
      <Divider />
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

export function UpdateCommentForm({ commentLoading, setCommentLoading, comment, setEditFormVisible }) {
  const { bo_table, wr_id } = useParams();
  const { memberInfo } = useAuth();
  const [error, setError] = useState('');
  const [commentFormValue, setCommentFormValue] = useState({
    wr_content: comment.save_content,
    wr_name: comment.wr_name,
    wr_password: '',
    wr_secret_checked: comment?.is_secret,
    comment_id: comment?.wr_id,
  });

  async function submitComment(bo_table, wr_id, formData) {
    const dataToSend = {
      ...formData,
      wr_option: formData.wr_secret_checked ? 'secret' : 'html1',
    }

    if (!dataToSend.wr_content) {
      setError('댓글을 입력해주세요.');
      return;
    }

    if (memberInfo?.mb_id !== comment.mb_id) {
      if(!dataToSend.wr_password) {
        setError('비밀번호를 입력해주세요.');
        return;
      }
    }

    try {
      setCommentLoading(true);
      const response = await updateCommentRequest(bo_table, wr_id, dataToSend);
      setCommentFormValue(prevValue => ({
        ...prevValue,
        wr_password: '',
      }))
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
      setEditFormVisible(false);
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
        {memberInfo?.mb_id !== comment.mb_id && (
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
              display="none"
              disabled
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