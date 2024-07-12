'use client';

import React, { useState } from 'react';
import axios from 'axios';
import {
  Container, CssBaseline, TextField, Grid, Checkbox, FormControlLabel,
  FormGroup, Button, Typography, Box, Divider
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export const Aggrement = ({
  allAgreed, setAllAgreed,
  policySignup, setPolicySignup,
  policyPrivacy, setPolicyPrivacy,
}) => {
  const toggleSignup = (e) => {
    setPolicySignup(e.target.checked);
    if (e.target.checked && policyPrivacy) {
      setAllAgreed(true);
    } else {
      setAllAgreed(false);
    }
  }

  const togglePrivacy = (e) => {
    setPolicyPrivacy(e.target.checked);
    if (e.target.checked && policySignup) {
      setAllAgreed(true);
    } else {
      setAllAgreed(false);
    }
  }

  const toggleAll = (e) => {
    setAllAgreed(e.target.checked);
    if (e.target.checked) {
      setPolicySignup(true);
      setPolicyPrivacy(true);
    } else {
      setPolicySignup(false);
      setPolicyPrivacy(false);
    }
  }
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        회원가입약관
      </Typography>
      <Button variant="contained" color="primary" fullWidth style={{ marginBottom: 20 }}>
        SNS 계정으로 가입
      </Button>
      <Typography variant="body1" gutterBottom>
        회원가입약관
      </Typography>
      <Box component="div" style={{ height: 100, overflowY: 'scroll', border: '1px solid #ccc', padding: 10 }}>
        <Typography variant="body2">
          제13조 재화 등의 공급
          1. "플랫폼"은 이용자와 재화 등의 공급시기에 관하여 별도의 약정이 없는 이상, 이용자가 청약을 한 날부터 7일 이내에 재화 등을 배송할 수 있도록 주문제작, 포장 등 기타의 필요한 조치를 취합니다. 다만, "플랫폼"이 이미 재화 등의 대금의 전부 또는 일부를 받은 경우에는 대금의 전부 또는 일부를 받은 날부터 3영업일 이내에 조치를 취합니다. 이때 "플랫폼"은 이용자가 재화 등의 공급 절차 및 진행 사항을 확인할 수 있도록 적절한 조치를 합니다.
        </Typography>
      </Box>
      <FormGroup>
        <FormControlLabel control={<Checkbox checked={policySignup} onChange={toggleSignup} />} label="회원가입약관의 내용에 동의합니다." />
      </FormGroup>
      <Divider style={{ margin: '20px 0' }} />
      <Typography variant="body1" gutterBottom>
        개인정보처리방침
      </Typography>
      <Box component="div">
        <table style={{width: '100%'}}>
          <thead>
            <tr>
              <th>목적</th>
              <th>항목</th>
              <th>보유기간</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>이용자 식별 및 본인여부 확인</td>
              <td>아이디, 이름, 비밀번호</td>
              <td>회원 탈퇴 시까지</td>
            </tr>
            <tr>
              <td>서비스 이용에 관한 통지, CS대응을 위한 이용자 식별</td>
              <td>연락처 (이메일, 휴대전화 번호)</td>
              <td>회원 탈퇴 시까지</td>
            </tr>
          </tbody>
        </table>
      </Box>
      <FormGroup>
        <FormControlLabel control={<Checkbox checked={policyPrivacy} onChange={togglePrivacy} />} label="개인정보처리방침의 내용에 동의합니다." />
        <FormControlLabel control={<Checkbox />} checked={allAgreed} onChange={(event) => {toggleAll(event)}} label="위 내용에 모두 동의합니다." />
      </FormGroup>
    </Box>
  )
}

export const SignupForm = () => {
  const [formData, setFormData] = useState({
    mb_id: '',
    mb_password: '',
    mb_password_re: '',
    mb_name: '',
    mb_nick: '',
    mb_email: '',
    mb_mailling: false,
    mb_open: false,
  });

  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [idError, setIdError] = useState('');
  const [nickError, setNickError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Signup request
    setIsSignupLoading(true);
    setIdError('');
    setNickError('');
    setEmailError('');
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/members`, formData)
      if (response.status === 201) {
        alert(response.data.message);
        window.location.href="/login";
      } else {
        alert(response.status);
      }
    } catch (error) {
      console.error('Error creating member:', error);
      if (error.response.data.detail) {
        if (Array.isArray(error.response.data.detail)) {
          for (let detail of error.response.data.detail) {
            alert(detail.msg);
          }
        } else {
          const errorMsg = error.response.data.detail;
          if (errorMsg == "이미 가입된 아이디입니다.") {
            setIdError(errorMsg);
          } else if (errorMsg == "이미 존재하는 닉네임입니다.") {
            setNickError(errorMsg);
          } else if (errorMsg == "이미 가입된 이메일입니다.") {
            setEmailError(errorMsg);
          }
        }
      } else {
        alert(error);
      }
    } finally {
      setIsSignupLoading(false);
    }
  };

  return (
    <Container
      component="main"
      padding="0"
      sx={{
        borderWidth: 1,
        borderColor: 'gray',
        borderStyle: 'solid',
        borderRadius: '5px',
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            사이트 이용정보 입력
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="mb_id"
                label="아이디 (필수)"
                name="mb_id"
                value={formData.mb_id}
                onChange={handleChange}
              />
              {idError && <Typography color="error">{idError}</Typography>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="mb_password"
                label="비밀번호 (필수)"
                type="password"
                id="mb_password"
                value={formData.mb_password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="mb_password_re"
                label="비밀번호 확인 (필수)"
                type="password"
                id="mb_password_re"
                value={formData.mb_password_re}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              개인정보 입력
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="mb_name"
                  label="이름 (필수)"
                  name="mb_name"
                  value={formData.mb_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="mb_nick"
                  label="닉네임 (필수)"
                  name="mb_nick"
                  value={formData.mb_nick}
                  onChange={handleChange}
                />
                {nickError && <Typography color="error">{nickError}</Typography>}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="mb_email"
                  label="E-mail (필수)"
                  name="mb_email"
                  type="email"
                  value={formData.mb_email}
                  onChange={handleChange}
                />
                {emailError && <Typography color="error">{emailError}</Typography>}
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              기타 개인정보 설정
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="mb_mailling"
                  checked={formData.mb_mailling}
                  onChange={handleChange}
                />
              }
              label="정보 메일을 받겠습니다."
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="mb_open"
                  checked={formData.mb_open}
                  onChange={handleChange}
                />
              }
              label="다른분들이 나의 정보를 볼 수 있도록 합니다."
            />
          </Box>
          <Button
            disabled={isSignupLoading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isSignupLoading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};