import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, Typography, IconButton, Box, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export function FileDownloadCard(
  { bo_table, wr_id, fileName, fileIndex, downloadDate }
) {
  const textRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      const element = textRef.current;
      if (element) {
        setIsOverflowing(element.scrollWidth > element.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [fileName]);

  const TextComponent = (
    <Typography 
      ref={textRef}
      variant="body1" 
      component="div"
      sx={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}
    >
      {fileName}
    </Typography>
  );

  return (
    <a style={{ textDecoration: 'none' }} href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/boards/${bo_table}/writes/${wr_id}/files/${fileIndex}`}>
      <Card sx={{ mb: 1, height: 60 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
          <IconButton color="primary" sx={{ mr: 2 }}>
            <DownloadIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            {
              isOverflowing
              ? (
                <Tooltip title={fileName} arrow>
                  {TextComponent}
                </Tooltip>
              )
              : TextComponent
            }
            <Typography variant="caption" color="text.secondary">
              Date: {downloadDate}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </a>
  );
}