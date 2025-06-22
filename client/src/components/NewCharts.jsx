import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import {
  Box,
  Typography,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";

const COLORS = ["#2196f3", "#f50057", "#4caf50", "#ff9800", "#9c27b0"];

export default function NewsCharts({ articles }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Pie: Articles by type
  const typeData = useMemo(() => {
    const counts = articles.reduce((acc, a) => {
      acc[a.type] = (acc[a.type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([type, value]) => ({
      name: type,
      value,
    }));
  }, [articles]);

  // Bar: Articles by author
  const authorData = useMemo(() => {
    const counts = articles.reduce((acc, a) => {
      acc[a.author] = (acc[a.author] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([author, count]) => ({
      author,
      count,
    }));
  }, [articles]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom></Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          mt: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            borderLeft: "6px solid",
            borderColor: "primary.main",
            pl: 2,
          }}
        >
          📊 Article Analytics
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Pie Chart */}
        <Grid item xs={12} md={6} lg={6} width={isMobile ? "100%" : "45%"}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              height: "100%",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Articles by Type
            </Typography>
            <Divider />
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {typeData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={6} lg={6} width={isMobile ? "100%" : "45%"}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              height: "100%",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Articles by Author
            </Typography>
            <Divider />
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={authorData}>
                <XAxis dataKey="author" tick={false} height={20} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill={theme.palette.primary.main}>
                  <LabelList dataKey="count" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
