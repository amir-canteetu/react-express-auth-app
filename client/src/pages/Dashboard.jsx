import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export default function Dashboard() {

  return (

      <Container fixed>
          <Box component="section" sx={{ p: 2, border: '1px dashed grey', alignContent:"center", textAlign:"center" }}>
            <p>This is the Dashboard page</p>
            <p>This page should be viewable by all users.</p>
          </Box>
      </Container>

  );
}
