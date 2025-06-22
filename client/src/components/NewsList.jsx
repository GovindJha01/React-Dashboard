import React, { useEffect, useState, useMemo } from "react";
import { fetchGuardian } from "../utils/newsApi";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Pagination,
  Typography,
  Chip,
  CircularProgress,
  Stack,
  TextField,
  MenuItem,
  Paper,
  Alert,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import NewsCharts from "../components/NewCharts.jsx";

export default function GuardianNewsList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [keyword, setKeyword] = useState("");
  const [author, setAuthor] = useState("");
  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchGuardian();
        setArticles(data);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
        setError(
          "Failed to load articles. Please check your connection or try again later."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, author, type, fromDate, toDate]);

  const authors = [...new Set(articles.map((a) => a.author))];

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesKeyword =
        article.title.toLowerCase().includes(keyword.toLowerCase()) ||
        article.author.toLowerCase().includes(keyword.toLowerCase());

      const matchesAuthor = author ? article.author === author : true;
      const matchesType = type ? article.type === type : true;

      const articleDate = new Date(article.publishedAt);
      const matchesFrom = fromDate ? articleDate >= fromDate : true;
      const matchesTo = toDate ? articleDate <= toDate : true;

      return (
        matchesKeyword &&
        matchesAuthor &&
        matchesType &&
        matchesFrom &&
        matchesTo
      );
    });
  }, [articles, keyword, author, type, fromDate, toDate]);

  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh", // or 100vh for full screen
          width: "100%",
        }}
      >
        <CircularProgress size={50} />
      </Box>
    );

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* FILTERS */}
      <Paper sx={{ p: 2, mb: 3 }}>
  <Stack
    spacing={2}
    direction={{ xs: "column", sm: "row" }}
    alignItems="center"
    flexWrap="wrap"
    justifyContent="space-between"
    useFlexGap
  >
    <TextField
      label="Search keyword"
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      size="small"
      sx={{ width: { xs: "100%", sm: "220px" } }}
    />

    <TextField
      select
      label="Filter by author"
      value={author}
      onChange={(e) => setAuthor(e.target.value)}
      size="small"
      sx={{ width: { xs: "100%", sm: "180px" } }}
    >
      <MenuItem value="">All</MenuItem>
      {authors.map((name, idx) => (
        <MenuItem key={idx} value={name}>
          {name}
        </MenuItem>
      ))}
    </TextField>

    <TextField
      select
      label="Filter by type"
      value={type}
      onChange={(e) => setType(e.target.value)}
      size="small"
      sx={{ width: { xs: "100%", sm: "160px" } }}
    >
      <MenuItem value="">All</MenuItem>
      <MenuItem value="news">News</MenuItem>
      <MenuItem value="blog">Blog</MenuItem>
    </TextField>

    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label="From"
        value={fromDate}
        onChange={setFromDate}
        slotProps={{
          textField: {
            size: "small",
            sx: { width: { xs: "100%", sm: "140px" } },
          },
        }}
      />
      <DatePicker
        label="To"
        value={toDate}
        onChange={setToDate}
        slotProps={{
          textField: {
            size: "small",
            sx: { width: { xs: "100%", sm: "140px" } },
          },
        }}
      />
    </LocalizationProvider>
  </Stack>
</Paper>


      <Box sx={{ mb: 3, width: "100%" }}>
        <NewsCharts articles={filteredArticles} />
      </Box>

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
          🗞️ Latest News and Blogs
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {filteredArticles
          .slice(
            (currentPage - 1) * articlesPerPage,
            currentPage * articlesPerPage
          )
          .map((article) => (
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              key={article.id}
              sx={{ width: "100%" }}
            >
              <Card>
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    component="a"
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      textDecoration: "none",
                      color: "primary.main",
                      fontWeight: 600,
                      "&:hover": {
                        textDecoration: "underline",
                        color: "primary.dark",
                      },
                    }}
                  >
                    {article.title}
                  </Typography>

                  <Typography variant="body2" color="textSecondary" noWrap>
                    {article.author} •{" "}
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip label="The Guardian" size="small" />
                    <Chip
                      label={article.type}
                      color={article.type === "blog" ? "secondary" : "primary"}
                      size="small"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
      {filteredArticles.length > articlesPerPage && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(filteredArticles.length / articlesPerPage)}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
