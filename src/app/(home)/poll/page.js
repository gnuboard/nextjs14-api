"use client";

// components/Poll.js

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Radio,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Card,
  CardContent,
  Divider,
  IconButton,
  Alert
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import {
  fetchLatestPollRequest, pollSurveyRequest,fetchPollResultsRequest,
  createPollEtcOpinionRequest, deletePollEtcOpinionRequest
} from '@/app/axios/server_api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Poll = () => {
  const [pollData, setPollData] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
  const [comment, setComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const response = await fetchLatestPollRequest();
        setPollData(response.data);
      } catch (error) {
        console.error('Error fetching poll data:', error);
      }
    };

    fetchPollData();
  }, []);

  const handleOptionChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    setSelectedOptionIndex([...Array(10).keys()].findIndex(i => pollData[`po_poll${i + 1}`] === value) + 1);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentNameChange = (event) => {
    setCommentName(event.target.value);
  };

  const handleSubmit = async () => {
    if (selectedOptionIndex < 1 || selectedOptionIndex > 9) {
      setError('Invalid option selected.');
      return;
    }

    try {
      await pollSurveyRequest(pollData.po_id, selectedOptionIndex);
      setError(''); // Clear error message on successful submission
      alert('Vote submitted successfully!');
      fetchPollResults(pollData.po_id);
    } catch (error) {
      console.error('Error submitting vote:', error);
      if (error.response && error.response.data && error.response.data.detail) {
        setError(error.response.data.detail);
        if (error.response.data.detail.includes('이미 참여하셨습니다')) {
          fetchPollResults(pollData.po_id);
        }
      } else {
        setError('You are not authorized to vote or have already voted.');
      }
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim() || !commentName.trim()) {
      setError('Comment and name cannot be empty.');
      return;
    }

    try {
      await createPollEtcOpinionRequest(pollData.po_id, { pc_name: commentName, pc_idea: comment });
      console.log('Comment submitted:', comment); // Debugging
      setError(''); // Clear error message on successful comment submission
      alert('Comment submitted successfully!');
      setComment('');
      setCommentName('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Error submitting comment.');
    }
  };

  const fetchPollResults = async (pollId) => {
    try {
      const response = await fetchPollResultsRequest(pollId);
      setResults(response.data);
      setOpen(true);
    } catch (error) {
      console.error('Error fetching poll results:', error);
    }
  };

  const handleViewResults = () => {
    if (pollData) {
      fetchPollResults(pollData.po_id);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    
    const { po_id, pc_id } = commentToDelete;

    try {
      await deletePollEtcOpinionRequest(po_id, pc_id);
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
      fetchPollResults(po_id);
    } catch (error) {
      console.error('Error deleting comment:', error);
      if (error.response && error.response.data && error.response.data.detail === 'Not authenticated') {
        setAuthError(true);
      } else {
        setError('Error deleting comment.');
      }
    }
  };

  const openDeleteDialog = (comment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  const handleAuthErrorClose = () => {
    setAuthError(false);
  };

  if (!pollData) {
    return <Typography>Loading...</Typography>;
  }

  const chartData = results ? {
    labels: results.items.map(item => item.subject),
    datasets: [{
      label: '투표수',
      data: results.items.map(item => item.count),
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 1,
    }]
  } : null;

  return (
    <div>
      <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{pollData.po_subject}</Typography>
        </Box>
        <Box component="form" sx={{ mt: 2 }}>
          {[...Array(10).keys()].map((i) => {
            const optionKey = `po_poll${i + 1}`;
            const optionValue = pollData[optionKey];
            return (
              optionValue && (
                <Box key={optionKey} sx={{ mb: 1 }}>
                  <label>
                    <Radio
                      value={optionValue}
                      checked={selectedOption === optionValue}
                      onChange={handleOptionChange}
                    />
                    {optionValue}
                  </label>
                </Box>
              )
            );
          })}
        </Box>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Grid container justifyContent="flex-end" spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!selectedOption}
              sx={{ mt: 2 }}
            >
              투표하기
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="success"
              onClick={handleViewResults}
              sx={{ mt: 2 }}
            >
              결과보기
            </Button>
          </Grid>
        </Grid>
        {pollData.po_etc && (
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={2}>
                <TextField
                  label="작성자"
                  value={commentName}
                  onChange={handleCommentNameChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={10}>
                <TextField
                  label="기타 의견"
                  value={comment}
                  onChange={handleCommentChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              onClick={handleCommentSubmit}
              sx={{ mt: 2 }}
            >
              의견 제출
            </Button>
          </Box>
        )}
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{pollData.po_subject}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            설문조사 결과는 다음과 같습니다.
          </DialogContentText>
          {results && (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                전체 투표수: {results.total_vote}
              </Typography>
              {chartData && <Bar data={chartData} />}
              {results.etcs && results.etcs.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mt: 4 }}>
                    기타 의견
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {results.etcs.map((etc, index) => (
                      <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box>
                              <Typography variant="subtitle1" gutterBottom>
                                작성자: {etc.pc_name}
                              </Typography>
                              <Typography variant="body2">
                                {etc.pc_idea}
                              </Typography>
                              {etc.pc_datetime && (
                                <Typography variant="caption" color="textSecondary">
                                  제출 시간: {format(new Date(etc.pc_datetime), 'yyyy-MM-dd HH:mm:ss')}
                                </Typography>
                              )}
                            </Box>
                            <IconButton onClick={() => openDeleteDialog({ po_id: pollData.po_id, pc_id: etc.pc_id })} color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="primary">
            창닫기
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog} maxWidth="sm" fullWidth>
        <DialogTitle>기타 의견 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            이 기타 의견을 삭제하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            취소
          </Button>
          <Button onClick={handleDeleteComment} color="error">
            삭제
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={authError} onClose={handleAuthErrorClose} maxWidth="sm" fullWidth>
        <DialogTitle>삭제 실패</DialogTitle>
        <DialogContent>
          <DialogContentText>
            삭제 권한이 없습니다. 글쓴이 본인과 최고관리자만 삭제할 수 있습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAuthErrorClose} color="primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Poll;
