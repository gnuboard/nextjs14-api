// src/app/(commerce)/products/item/[id]/page.js

"use client";

import { useEffect, useState } from 'react';
import { products } from '@/data/products';
import { Typography, Box, Card, CardContent, CardMedia } from '@mui/material';

const ProductItemPage = ({ params }) => {
  const { id } = params;

  const [productData, setProductData] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch product data based on the id parameter
      const fetchProductData = async () => {
        // Find product data from the products array
        const data = products.find(product => product.id === parseInt(id));
        setProductData(data);
      };

      fetchProductData();
    }
  }, [id]);

  if (!productData) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {productData.name}
          </Typography>
        </CardContent>
        <CardMedia
          component="img"
          height="100%"
          image={productData.image}
          alt={productData.name}
        />
        <CardContent>
          <Typography variant="body1" paragraph>
            {productData.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {productData.details}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductItemPage;
