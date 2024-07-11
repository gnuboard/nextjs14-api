// @/app/(home)/chat/page.js

"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Container, Box, TextField, Button, Typography, Paper, CircularProgress } from '@mui/material';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { role: 'system', content: '저는 그누보드5 전문가 입니다.\n무엇을 도와 드릴까요?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const sendMessage = async () => {
    if (!input || isLoading) return;

    const newMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: updatedMessages }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: data.response }]);
    } else {
      console.error(data.error);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const formatMessage = (content) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Chat with OpenAI
      </Typography>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          mb: 2, 
          height: '60vh', 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          fontSize: '1.2rem'
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1,
                  bgcolor: msg.role === 'user' ? 'primary.main' : 'grey.300',
                  color: msg.role === 'user' ? 'primary.contrastText' : 'black',
                  maxWidth: '80%',
                  fontSize: '0.95rem'
                }}
              >
                {formatMessage(msg.content)}
              </Box>
            </Box>
          ))}
          {isLoading && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1,
                  bgcolor: 'grey.300',
                  color: 'black',
                  maxWidth: '80%',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <CircularProgress size={20} sx={{ mr: 1 }} />
                답변 작성 중...
              </Box>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>
      </Paper>
      <Box sx={{ display: 'flex', mt: 2 }}>
        <TextField
          inputRef={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          fullWidth
          placeholder="메시지를 입력하세요..."
          autoComplete="off"
          disabled={isLoading}
          sx={{ 
            mr: 2,
            fontSize: '1.2rem',
          }}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={sendMessage} 
          disabled={isLoading}
          sx={{ fontSize: '1.2rem' }}
        > 
          전송
        </Button>
      </Box>
    </Container>
  );
};

export default ChatPage;