import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import api from "./../../Utils/Api.jsx";

const SignupPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const data = new FormData(event.currentTarget);

    const payload = {
      userName: data.get("userName"),
      email: data.get("email"),
      password: data.get("password"),
    };

    try {
      const response = api.post("/user/sign-up", payload);
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid sx={{ display: "flex", flexDirection: "row" }}>
      {/* LEFT PANEL */}
      <Grid
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          width: "50vw",
        }}
      >
        <Typography variant="h4">Your Company</Typography>
      </Grid>

      {/* RIGHT PANEL */}
      <Grid
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          width: "50vw",
        }}
      >
        <Box sx={{ maxWidth: 400, width: "100%" }}>
          <Typography variant="h5" align="center" gutterBottom>
            Sign Up
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="UserName"
              name="userName"
              fullWidth
              margin="normal"
              size="small"
              required
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              size="small"
              required
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              size="small"
              required
            />

            <TextField
              label="Enter Password Again"
              type="password"
              fullWidth
              margin="normal"
              size="small"
              required
            />

            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Remember me"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignupPage;
