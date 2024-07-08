// src/app/(authentication)/signup/page.js

import React from 'react';
import { 
  Container, 
  Card, CardContent, Checkbox, FormControlLabel, FormGroup, Button, Typography, Paper, Box, Divider } from '@mui/material';
import Image from 'next/image';

export default function Contact() {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
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
            <FormControlLabel control={<Checkbox />} label="회원가입약관의 내용에 동의합니다." />
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
            <FormControlLabel control={<Checkbox />} label="개인정보처리방침의 내용에 동의합니다." />
            <FormControlLabel control={<Checkbox />} label="위 내용에 모두 동의합니다." />
          </FormGroup>
          <Button variant="contained" color="primary" fullWidth style={{ marginTop: 20 }}>
            회원가입
          </Button>
          <Button variant="outlined" color="primary" fullWidth style={{ marginTop: 10 }}>
            취소
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
