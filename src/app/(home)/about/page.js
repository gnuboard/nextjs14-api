import React from 'react';
import { Typography, Box } from '@mui/material';

const About = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        About
      </Typography>
      <Typography variant="body1">
        This is the content of About page.
      </Typography>
      <Typography variant="body1">
        Add your About specific content here.
      </Typography>
    </Box>
  );
};

export default About;