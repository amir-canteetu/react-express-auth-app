import { Link } from "react-router-dom";
import SpeedIcon from '@mui/icons-material/Speed';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from "../../context/AuthContext";

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ display: { xs: "none", sm: "block" } }}>
      <Box position="fixed" sx={{ backgroundColor: "#f7f7f7" }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/app">
              <ListItemIcon>
                <SpeedIcon />
              </ListItemIcon>
              Dashboard
            </ListItemButton>
          </ListItem>

          {user.role === "admin" && (
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/app/settings">
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                Admin
              </ListItemButton>
            </ListItem>
          )}

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/app/profile">
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              User
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/logout">
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              Logout
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
