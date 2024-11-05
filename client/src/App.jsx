import * as React from 'react';
import {  Outlet, Navigate } from "react-router-dom";
import Box from '@mui/material/Box';
import { useAuth } from "./context/AuthContext"; 
import Sidebar from './components/global-components/Sidebar';
import { Stack } from '@mui/material';
import Navbar from './components/global-components/Navbar';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function App() {

  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return (    
    <>
      <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>    
    </>
  ); 
  }  

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Box>
      <Navbar/>
      <Stack direction="row"  sx={{ marginTop: 2 }}>
        <Sidebar/>
        <Outlet />
      </Stack>
    </Box>
  );
}
