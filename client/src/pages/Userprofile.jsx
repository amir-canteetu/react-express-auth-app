import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useUserProfile } from '../api/User';

export default function Userprofile() {
  const { profile, error, loading } = useUserProfile();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading profile: {error.message}</div>;
  }

  return (
    <Container fixed>
      <Box
        component="section"
        sx={{ p: 2, border: '1px dashed grey', alignContent: "center", textAlign: "center" }}>
        {profile ? (
          <>
            <p>Good day {profile.username}.</p>
            <p>Your favourite colour is {profile.favColor}</p>
            <p>This profile should be viewable by only the profile owner.</p>
          </>          
        ) : (
          <p>Loading...</p>
        )}
      </Box>
    </Container>
  );
}
