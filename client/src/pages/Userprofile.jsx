import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useUserProfile } from '../api/users';

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
          <p>Good day {profile.username}. Your favourite colour is {profile.favColor}</p>
        ) : (
          <p>Loading...</p>
        )}
      </Box>
    </Container>
  );
}
