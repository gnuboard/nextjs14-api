// src/app/(authentication)/signup/page.js
'use client';

import React, { useState } from 'react';
import { Button, Paper, Box } from '@mui/material';
import { Aggrement, SignupForm } from '../../../components/Signup';

export default function Contact() {
  const [allAgreed, setAllAgreed] = useState(false);
  const [policySignup, setPolicySignup] = useState(false);
  const [policyPrivacy, setPolicyPrivacy] = useState(false);
  const [togglePressed, setTogglePressed] = useState(false);
  const toggleForm = () => {setTogglePressed(!togglePressed)};

  return (
    <div>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          {
            togglePressed ?
            <SignupForm /> :
            <Aggrement
              allAgreed={allAgreed} setAllAgreed={setAllAgreed}
              policySignup={policySignup} setPolicySignup={setPolicySignup}
              policyPrivacy={policyPrivacy} setPolicyPrivacy={setPolicyPrivacy}
            />
          }
          <Button disabled={!allAgreed} onClick={toggleForm} variant="contained" color="primary" fullWidth style={{ marginTop: 20 }}>
            {!togglePressed ? '다음' : '이전'}
          </Button>
          <Button variant="outlined" color="primary" fullWidth style={{ marginTop: 10 }}>
            취소
          </Button>
        </Paper>
      </Box>
    </div>
  );
}