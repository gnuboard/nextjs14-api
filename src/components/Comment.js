import React from 'react';
import {
  Typography, Avatar, Stack, Box, Divider,
  TextField, Checkbox, FormControlLabel, Button
} from "@mui/material";
import { SubdirectoryArrowRight } from "@mui/icons-material";
import { get_img_url } from '@/utils/commonUtils';

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

export function CommentForm() {
  
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
        sx={{
          '& .MuiOutlinedInput-root': {
            padding: '8px 14px',
          },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 2,
          mt: 5
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              name="variables.wr_secret_checked"
              size="small"
            />
          }
          label={<span style={{ fontSize: '0.875rem' }}>비밀댓글</span>}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="small"
        >
          댓글등록
        </Button>
      </Box>
    </Box>
  );
}