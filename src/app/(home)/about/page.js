// @/app/(home)/about/page.js

"use client";

import React, { useEffect, useRef } from 'react';
import { Box, Typography, Container } from '@mui/material';

const CompanyPage = () => {
  const mapElement = useRef(null);

  useEffect(() => {
    const loadNaverMaps = () => {
      const naver = window.naver;
      const latitude  = 37.5032509;
      const longitude = 127.0465880;

      if (naver) {
        const mapOptions = {
          center: new naver.maps.LatLng(latitude, longitude),
          zoom: 17,
        };

        const map = new naver.maps.Map(mapElement.current, mapOptions);

        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(latitude, longitude),
          map: map,
          title: '클릭하세요'
        });

        const infowindow = new naver.maps.InfoWindow({
          content: '<div style="width:150px;text-align:center;padding:10px;"><b>(주)에스아이알소프트</b><br>주소: 서울 강남구 테헤란로 322 서관 1404호 (역삼동, 한신인터밸리24 빌딩)</div>'
        });

        naver.maps.Event.addListener(marker, "click", function() {
          infowindow.open(map, marker);
        });
      }
    };

    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`;
    script.onload = loadNaverMaps;
    document.head.appendChild(script);

    return () => {
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          (주)에스아이알소프트
        </Typography>
      </Box>
      
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          회사 소개
        </Typography>
        <Typography variant="body1" paragraph>
          저희 회사 홈페이지를 방문해 주셔서 감사합니다.
          (주)에스아이알소프트는 최첨단 기술과 혁신을 통해 최고의 솔루션을 제공합니다. 
          고객의 성공을 최우선으로 생각하며, 항상 높은 품질의 서비스를 제공하기 위해 노력하고 있습니다.
        </Typography>
        <Typography variant="body1" paragraph>
          저희는 다양한 산업 분야에서 풍부한 경험을 바탕으로, 고객의 요구에 맞춘 맞춤형 솔루션을 제공합니다. 
          지속적인 연구개발과 직원 교육을 통해 항상 최신 기술을 유지하고 있으며, 
          고객의 신뢰를 바탕으로 지속 성장하고 있습니다.
        </Typography>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          오시는 길
        </Typography>
        <Typography variant="body1" paragraph>
          저희 회사는 서울 강남구 테헤란로 322, 서관 1404호 (역삼동, 한신인터밸리24 빌딩)에 위치하고 있습니다. 아래 지도에서 정확한 위치를 확인하실 수 있습니다.
        </Typography>
      </Box>
      
      <Box ref={mapElement} sx={{ width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden' }}></Box>
    </div>
  );
};

export default CompanyPage;