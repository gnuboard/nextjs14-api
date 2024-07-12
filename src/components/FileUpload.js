import React, { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function FileUpload({ onFileSelect, label }) {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFileName(selectedFile ? selectedFile.name : '');
    if (onFileSelect) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, margin: '10px 0' }}>
      <input
        accept="*/*"
        style={{ display: 'none' }}
        id={`contained-button-file-${label}`}
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor={`contained-button-file-${label}`}>
        <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
          {label || 'Select File'}
        </Button>
      </label>
      <Typography variant="body2" noWrap>
        {fileName ? `Selected file: ${fileName}` : '선택된 파일이 없습니다.'}
      </Typography>
    </Box>
  );
}