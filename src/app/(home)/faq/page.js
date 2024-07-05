import React from 'react';
import { Typography, Box } from '@mui/material';

const Faq = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        FAQ
      </Typography>
      <Typography variant="body1">
        This is the content of FAQ page.
      </Typography>
      <Typography variant="body1">
        Add your FAQ specific content here.
      </Typography>
    </Box>
  );
};

export default Faq;