// @/components/LatestGallerySlide.js

"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from "react-slick";
import { 
  Typography, 
  useMediaQuery, 
  useTheme,
  Box,
  CircularProgress,
  Paper,
  IconButton
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { truncateText, formatDate } from '@/utils/commonUtils';
import Board from '@/components/Board';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from 'next/link';

const CustomArrow = ({ direction, onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.8)' },
      ...(direction === 'left' ? { left: -20 } : { right: -20 }),
    }}
  >
    {direction === 'left' ? <ArrowBackIosNewIcon /> : <ArrowForwardIosIcon />}
  </IconButton>
);

const LatestGallery = ({ bo_table, view_type, rows }) => {
  const [boardData, setBoardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const isExtraLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.up('md'));

  const getSliderSettings = () => {
    if (isExtraLargeScreen) return { slidesToShow: 4, slidesToScroll: 4 };
    if (isLargeScreen) return { slidesToShow: 3, slidesToScroll: 3 };
    if (isMediumScreen) return { slidesToShow: 2, slidesToScroll: 2 };
    return { slidesToShow: 1, slidesToScroll: 1 };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/board-new/writes/${bo_table}`, {
          params: { bo_table, view_type, rows }
        });

        const data = response.data;
        if (Array.isArray(data)) {
          setBoardData(data);
        } else {
          console.error('API response data is not in the expected format:', data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bo_table, view_type, rows]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    ...getSliderSettings(),
    responsive: [
      {
        breakpoint: 1536,
        settings: { slidesToShow: 3, slidesToScroll: 3 }
      },
      {
        breakpoint: 1200,
        settings: { slidesToShow: 2, slidesToScroll: 2 }
      },
      {
        breakpoint: 900,
        settings: { slidesToShow: 1, slidesToScroll: 1 }
      }
    ],
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
    dotsClass: "slick-dots custom-dots",
  };

  return (
    <div>
      <Paper sx={{ mt: 2, p: 2, overflow: 'hidden', minHeight: '350px' }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', marginBottom: theme.spacing(3) }}>
          <Board bo_table={bo_table} />
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px' }}>
            <CircularProgress />
          </Box>
        ) : boardData.length > 0 ? (
          <Box sx={{ margin: '0 20px' }}>
            <Slider {...sliderSettings}>
              {boardData.map((board) => (
                <Link href={`/board/${bo_table}/${board.wr_id}`}>
                <Box key={board.wr_id} sx={{ padding: '0 16px' }}>
                  <Box
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '12px',
                      '&:hover img': {
                        transform: 'scale(1.05)',
                      },
                      margin: '0 8px',
                      height: '250px', // 고정 높이 설정
                    }}
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${board.thumbnail.src}`}
                      alt={truncateText(board.wr_subject, 20)}
                      style={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease-in-out',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                        padding: '20px 10px 10px',
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ color: 'white' }}>
                        {truncateText(board.wr_subject, 20)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'white' }}>
                        {formatDate(board.wr_datetime)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                </Link>
              ))}
            </Slider>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', marginTop: theme.spacing(4) }}>
            로딩중이거나 데이터가 없습니다.
          </Typography>
        )}
      </Paper>
      <style jsx global>{`
        .custom-dots {
          bottom: -30px;
        }
        .custom-dots li {
          margin: 0 8px;
        }
        .custom-dots li button:before {
          font-size: 12px;
          color: ${theme.palette.primary.main};
          opacity: 0.5;
        }
        .custom-dots li.slick-active button:before {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default LatestGallery;