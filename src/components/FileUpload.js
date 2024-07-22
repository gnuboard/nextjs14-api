import React, { useState, useCallback } from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone';

export default function FileUpload({ onFileSelect, label }) {
  const [fileName, setFileName] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFileName(selectedFile ? selectedFile.name : '');
    if (onFileSelect) {
      onFileSelect(selectedFile);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Box sx={{ margin: '10px 0' }}>
      <Paper
        {...getRootProps()}
        sx={{
          padding: 2,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <input {...getInputProps()} id={`contained-button-file-${label}`} />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1" align="center">
            {isDragActive
              ? '파일을 놓아주세요.'
              : '파일을 드래그하거나 클릭하여 업로드하세요.'}
          </Typography>
          <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
            {label || 'Select File'}
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          {fileName ? `첨부파일: ${fileName}` : '선택된 파일이 없습니다.'}
        </Typography>
      </Paper>
    </Box>
  );
}