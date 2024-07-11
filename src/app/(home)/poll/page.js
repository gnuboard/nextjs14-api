"use client";

// components/Poll.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Container,
  Radio,
} from '@mui/material';

const Poll = () => {
  const [pollData, setPollData] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/polls/latest`);
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

  const handleSubmit = async () => {
    if (selectedOptionIndex < 1 || selectedOptionIndex > 9) {
      setError('Invalid option selected.');
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/polls/${pollData.po_id}/${selectedOptionIndex}`);
      setError(''); // Clear error message on successful submission
      alert('Vote submitted successfully!');
    } catch (error) {
      console.error('Error submitting vote:', error);
      setError('You are not authorized to vote or have already voted.');
    }
  };

  if (!pollData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="sm">
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
        <Grid container justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!selectedOption}
            sx={{ mt: 2 }}
          >
            투표하기
          </Button>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Poll;
