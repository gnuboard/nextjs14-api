// @/app/(commerce)/buy/page.js
"use client";

import React from 'react';
import { Typography, Box, Grid, Card, CardContent, CardMedia, CardActions, Button } from '@mui/material';
import { products } from '@/data/products';

const handleBuyNow = (productName) => {
  alert(`${productName}를(을) 구입하셨습니다!`);
};

export default function BuyPage() {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        구입하기
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ display: 'flex', flexDirection: 'column', borderRadius: 2, overflow: 'hidden' }}>
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
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleBuyNow(product.name)}>
                  구입하기
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
