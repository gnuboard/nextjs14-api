// app/(board)/board/[bo_table]/Search.js
import React from 'react';
import { TextField, Button, MenuItem, FormControl, Select, InputLabel, Box } from '@mui/material';

export default function Search({ sfl, stx, onSflChange, onStxChange, onSubmit }) {
  return (
    <Box component="form" sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="search-field-label">검색 필드</InputLabel>
        <Select
          labelId="search-field-label"
          value={sfl}
          onChange={(e) => onSflChange(e.target.value)}
          label="검색 필드"
        >
          <MenuItem value="wr_subject">제목</MenuItem>
          <MenuItem value="wr_content">내용</MenuItem>
          <MenuItem value="wr_subject||wr_content">제목+내용</MenuItem>
          <MenuItem value="mb_id,1">회원아이디</MenuItem>
          <MenuItem value="mb_id,0">회원아이디(코)</MenuItem>
          <MenuItem value="wr_name,1">글쓴이</MenuItem>
          <MenuItem value="wr_name,0">글쓴이(코)</MenuItem>
        </Select>
      </FormControl>
      <TextField 
        value={stx} 
        onChange={(e) => onStxChange(e.target.value)} 
        label="검색어" 
        variant="outlined" 
      />
      <Button variant="contained" onClick={onSubmit}>검색</Button>
    </Box>
  );
}