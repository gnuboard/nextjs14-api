// @/app/(home)/list/page.js

"use client";

import React, { useState } from 'react';
import { 
  List, 
  ListItem, 
  Pagination, 
  Container, 
  Paper,
  Box,
  Avatar,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const generateDummyData = () => {
  return Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    title: `게시글 제목 ${index + 1}`,
    author: `작성자${index + 1}`,
    date: new Date(2024, 6, index + 1).toLocaleDateString()
  }));
};

// 작성자 이니셜을 얻는 함수
const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const BoardList = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const boardName = "자유게시판";
  const posts = generateDummyData();
  const theme = useTheme();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedPosts = posts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div>
      <Paper sx={{ mt: 2, p: 2 }}>
        <Typography variant="h4" sx={{ mb: 2, fontSize: '1.5rem' }}>
          {boardName}
        </Typography>
        <List>
          {paginatedPosts.map((post) => (
            <ListItem 
              key={post.id} 
              disableGutters 
              sx={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                py: 1,
                borderBottom: `1px solid ${theme.palette.divider}`,
                '&:last-child': {
                  borderBottom: 'none',
                },
              }}
            >
              <Typography variant="body1" sx={{ flexGrow: 1, fontSize: '0.875rem' }}>
                {post.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <Avatar sx={{ mr: 1, width: 24, height: 24, fontSize: '0.75rem' }}>
                  {getInitials(post.author)}
                </Avatar>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                  {post.author}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', width: '80px', textAlign: 'right', fontSize: '0.75rem' }}>
                {post.date}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
};

export default BoardList;