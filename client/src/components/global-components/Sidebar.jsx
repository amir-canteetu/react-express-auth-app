import { Link } from "react-router-dom";
import SpeedIcon from '@mui/icons-material/Speed';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from "../../context/AuthContext"; 

import {
    AccountBox,
    Settings,
  } from "@mui/icons-material";
  import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
  } from "@mui/material";
  
  const Sidebar = ({mode,setMode}) => {

    const { user } = useAuth(); 

    return (
      <Box sx={{ display: { xs: "none", sm: "block" }}}>
        <Box position="fixed"  backgroundColor="#f7f7f7" >
          <List>
            <ListItem disablePadding>
              <ListItemButton component="a">
                <ListItemIcon>
                  <SpeedIcon />
                </ListItemIcon>
                <Link to={`/app`} style={{ textDecoration: 'none' }}>Dashboard</Link>
              </ListItemButton>
            </ListItem>

            {user.role === "admin" && (
            <>
              <ListItem disablePadding>
                <ListItemButton component="a">
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <Link to={`/app/settings`} style={{ textDecoration: 'none' }}>Admin</Link>
                </ListItemButton>
              </ListItem>
            </>
          )}

            <>
              <ListItem disablePadding>
                <ListItemButton component="a">
                  <ListItemIcon>
                    <AccountBox />
                  </ListItemIcon>
                  <Link to={`/app/profile`} style={{ textDecoration: 'none' }}>User</Link>
                </ListItemButton>
              </ListItem>
            </>

            <ListItem disablePadding>
              <ListItemButton component="a">
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <Link to={`/logout`} style={{ textDecoration: 'none' }}>Logout</Link>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>
    );
  };
  
  export default Sidebar;