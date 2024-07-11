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
import { motion, AnimatePresence } from 'framer-motion';

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
      <AnimatePresence>
        {inView ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <CardMedia
                component="img"
                height="250"
                image={src}
                alt={alt}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/api/placeholder/800/600?text=Image+not+available";
                }}
              />
            </motion.div>
          </motion.div>
        ) : (
          <Box height="250px" display="flex" justifyContent="center" alignItems="center" bgcolor="grey.300">
            <CircularProgress />
          </Box>
        )}
      </AnimatePresence>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
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
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </motion.div>
  );
};

export default Home;