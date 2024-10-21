import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import HomeAppBar from '../components/global-components/HomeAppBar';

export default function Home() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <HomeAppBar/>
      </Grid>
    </Box>
  );
}
