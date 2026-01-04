import React from "react";
import { Box, Typography, Button } from "@mui/material";

const PageNotFoundPage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
        p: 3,
      }}
    >
      <Typography variant="h1" sx={{ fontSize: "6rem", mb: 2 }}>
        😢
      </Typography>
      <Typography variant="h3" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 500, mb: 3 }}>
        Oops! The page you’re looking for doesn’t exist or has been moved.
        Please check the URL or return to the homepage.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        href="/"
        sx={{ textTransform: "none", px: 4, py: 1.5 }}
      >
        Go Back Home
      </Button>
    </Box>
  );
};

export default PageNotFoundPage;
