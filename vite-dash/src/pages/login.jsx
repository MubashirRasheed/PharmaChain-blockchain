import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import Form from './loginForm';

const LoginPage = () => {
  const themeMode = localStorage.getItem('themeMode');
  const isNonMobile = useMediaQuery('(min-width: 1000px)');
  const theme = useTheme();
  const textColor = themeMode === 'Dark' ? 'white' : 'black';
  const backgroundColor = themeMode === 'Dark' ? '#1c2d38' : 'white';

  return (
    <Box display="flex" justifyContent="center" alignItems="center" padding='5em' height="100%">
      <Box width={isNonMobile ? '50%' : '93%'} p="2rem" borderRadius="1.5rem" boxShadow={theme.shadows[4]} sx={{ backgroundColor }}>
        <Box textAlign="center">
          <Typography fontWeight="500" variant="h5" sx={{ mb: '1.5rem' }} fontSize="24px" color={textColor}>Pharma Chain</Typography>

          <Form />
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
