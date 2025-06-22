import React, { use } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Stack,
  Tooltip,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArticleIcon from "@mui/icons-material/Article";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaymentsIcon from "@mui/icons-material/Payments";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, useLocation } from "react-router-dom";
import NewsList from "../components/NewsList";

const drawerWidth = 240;

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const isMobile = useMediaQuery("(max-width:579px)");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { label: "Payouts", path: "/payouts", icon: <PaymentsIcon /> },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6">News Dashboard</Typography>
      </Toolbar>
      <Divider />

      <List>
        {navItems.map((item, index) => (
          <ListItem
            button
            key={index}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}

        <Divider sx={{ my: 1 }} />

        <ListItem
          button
          onClick={handleLogout}
          sx={{
            cursor: "pointer", // 👈 Ensures pointer shows
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "primary.main",
          boxShadow: 2,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Project Title */}
          {!isMobile ? (
            <Typography
              variant="h6"
              noWrap
              sx={{ fontWeight: 600, letterSpacing: 1 }}
            >
              🧠 My Dashboard
            </Typography>
          ) : (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {/* Right side: user info + logout */}
          <Stack direction="row" spacing={2} alignItems="center" justifyContent={"flex-end"}>
            {currentUser && (
              <>
                <Tooltip title={currentUser.email}>
                  <Avatar sx={{ bgcolor: "secondary.main" }}>
                    {currentUser.email[0].toUpperCase()}
                  </Avatar>
                </Tooltip>
                <Typography variant="body1" sx={{ color: "white" }}>
                  {currentUser.email}
                </Typography>
              </>
            )}
            <Tooltip title="Logout">
              <IconButton
                onClick={handleLogout}
                sx={{ color: "white" }}
                size="large"
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Page Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` }, mt: 8 }}
      >
        <NewsList />
      </Box>
    </Box>
  );
}
