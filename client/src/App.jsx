import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Payouts from "./pages/Payouts.jsx";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

export default function App() {
  const theme = createTheme({
    palette: {
      mode: "light", // Change to "dark" for dark mode support
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/payouts"
          element={
            <PrivateRoute>
              <Payouts />
            </PrivateRoute>
          }
        />
      
        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
