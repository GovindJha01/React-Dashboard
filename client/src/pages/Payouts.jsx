import { useAuth } from "../context/AuthContext";
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Container,
  Stack,
  Divider,
  Button
} from "@mui/material";
import { fetchGuardian } from "../utils/newsApi";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export default function Payouts() {
  const [articles, setArticles] = useState([]);
  const [payoutRates, setPayoutRates] = useState({
    news: Number(localStorage.getItem("rate_news")) || 5,
    blog: Number(localStorage.getItem("rate_blog")) || 10,
  });

  const { currentUser } = useAuth();
  const isAdmin = currentUser?.email === "admin@gmail.com";

  // Load articles
  useEffect(() => {
    (async () => {
      const data = await fetchGuardian();
      setArticles(data);
    })();
  }, []);

  const handleCSVExport = () => {
    const csvData = authorPayouts.map((row) => ({
      Author: row.author,
      News: row.news,
      Blog: row.blog,
      "Total Payout (₹)": row.payout,
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "payouts.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handlePDFExport = () => {
    const doc = new jsPDF();
    doc.text("Article Payout Report", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Author", "News", "Blogs", "Total Payout (₹)"]],
      body: authorPayouts.map((r) => [
        r.author,
        r.news,
        r.blog,
        `₹ ${r.payout}`,
      ]),
    });
    doc.save("payouts.pdf");
  };

  // Handle payout change
  const handleRateChange = (type, value) => {
    const newRates = {
      ...payoutRates,
      [type]: Number(value),
    };
    setPayoutRates(newRates);
    localStorage.setItem(`rate_${type}`, value);
  };

  // Group articles by author and type
  const authorPayouts = useMemo(() => {
    const authors = {};

    for (let article of articles) {
      const { author, type } = article;
      if (!authors[author]) {
        authors[author] = { news: 0, blog: 0 };
      }
      authors[author][type]++;
    }

    return Object.entries(authors).map(([author, { news, blog }]) => {
      const payout = news * payoutRates.news + blog * payoutRates.blog;
      return { author, news, blog, payout };
    });
  }, [articles, payoutRates]);

  const totalPayout = authorPayouts.reduce((sum, a) => sum + a.payout, 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        💰 Article Payout Details
      </Typography>

      {isAdmin && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Set Payout Rates
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} mt={2}>
            <TextField
              label="News Rate (₹)"
              type="number"
              value={payoutRates.news}
              onChange={(e) => handleRateChange("news", e.target.value)}
            />
            <TextField
              label="Blog Rate (₹)"
              type="number"
              value={payoutRates.blog}
              onChange={(e) => handleRateChange("blog", e.target.value)}
            />
          </Stack>
        </Paper>
      )}
      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="outlined" onClick={handleCSVExport}>
          Export CSV
        </Button>
        <Button variant="outlined" onClick={handlePDFExport}>
          Export PDF
        </Button>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Author Payout Summary
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Author</strong>
              </TableCell>
              <TableCell>News</TableCell>
              <TableCell>Blogs</TableCell>
              <TableCell>Total Payout (₹)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {authorPayouts.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.author}</TableCell>
                <TableCell>{row.news}</TableCell>
                <TableCell>{row.blog}</TableCell>
                <TableCell>
                  <strong>₹ {row.payout}</strong>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3}>
                <strong>Total</strong>
              </TableCell>
              <TableCell>
                <strong>₹ {totalPayout}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
