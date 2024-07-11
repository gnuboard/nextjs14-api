"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CircularProgress,
  Box
} from '@mui/material';

const LazyImage = ({ src, alt }) => {
  const [inView, setInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <div ref={imgRef}>
      {inView ? (
        <CardMedia
          component="img"
          height="140"
          image={src}
          alt={alt}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/api/placeholder/800/600?text=Image+not+available";
          }}
        />
      ) : (
        <Box height="140px" display="flex" justifyContent="center" alignItems="center" bgcolor="grey.300">
          <CircularProgress />
        </Box>
      )}
    </div>
  );
};

const Home = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const imageUrls = Array(30).fill().map((_, i) =>
          `https://picsum.photos/seed/${Math.random()}/800/600`
        );
        setImages(imageUrls);
      } catch (error) {
        console.error("Failed to generate image URLs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom component="h1">
        Single Page Application Example
      </Typography>
      <Typography variant="body1" paragraph>
        스크롤을 내리면 이미지가 로드되는 것을 확인할 수 있습니다.
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {images.map((image, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card>
                <LazyImage src={image} alt={`Featured Item ${index + 1}`} />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Featured Item {index + 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This is a description of the featured item {index + 1}. It's really interesting and worth checking out!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default Home;