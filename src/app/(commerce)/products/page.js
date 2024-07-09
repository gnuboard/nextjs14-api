// @/app/(home)/products/page.js

"use client";

import React from 'react';
import { Typography, Box, Grid, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Link from 'next/link';
import { products } from '@/data/products';

export default function ProductsPage() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        제품소개
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} key={product.id}>
            <Card sx={{ display: 'flex', flexDirection: 'column', borderRadius: 2, overflow: 'hidden' }}>
              <CardActionArea component={Link} href={`/products/item/${product.id}`}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 0,
                    paddingTop: '100%', // 1:1 비율을 유지하기 위해 패딩 탑을 100%로 설정
                    backgroundImage: `url(${product.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '8px 8px 0 0'
                  }}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
