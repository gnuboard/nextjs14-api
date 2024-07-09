// @/app/(home)/contact/page.js

import React from 'react';
import { Typography, Box, Paper, Grid, Link } from '@mui/material';

const Contact = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        연락처
      </Typography>
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="body1" paragraph>
          질문이 있거나 저희와 연락하고 싶으시면, 아래 방법들을 통해 언제든지 연락해 주세요. 항상 도와드리기 위해 최선을 다하겠습니다.
        </Typography>
      </Paper>
      
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          회사 주소
        </Typography>
        <Typography variant="body1" paragraph>
        (주)에스아이알소프트<br />
        서울 강남구 테헤란로 322, 서관 1404호 (역삼동, 한신인터밸리24 빌딩) 
        </Typography>
      </Paper>
      
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          전화번호
        </Typography>
        <Typography variant="body1" paragraph>
          +82-2-1234-5678
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          이메일 주소
        </Typography>
        <Typography variant="body1" paragraph>
          sample-support@sir.kr
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          영업 시간
        </Typography>
        <Typography variant="body1" paragraph>
          월요일 ~ 금요일: 오전 9:00 - 오후 6:00<br />
          토요일, 일요일 및 공휴일: 휴무
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          소셜 미디어
        </Typography>
        <Typography variant="body1" paragraph>
          최신 소식과 제안을 받으려면 저희 소셜 미디어 채널을 팔로우하세요:
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Link href="https://facebook.com/gnuboard" target="_blank" rel="noopener" sx={{ color: 'inherit', textDecoration: 'none' }}>
              <Typography variant="body1">Facebook</Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href="https://twitter.com/gnuboard" target="_blank" rel="noopener" sx={{ color: 'inherit', textDecoration: 'none' }}>
              <Typography variant="body1">Twitter</Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href="https://linkedin.com/company/gnuboard" target="_blank" rel="noopener" sx={{ color: 'inherit', textDecoration: 'none' }}>
              <Typography variant="body1">LinkedIn</Typography>
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Contact;
