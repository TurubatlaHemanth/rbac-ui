import React, { use, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  CssBaseline,
  Link,
  FormControlLabel,
  Checkbox,
  Paper,
} from "@mui/material";
import { Email, Password } from "@mui/icons-material";
import api from "../../Utils/Api.jsx";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // ✅ stop page reload
    setLoading(true);

    const data = new FormData(event.currentTarget);

    const payload = {
      email: data.get("email"),
      password: data.get("password"),
    };

    try {
      const response = await api.post("/user/login", payload); // ✅ await

      const email = payload.email;
      if (response.status === 200 && response.data.qrImage != null) {
        console.log("Login successful", response.data);
        // ✅ redirect to TOTP page here
        navigate("/totp", {
          state: {
            qrImage: response.data.qrImage,
            email: email,
          },
        });
      }
      console.log("Reached the login page++>", response.status, response.data);
      if (response.status === 200) {
        console.log("Inside redirect==> ,", response.status);
        navigate("/totp", {
          state: {
            email,
          },
        });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false); // ✅ always stop loading
    }
  };

  return (
    <Grid sx={{ display: "flex", flexDirection: "row" }}>
      <Grid
        item
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          minHeight: "100vh",
          width: "50vw",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Your Company
        </Typography>
        <Typography variant="body1" align="center">
          Some tagline or description about the company.
        </Typography>
        <Box
          component="img"
          src="/logo.png"
          alt="Logo"
          sx={{ mt: 2, width: 120 }}
        />
      </Grid>
      <Grid
        item
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          minHeight: "100vh",
          width: "50vw",
        }}
      >
        <Box
          sx={{
            maxWidth: 400,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              fullWidth
              margin="normal"
              required
              size="small"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              fullWidth
              margin="normal"
              required
              size="small"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, mb: 1 }}
            >
              Login
            </Button>
            <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
              <Grid item>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
export default LoginPage;
