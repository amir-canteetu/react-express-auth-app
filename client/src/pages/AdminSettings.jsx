import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useAdminSettings } from '../api/adminSettings';

export default function AdminSettings() {

  const {adminSettings, error, loading} = useAdminSettings();
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading AdminSettings: {error.message}</div>;
  }

  return (
    <Container fixed>
      <Box component="section" sx={{ p: 2, border: '1px dashed grey', alignContent: "center", textAlign: "center" }}>

        {adminSettings ? (
          <>
            <p>{adminSettings.message}</p>
            <p>Your admin theme setting is {adminSettings?.settings?.theme}</p>
            <p>This page should be viewable by Admins only.</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </Box>
    </Container>
  );
}