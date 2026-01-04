import React, { useState, useRef, useEffect } from "react";
import { Box, Grid, Button, Typography, CssBaseline } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom"; // Added navigate
import api from "./../../Utils/Api.jsx"; // Make sure your axios instance or API helper is imported

const OtpInput = ({ length = 6, onChange }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (!/^\d?$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    onChange(newOtp.join(""));

    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(paste)) {
      const digits = paste.split("");
      setOtp(digits);
      onChange(digits.join(""));
      digits.forEach((_, idx) => {
        if (inputsRef.current[idx]) inputsRef.current[idx].value = digits[idx];
      });
      inputsRef.current[length - 1]?.focus();
    }
  };

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center" }}
      onPaste={handlePaste}
    >
      {otp.map((_, idx) => (
        <input
          key={idx}
          type="text"
          maxLength={1}
          ref={(el) => (inputsRef.current[idx] = el)}
          value={otp[idx]}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          style={{
            width: 40,
            height: 48,
            margin: "0 4px",
            textAlign: "center",
            fontSize: "1.2rem",
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
        />
      ))}
    </Box>
  );
};

const TotpPage = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { qrImage, email } = location.state || {}; // Include email if needed for backend

  const qrImageSrc =
    qrImage && qrImage.trim().startsWith("data:image")
      ? qrImage.trim()
      : qrImage
      ? `data:image/png;base64,${qrImage.trim()}`
      : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Email is missing! Cannot verify TOTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/user/verifyTotp", {
        email,
        token: code,
      });

      console.log("reached the totp to verify code", response.data);
      if (response.status === 200) {
        alert("TOTP Verified Successfully!");
      }
    } catch (error) {
      alert(error.response?.data?.message || "TOTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const isOtpComplete = code.length === 6;

  return (
    <Grid sx={{ display: "flex", flexDirection: "row" }}>
      <CssBaseline />
      <Grid
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
            Enter Verification Code
          </Typography>

          {qrImageSrc && (
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Scan this QR code using your authenticator app
              </Typography>
              <Box
                component="img"
                src={qrImageSrc}
                alt="TOTP QR Code"
                sx={{ width: 180, height: 180 }}
              />
            </Box>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            <OtpInput length={6} onChange={setCode} />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 4, mb: 1 }}
              disabled={!isOtpComplete || loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default TotpPage;
