import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export default function Settings() {
  return (

        <Container fixed>
                <Box component="section" sx={{ p: 2, border: '1px dashed grey', alignContent:"center", textAlign:"center" }}>
                This is the Admin Settings page and should be accessible to admins only.
                </Box>
      </Container>


  );
}
